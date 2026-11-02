// Bakes the two duck meshes (classic and Big Head) and the duck markings texture into shared.js (shared by the game and the Surface Map) — the game never builds a mesh.
// Run from the repo root after changing the drawing or this pipeline:   (once: cd tools && npm install)   node tools/build_duck_meshes.js
// Sources: the SHAPE from tools/duck_strip.png (DUCK_SHAPE=svg builds it from the SVG instead); the MARKINGS from tools/Duck_Sheet.svg when
// present (DUCK_SVG=… for another file; DUCK_STRIP=1 uses the strip's own pixel markings), each SVG view scaled and placed onto the strip's view.
//
// SHAPE. tools/duck_strip.png is four views (side-right, front, side-left, back), each pixel a section label (grey/40: 1 head,
// 2 body, 3 beak, 4 eye, 5 drawn line). A 3D field is built from them: the side silhouette, the width at each height from the front
// and back views (an elliptical cross-section per run of the side view), the beak's own width from the front view (a wide, flat,
// round-tipped duck bill — not a point), rounded over at the outline, and grooves where the strip draws lines and the mouth (so the
// dark fills an indent) with the eyes raised a little. The surface is extracted with surface nets on a 1 px grid — evenly sized
// triangles everywhere, so the back and belly (which face away from the side view) are not stretched — then smoothed. Big Head
// reshapes the classic mesh. Collision samples are the points farthest out in some direction (only those can be on an outline).
// MARKINGS. Beak, eye, line and mouth are baked as distance fields into one RGBA texture at 2× the strip, from masks that are
// up-sampled and smoothed at 4×, so the game draws them as smooth, crisp curves at any zoom instead of strip pixels.
// Each vertex keeps the strip pixel it came from plus its depth across, so every view is a straight projection of the smoothed mesh
// (no UV unwrap to relax): the SIDE view marks the side faces, the FRONT view the forward faces (the bill and the mouth band), and an
// optional TOP view — a fifth cell in the strip, beak to the right, the duck's centre line on the cell's middle row — the faces that
// look up (lines over the head and back). Where a face turns away from every drawn view the nearest view's marking is stretched;
// a view drawn for that direction is the fix, not smoothing the texture.
const fs=require('fs'),zlib=require('zlib'),path=require('path');
const GAME=path.join(__dirname,'..','chromatic_nebula.html'),OUT=process.env.DUCK_OUT||path.join(__dirname,'..','shared.js'), // the game holds the duck types (Big Head's proportions); shared.js holds the baked meshes
  STRIP=process.env.DUCK_STRIP&&process.env.DUCK_STRIP!=='1'?process.env.DUCK_STRIP:path.join(__dirname,'duck_strip.png');
function readPNG(file){ // 8-bit, non-interlaced PNG → first channel
  const b=fs.readFileSync(file);let o=8,w=0,h=0,ct=0;const idat=[];
  while(o<b.length){const len=b.readUInt32BE(o),type=b.toString('ascii',o+4,o+8),d=b.subarray(o+8,o+8+len);
    if(type==='IHDR'){w=d.readUInt32BE(0);h=d.readUInt32BE(4);ct=d[9];if(d[8]!==8||d[12])throw new Error('8-bit non-interlaced PNG only');}
    else if(type==='IDAT')idat.push(d);else if(type==='IEND')break;o+=12+len;}
  const bpp={0:1,2:3,4:2,6:4}[ct],raw=zlib.inflateSync(Buffer.concat(idat)),st=w*bpp,out=new Uint8Array(w*h),prev=new Uint8Array(st),cur=new Uint8Array(st);
  for(let y=0;y<h;y++){const f=raw[y*(st+1)],row=raw.subarray(y*(st+1)+1,(y+1)*(st+1));
    for(let x=0;x<st;x++){const a=x>=bpp?cur[x-bpp]:0,up=prev[x],c=x>=bpp?prev[x-bpp]:0;let v=row[x];
      if(f===1)v+=a;else if(f===2)v+=up;else if(f===3)v+=(a+up)>>1;else if(f===4){const p=a+up-c,pa=Math.abs(p-a),pb=Math.abs(p-up),pc=Math.abs(p-c);v+=(pa<=pb&&pa<=pc)?a:(pb<=pc?up:c);}
      cur[x]=v&255;}
    for(let x=0;x<w;x++)out[y*w+x]=cur[x*bpp];prev.set(cur);}
  return{w,h,data:out};}
// ── SOURCE: tools/Duck_Sheet.svg when present (vector: the markings are read at HU× the strip grid, so their curves are exact), else the
// label PNG. The SVG is rendered without its background and guide lines; each fill becomes a label by nearest colour: yellow = head/body
// (split at the neck), orange = bill, white = eye, black = drawn line. Its views sit side by side, found by their own bounds, and share one height.
const SVG=process.env.DUCK_SVG||path.join(__dirname,'Duck_Sheet.svg'),USE_SVG=!process.env.DUCK_STRIP&&fs.existsSync(SVG),SHAPE_SVG=USE_SVG&&(process.env.DUCK_SHAPE==='svg'||!fs.existsSync(STRIP));
const CW=149,CH=138,N=CW*CH,HU=USE_SVG?8:1,HW=CW*HU,HH=CH*HU,HN=HW*HH; // 1× strip grid (shape) and the HU× grid (markings)
const STRIP_LAB=(()=>{if(!fs.existsSync(STRIP))return null;const png=readPNG(STRIP),AW=png.w,o=[];for(let v=0;v<(AW>=5*CW?5:4);v++){const a=new Uint8Array(CW*CH);for(let y=0;y<CH;y++)for(let x=0;x<CW;x++)a[y*CW+x]=Math.round(png.data[y*AW+v*CW+x]/40);o.push(a);}return o;})();
const vb0=L=>{let x0=1e9,x1=-1,y0=1e9,y1=-1;for(let i=0;i<L.length;i++)if(L[i]){const x=i%CW,y=(i/CW)|0;x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}return{x0,x1,y0,y1};}; // a strip view's bounds
let LAB1=[],LABH=null,NECK=46,TOP=false;const BUMP=SHAPE_SVG; // BUMP: lines and eyes are shaded (bump) instead of carved into the mesh
if(USE_SVG){const {Resvg}=require('@resvg/resvg-js');let svg=fs.readFileSync(SVG,'utf8');const vb=/viewBox="([\d.\s-]+)"/.exec(svg)[1].split(/\s+/).map(Number);
  svg=svg.replace(new RegExp('<rect width="'+vb[2]+'" height="'+vb[3]+'"[^>]*/>'),'').replace(/<path[^>]*stroke="#EA00FF"[^>]*\/>/gi,''); // the background and the guides
  const draw=z=>new Resvg(svg,{fitTo:{mode:'zoom',value:z},background:'rgba(0,0,0,0)'}).render();
  const bounds=r=>{const W=r.width,H=r.height,p=r.pixels,col=new Uint32Array(W);let y0=H,y1=-1;for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(p[(y*W+x)*4+3]>127){col[x]++;if(y<y0)y0=y;if(y>y1)y1=y;}
    const seg=[];let a=-1;for(let x=0;x<=W;x++){if(x<W&&col[x]){if(a<0)a=x;}else if(a>=0){seg.push([a,x-1]);a=-1;}}return{seg,y0,y1};};
  const SB0=STRIP_LAB&&!SHAPE_SVG?STRIP_LAB.map(vb0):null; // registering onto the strip: each SVG view as tall as the strip's duck, centred on its view, tops aligned
  const pr=bounds(draw(4)),sc=(SB0?SB0[0].y1-SB0[0].y0+1:CH-10)/((pr.y1-pr.y0+1)/4),Z=sc*HU,R=draw(Z),B=bounds(R),P=R.pixels,RW=R.width; // sc: strip px per SVG unit (the duck fills the cell's height less 5 px a side, as tall as the pixel strip's duck)
  if(B.seg.length<4)throw new Error('expected 4 views in the SVG, found '+B.seg.length);TOP=B.seg.length>=5;
  const oy=SB0?B.y0-Math.min(...SB0.map(b=>b.y0))*HU:B.y0-5*HU; // (the sheet's top is its tallest view's, as is the strip's) // a fill by its look, not by nearest colour: edge pixels where yellow meets the black outline are dark ochre, which is
  const cls=(r,g,b)=>{const v=Math.max(r,g,b);return v<110?5:Math.min(r,g,b)>200?4:g/Math.max(1,r)>0.72?2:3;}; // nearer orange than black — but it is the outline
  LABH=B.seg.slice(0,TOP?5:4).map(([a,b],vi)=>{const ox=Math.round((a+b)/2-(SB0&&SB0[vi]?(SB0[vi].x0+SB0[vi].x1+1)/2*HU:HW/2)),L=new Uint8Array(HN);
    for(let y=0;y<HH;y++){const sy=oy+y;if(sy<0||sy>=R.height)continue;for(let x=0;x<HW;x++){const sx=ox+x;if(sx<0||sx>=RW)continue;const o=(sy*RW+sx)*4;if(P[o+3]<128)continue;
      const a=P[o+3]/255;L[y*HW+x]=cls(P[o]/a,P[o+1]/a,P[o+2]/a);}}
    const out=new Uint8Array(HN),st=[];for(let x=0;x<HW;x++)st.push(x,HN-HW+x);for(let y=0;y<HH;y++)st.push(y*HW,y*HW+HW-1); // holes: the sheet lets its black background show through
    while(st.length){const i=st.pop();if(out[i]||L[i])continue;out[i]=1;const x=i%HW;if(x>0)st.push(i-1);if(x<HW-1)st.push(i+1);if(i>=HW)st.push(i-HW);if(i<HN-HW)st.push(i+HW);} // (the pupils are holes), so an empty pixel
    for(let i=0;i<HN;i++)if(!L[i]&&!out[i])L[i]=5;return L;}); // the outside cannot reach is black line
  LAB1=LABH.map(L=>{const o=new Uint8Array(N);for(let y=0;y<CH;y++)for(let x=0;x<CW;x++){const n=[0,0,0,0,0,0];for(let j=0;j<HU;j++)for(let i=0;i<HU;i++)n[L[(y*HU+j)*HW+x*HU+i]]++;
    let k=0;if(n[0]*2<HU*HU){k=1;for(let c=2;c<6;c++)if(n[c]>n[k])k=c;}o[y*CW+x]=k;}return o;}); // 1×: empty unless mostly covered, else the commonest label
  {const fr=LAB1[1],hw=y=>{let a=-1,b=-1;for(let x=0;x<CW;x++)if(fr[y*CW+x]){if(a<0)a=x;b=x;}return a<0?0:b-a;};let t=0,bt=CH-1;while(t<CH&&!hw(t))t++;while(bt>t&&!hw(bt))bt--;
    let m=1e9;for(let y=t+Math.round((bt-t)*0.2);y<=t+Math.round((bt-t)*0.6);y++){const w=hw(y);if(w<m){m=w;NECK=y;}}} // the neck: the front view's narrowest row between head and body
  const head=(L,w,u)=>{const lim=NECK*u*w,st=[];for(let i=0;i<lim;i++)if(L[i]===4)st.push(i); // the head: what is joined to the eye above the neck (a wing tip that rises above it stays body)
    if(!st.length){for(let i=0;i<lim;i++)if(L[i]===2)L[i]=1;return;}const seen=new Uint8Array(lim);for(const i of st)seen[i]=1;
    while(st.length){const i=st.pop();if(L[i]===2)L[i]=1;const x=i%w;for(const j of [i-1,i+1,i-w,i+w]){if(j<0||j>=lim||seen[j]||!L[j]||(j===i-1&&x===0)||(j===i+1&&x===w-1))continue;seen[j]=1;st.push(j);}}};LAB1.forEach(L=>head(L,CW,1));LABH.forEach(L=>head(L,HW,HU));
  if(!SHAPE_SVG&&STRIP_LAB){LAB1=STRIP_LAB.slice(0,LABH.length);NECK=46;} // the shape is the strip's
  console.log('SVG markings:',B.seg.length,'views ·',sc.toFixed(2),'strip px per unit ·',SHAPE_SVG?'shape from the SVG · neck row '+NECK:'shape from the pixel strip');}
else{const png=readPNG(STRIP),AW=png.w;TOP=AW>=5*CW;for(let v=0;v<(TOP?5:4);v++){const a=new Uint8Array(N);for(let y=0;y<CH;y++)for(let x=0;x<CW;x++)a[y*CW+x]=Math.round(png.data[y*AW+v*CW+x]/40);LAB1.push(a);}}
const L=(v,x,y)=>LAB1[v][y*CW+x];
// ── labels on any grid (w×h, u px per strip px): the drawn outline is handed to the section beside it (a 3D duck has no outline), interior lines stay
function handOff(src,w,h,u){const lab=src.slice(),n=w*h,isIn=(x,y)=>x>=0&&y>=0&&x<w&&y<h&&lab[y*w+x]>0,R=2*u;
  for(let it=0;it<3*u;it++){const nb=lab.slice();let ch=0;for(let i=0;i<n;i++){if(lab[i]!==5)continue;const x=i%w,y=(i/w)|0;
    let near=0;for(let dy=-R;dy<=R&&!near;dy++)for(let dx=-R;dx<=R;dx++)if(!isIn(x+dx,y+dy)){near=1;break;}if(!near)continue;
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]]){const s=isIn(x+dx,y+dy)?lab[(y+dy)*w+x+dx]:0;if(s&&s!==5){nb[i]=s;ch=1;break;}}}lab.set(nb);if(!ch)break;}
  return lab;}
// outside the silhouette every pixel takes the nearest section's label: the smoothed 3D surface swells a little past the drawn outline,
// and a vertex there must still read the bill (or mouth) it belongs to, not the base colour
function extendOut(lab,n,w,h){w=w||CW;h=h||CH;const o=lab.slice(),T=w*h;for(let it=0;it<n;it++){const nb=o.slice();for(let i=0;i<T;i++){if(o[i])continue;const x=i%w,y=(i/w)|0;
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]]){const xx=x+dx,yy=y+dy;if(xx>=0&&yy>=0&&xx<w&&yy<h&&o[yy*w+xx]){nb[i]=o[yy*w+xx];break;}}}o.set(nb);}return o;}
const viewLabels=v=>handOff(LAB1[v],CW,CH,1);
const lab=viewLabels(0),labX=extendOut(lab,8);
const isIn=(x,y)=>x>=0&&y>=0&&x<CW&&y<CH&&lab[y*CW+x]>0;
// ── masks: beak, eye, mouth (lines in or right beside the beak), other lines
const M=k=>new Float32Array(k||N),mSil=M();for(let i=0;i<N;i++)if(lab[i])mSil[i]=1;
function masks(lab,w,h,u){w=w||CW;h=h||CH;u=u||1;const T=w*h,mBeak=M(T),mEye=M(T),mLine=M(T),mMouth=M(T);for(let i=0;i<T;i++){const s=lab[i];if(s===3)mBeak[i]=1;if(s===4)mEye[i]=1;}
  const db=edt(mBeak,w,h);for(let i=0;i<T;i++){if(lab[i]!==5)continue;if(db[i]<=2.9*u)mMouth[i]=1;else mLine[i]=1;} // within ~2 strip px of the bill: the mouth
  return{mBeak,mEye,mLine,mMouth};}
// the FRONT view's bill and mouth: from the front the mouth is a dark band between the upper bill and the lower jaw, which the side view
// cannot show (a side projection only reaches the bill's tip). Its mouth is the line pixels with bill both above and below, plus the
// bill's drawn top edge (bill just below, none above), which from ahead is the line over the bill between the eyes.
function frontMouth(labF,w,h,u){const fM=masks(extendOut(labF,8*u,w,h),w,h,u),out=M(w*h),up=new Float32Array(w*h),dn=new Float32Array(w*h);
  for(let x=0;x<w;x++){let last=-1e9;for(let y=0;y<h;y++){if(labF[y*w+x]===3)last=y;up[y*w+x]=y-last;}last=1e9;for(let y=h-1;y>=0;y--){if(labF[y*w+x]===3)last=y;dn[y*w+x]=last-y;}}
  for(let i=0;i<w*h;i++){if(!fM.mMouth[i]&&!fM.mLine[i])continue;const a=up[i],b=dn[i];if(a>0&&a<=9*u&&b>0&&b<=9*u)out[i]=1;} // only the band between the upper and lower bill (the face → bill edge is the colour change itself)
  return{mBeakF:fM.mBeak,mMouthF:out};}
const labF=viewLabels(1);let fc=0,fn=0;for(let i=0;i<N;i++)if(labF[i]===3){fc+=i%CW;fn++;}fc=fn?fc/fn:CW/2; // the front view's centre column: z = 0
// ── exact Euclidean distance transform (Felzenszwalb) and signed distance of a mask
function edt1(f,n){const d=new Float64Array(n),v=new Int32Array(n),z=new Float64Array(n+1);let k=0;v[0]=0;z[0]=-1e20;z[1]=1e20;
  for(let q=1;q<n;q++){let s=((f[q]+q*q)-(f[v[k]]+v[k]*v[k]))/(2*q-2*v[k]);while(s<=z[k]){k--;s=((f[q]+q*q)-(f[v[k]]+v[k]*v[k]))/(2*q-2*v[k]);}k++;v[k]=q;z[k]=s;z[k+1]=1e20;}
  k=0;for(let q=0;q<n;q++){while(z[k+1]<q)k++;d[q]=(q-v[k])*(q-v[k])+f[v[k]];}return d;}
function edt(on,w,h){const INF=1e20,g=new Float64Array(w*h);for(let i=0;i<w*h;i++)g[i]=on[i]>0.5?0:INF;
  const col=new Float64Array(h);for(let x=0;x<w;x++){for(let y=0;y<h;y++)col[y]=g[y*w+x];const r=edt1(col,h);for(let y=0;y<h;y++)g[y*w+x]=r[y];}
  const row=new Float64Array(w);for(let y=0;y<h;y++){for(let x=0;x<w;x++)row[x]=g[y*w+x];const r=edt1(row,w);for(let x=0;x<w;x++)g[y*w+x]=Math.sqrt(r[x]);}return g;}
function signedDist(mask,w,h){const inv=new Uint8Array(w*h),on=new Uint8Array(w*h);for(let i=0;i<w*h;i++){on[i]=mask[i]>0.5?1:0;inv[i]=1-on[i];}
  const dOut=edt(on,w,h),dIn=edt(inv,w,h),s=new Float32Array(w*h);for(let i=0;i<w*h;i++)s[i]=on[i]?dIn[i]-0.5:-(dOut[i]-0.5);return s;}
// MARKINGS as signed distance (strip px) on a fine grid: from the SVG's HU× labels directly; from the PNG, its 1× masks up-sampled to 4×
// and smoothed (the staircase becomes a smooth curve)
const U=USE_SVG?HU:4,UW=CW*U,UH=CH*U;
function upMask(m){const o=new Float32Array(UW*UH);for(let y=0;y<UH;y++)for(let x=0;x<UW;x++){const fx=(x+0.5)/U-0.5,fy=(y+0.5)/U-0.5,x0=Math.max(0,Math.min(CW-1,Math.floor(fx))),y0=Math.max(0,Math.min(CH-1,Math.floor(fy))),x1=Math.min(CW-1,x0+1),y1=Math.min(CH-1,y0+1),tx=Math.max(0,Math.min(1,fx-x0)),ty=Math.max(0,Math.min(1,fy-y0));
    o[y*UW+x]=(m[y0*CW+x0]*(1-tx)+m[y0*CW+x1]*tx)*(1-ty)+(m[y1*CW+x0]*(1-tx)+m[y1*CW+x1]*tx)*ty;}
  const tmp=new Float32Array(UW*UH),K=[0.06,0.24,0.4,0.24,0.06];
  for(let y=0;y<UH;y++)for(let x=0;x<UW;x++){let s=0;for(let k=-2;k<=2;k++){const xx=Math.max(0,Math.min(UW-1,x+k));s+=o[y*UW+xx]*K[k+2];}tmp[y*UW+x]=s;}
  for(let y=0;y<UH;y++)for(let x=0;x<UW;x++){let s=0;for(let k=-2;k<=2;k++){const yy=Math.max(0,Math.min(UH-1,y+k));s+=tmp[yy*UW+x]*K[k+2];}o[y*UW+x]=s;}
  return o;}
const sdfU=m=>{const s=signedDist(m.length===N&&U>1&&!USE_SVG?upMask(m):m,UW,UH);for(let i=0;i<s.length;i++)s[i]/=U;return s;}; // signed distance in strip px on the fine grid
const fine=v=>USE_SVG?handOff(LABH[v],HW,HH,HU):viewLabels(v),fineSide=fine(0),fineFront=fine(1);
const sM=USE_SVG?masks(extendOut(fineSide,8*HU,HW,HH),HW,HH,HU):masks(labX),fF=USE_SVG?frontMouth(fineFront,HW,HH,HU):frontMouth(labF,CW,CH,1);
const {mMouth}=masks(labX); // (1×: the bill's width in the shape)
const SB=sdfU(sM.mBeak),SE=sdfU(sM.mEye),SL=sdfU(sM.mLine),SM=sdfU(sM.mMouth),SBF=sdfU(fF.mBeakF),SMF=sdfU(fF.mMouthF),SNO=new Float32Array(UW*UH).fill(-3);
const tM=TOP?(USE_SVG?masks(extendOut(fine(4),8*HU,HW,HH),HW,HH,HU):masks(extendOut(viewLabels(4),8))):null; // the top view: row = depth across (middle row = 0), column = the side view's
const TOPS=TOP?[sdfU(tM.mBeak),sdfU(tM.mEye),sdfU((()=>{const m=M(tM.mLine.length);for(let i=0;i<m.length;i++)m[i]=Math.max(tM.mLine[i],tM.mMouth[i]);return m;})()),SNO]:null,PANELS=TOP?3:2;
// ── markings texture (128 = edge, 48 per strip px), views side by side: the SIDE view (RGBA = beak, eye, line, mouth), the FRONT view
// (R = beak, A = mouth; G, B empty) for surfaces that face forward, then (if drawn) the TOP view (R = beak, G = eye, B = line)
const TS=USE_SVG?4:2,TW=CW*TS*PANELS,TH=CH*TS,tex=new Uint8Array(TW*TH*4);
for(let y=0;y<TH;y++)for(let x=0;x<TW;x++){const pn=Math.floor(x/(CW*TS)),ux=Math.min(UW-1,Math.floor(((x-pn*CW*TS)+0.5)*U/TS)),uy=Math.min(UH-1,Math.floor((y+0.5)*U/TS)),k=uy*UW+ux,o=(y*TW+x)*4;
  [[SB,SE,SL,SM],[SBF,SNO,SNO,SMF],TOPS][pn].forEach((S,c)=>{tex[o+c]=Math.max(0,Math.min(255,Math.round(128+S[k]*48)));});}
// 1× coverage of a fine distance field — for grooves and raised eyes (the PNG source only: from the SVG they are shaded instead)
const cov1=S=>{const c=new Float32Array(N);for(let y=0;y<CH;y++)for(let x=0;x<CW;x++){let s=0;for(let j=0;j<U;j++)for(let i=0;i<U;i++)s+=S[(y*U+j)*UW+x*U+i]>0?1:0;c[y*CW+x]=s/(U*U);}return c;};
const cLine=BUMP?M():cov1(SL),cMouth=BUMP?M():cov1(SM),cEye=BUMP?M():cov1(SE);
{ // no grooves in the eyes (the pupils) or on the bill (its drawn ridges): only the mouth is carved there; the eyes stand proud
  const near=(lv,r)=>{const m=M();for(let i=0;i<N;i++)if(lab[i]===lv)m[i]=1;const d=edt(m,CW,CH);return i=>d[i]<=r;},nE=near(4,2.5),nB=near(3,1.5);
  for(let i=0;i<N;i++)if(nE(i)||nB(i))cLine[i]=0;}
// ── thickness: half-width of the body at every side-view pixel
const half=new Float32Array(CH),beakW=new Float32Array(CH);
for(let y=0;y<CH;y++){let w=0,n=0;for(const v of [1,3]){let a=-1,b=-1;for(let x=0;x<CW;x++)if(L(v,x,y)){if(a<0)a=x;b=x;}if(a>=0){w+=(b-a+1)/2;n++;}}half[y]=n?w/n:0;
  let a=-1,b=-1;for(let x=0;x<CW;x++)if(L(1,x,y)===3){if(a<0)a=x;b=x;}beakW[y]=a>=0?(b-a+1)/2:0;}
{const bw=beakW.slice();for(let y=0;y<CH;y++){let m=0;for(let k=-3;k<=3;k++){const yy=y+k;if(yy>=0&&yy<CH)m=Math.max(m,bw[yy]);}beakW[y]=m;}} // rows of the two views line up within a few px
let HSIL=null;const SIL=signedDist(mSil,CW,CH); // side silhouette, signed distance in strip px (+ inside)
const BSD=signedDist(Float32Array.from(lab,(l,i)=>l===3||mMouth[i]?1:0),CW,CH); // the side view's bill (signed distance)
let th=new Float32Array(N);const TH0=new Float32Array(N); // TH0: the head's own half-width at each side-view pixel, as if it had no bill
for(let y=0;y<CH;y++){let x=0;while(x<CW){if(!isIn(x,y)){x++;continue;}let b=x;while(b+1<CW&&isIn(b+1,y))b++;
  const c=(x+b)/2,hl=(b-x+1)/2,w=Math.min(half[y],hl*1.15);
  for(let k=x;k<=b;k++){const s=(k-c)/hl;let t=w*Math.sqrt(Math.max(0,1-s*s));
    if(lab[y*CW+k]===3||mMouth[y*CW+k]){const tip=Math.sqrt(Math.min(1,(b-k+0.5)/3));t=Math.max(t,beakW[y]*tip);} // the bill: as wide as the front view draws it, round-tipped
    th[y*CW+k]=t;}x=b+1;}}
{let hm=M();for(let i=0;i<N;i++)if(lab[i]&&lab[i]!==3&&!mMouth[i])hm[i]=1;HSIL=signedDist(hm,CW,CH); // the head without its bill: its outline and, per run, its own elliptical width
  for(let y=0;y<CH;y++){let x=0;while(x<CW){if(!hm[y*CW+x]){x++;continue;}let b=x;while(b+1<CW&&hm[y*CW+b+1])b++;const c=(x+b)/2,hl=(b-x+1)/2,w=Math.min(half[y],hl*1.15);
    for(let k=x;k<=b;k++){const s=(k-c)/hl,u=Math.min(1,Math.max(0,HSIL[y*CW+k])/7);TH0[y*CW+k]=w*Math.sqrt(Math.max(0,1-s*s))*Math.sqrt(1-(1-u)*(1-u));}x=b+1;}}}
for(let i=0;i<N;i++){if(!mSil[i])continue;const u=Math.min(1,Math.max(0,SIL[i])/7);th[i]*=Math.sqrt(1-(1-u)*(1-u));} // rounds over into the outline
for(let it=0;it<2;it++){const o=new Float32Array(N);for(let y=0;y<CH;y++)for(let x=0;x<CW;x++){const i=y*CW+x;if(!mSil[i])continue;let s=0,n=0;
  for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)if(isIn(x+dx,y+dy)){s+=th[(y+dy)*CW+x+dx];n++;}o[i]=s/n;}th=o;}
for(let i=0;i<N;i++)th[i]=Math.max(0,th[i]-1.4*Math.max(cLine[i],cMouth[i])+0.5*cEye[i]); // grooves under lines and the mouth; eyes stand a little proud
// ── implicit field on a 1 px grid and surface nets
const bil=(A,x,y)=>{x=Math.max(0,Math.min(CW-1.001,x));y=Math.max(0,Math.min(CH-1.001,y));const x0=x|0,y0=y|0,tx=x-x0,ty=y-y0,i=y0*CW+x0;return(A[i]*(1-tx)+A[i+1]*tx)*(1-ty)+(A[i+CW]*(1-tx)+A[i+CW+1]*tx)*ty;};
let tmax=0;for(let i=0;i<N;i++)tmax=Math.max(tmax,th[i]);
const VOX=BUMP?2.6:1.75,X0=-2,Y0=-2,Z0=-(Math.ceil(tmax)+3),NX=Math.ceil((CW+4)/VOX)+1,NY=Math.ceil((CH+4)/VOX)+1,NZ=Math.ceil(-2*Z0/VOX)+1;
const F=new Float32Array(NX*NY*NZ),fi=(i,j,k)=>(k*NY+j)*NX+i;const SK=3.5; // smooth-minimum radius, strip px
for(let j=0;j<NY;j++)for(let i=0;i<NX;i++){const x=X0+i*VOX,y=Y0+j*VOX,s=bil(SIL,x,y),t=bil(th,x,y);
  for(let k=0;k<NZ;k++){const z=Z0+k*VOX,b=t-Math.sqrt(z*z+4)+2,h=Math.max(0,Math.min(1,0.5+0.5*(b-s)/SK));F[fi(i,j,k)]=b+(s-b)*h-SK*h*(1-h);}} // smooth minimum: no crease where the outline meets the width profile
{ // a 3D Gaussian blur of the field: the voxel grain and the row-to-row steps of the strip melt away
  const K=[0.054,0.244,0.403,0.244,0.054],tmp=new Float32Array(F.length);
  const pass=(src,dst,step,n,idxOf)=>{for(let o=0;o<F.length;o++){const p=idxOf(o);let v=0;for(let k=-2;k<=2;k++){const q=Math.max(0,Math.min(n-1,p+k));v+=src[o+(q-p)*step]*K[k+2];}dst[o]=v;}};
  pass(F,tmp,1,NX,o=>o%NX);pass(tmp,F,NX,NY,o=>((o/NX)|0)%NY);pass(F,tmp,NX*NY,NZ,o=>(o/(NX*NY))|0);F.set(tmp);
}

function surfaceNets(){
  const P=[],I=[],cell=new Int32Array(NX*NY*NZ).fill(-1);
  const E=[[0,1],[2,3],[4,5],[6,7],[0,2],[1,3],[4,6],[5,7],[0,4],[1,5],[2,6],[3,7]],C=[[0,0,0],[1,0,0],[0,1,0],[1,1,0],[0,0,1],[1,0,1],[0,1,1],[1,1,1]];
  for(let k=0;k<NZ-1;k++)for(let j=0;j<NY-1;j++)for(let i=0;i<NX-1;i++){
    const v=C.map(c=>F[fi(i+c[0],j+c[1],k+c[2])]);let m=0;for(let q=0;q<8;q++)if(v[q]>0)m|=1<<q;if(m===0||m===255)continue;
    let sx=0,sy=0,sz=0,n=0;for(const [a,b] of E){if((v[a]>0)===(v[b]>0))continue;const t=v[a]/(v[a]-v[b]),A=C[a],B=C[b];sx+=A[0]+(B[0]-A[0])*t;sy+=A[1]+(B[1]-A[1])*t;sz+=A[2]+(B[2]-A[2])*t;n++;}
    cell[fi(i,j,k)]=P.length/3;P.push(X0+(i+sx/n)*VOX,Y0+(j+sy/n)*VOX,Z0+(k+sz/n)*VOX);}
  const quad=(a,b,c,d,flip)=>{if(a<0||b<0||c<0||d<0)return;if(flip)I.push(a,c,b,a,d,c);else I.push(a,b,c,a,c,d);};
  for(let k=1;k<NZ-1;k++)for(let j=1;j<NY-1;j++)for(let i=0;i<NX-1;i++){const f0=F[fi(i,j,k)]>0;if(f0===(F[fi(i+1,j,k)]>0))continue; // x edges
    quad(cell[fi(i,j-1,k-1)],cell[fi(i,j,k-1)],cell[fi(i,j,k)],cell[fi(i,j-1,k)],!f0);}
  for(let k=1;k<NZ-1;k++)for(let j=0;j<NY-1;j++)for(let i=1;i<NX-1;i++){const f0=F[fi(i,j,k)]>0;if(f0===(F[fi(i,j+1,k)]>0))continue; // y edges
    quad(cell[fi(i-1,j,k-1)],cell[fi(i-1,j,k)],cell[fi(i,j,k)],cell[fi(i,j,k-1)],!f0);}
  for(let k=0;k<NZ-1;k++)for(let j=1;j<NY-1;j++)for(let i=1;i<NX-1;i++){const f0=F[fi(i,j,k)]>0;if(f0===(F[fi(i,j,k+1)]>0))continue; // z edges
    quad(cell[fi(i-1,j-1,k)],cell[fi(i,j-1,k)],cell[fi(i,j,k)],cell[fi(i-1,j,k)],!f0);}
  return{P:Float32Array.from(P),I:Uint32Array.from(I)};}
const net=surfaceNets();
function sampleF(x,y,z){return sf(x,y,z);}
const sf=(x,y,z,A=F)=>{const gx=Math.max(0,Math.min(NX-1.001,(x-X0)/VOX)),gy=Math.max(0,Math.min(NY-1.001,(y-Y0)/VOX)),gz=Math.max(0,Math.min(NZ-1.001,(z-Z0)/VOX)),i=gx|0,j=gy|0,k=gz|0,tx=gx-i,ty=gy-j,tz=gz-k;
    let v=0;for(let c=0;c<8;c++){const a=c&1,b=(c>>1)&1,d=(c>>2)&1;v+=A[fi(i+a,j+b,k+d)]*(a?tx:1-tx)*(b?ty:1-ty)*(d?tz:1-tz);}return v;};
{ // every triangle faces outward: against the field's gradient (the field is positive inside)
  const P=net.P,I=net.I;let flips=0;
  for(let t=0;t<I.length;t+=3){const a=I[t]*3,b=I[t+1]*3,c=I[t+2]*3,ux=P[b]-P[a],uy=P[b+1]-P[a+1],uz=P[b+2]-P[a+2],wx=P[c]-P[a],wy=P[c+1]-P[a+1],wz=P[c+2]-P[a+2];
    const nx=uy*wz-uz*wy,ny=uz*wx-ux*wz,nz=ux*wy-uy*wx,mx=(P[a]+P[b]+P[c])/3,my=(P[a+1]+P[b+1]+P[c+1])/3,mz=(P[a+2]+P[b+2]+P[c+2])/3,e=0.5;
    const gx=sf(mx+e,my,mz)-sf(mx-e,my,mz),gy=sf(mx,my+e,mz)-sf(mx,my-e,mz),gz=sf(mx,my,mz+e)-sf(mx,my,mz-e);
    if(nx*gx+ny*gy+nz*gz>0){const s=I[t+1];I[t+1]=I[t+2];I[t+2]=s;flips++;}}
  console.log('surface nets:',P.length/3,'vertices,',I.length/3,'triangles,',flips,'re-oriented');
}
function smooth(P,I,iters){const nv=P.length/3,dg=new Int32Array(nv+1);for(let t=0;t<I.length;t++)dg[I[t]+1]+=2;for(let i=0;i<nv;i++)dg[i+1]+=dg[i];
  const adj=new Int32Array(dg[nv]),fl=dg.slice(0,nv),st=new Int32Array(nv+1);
  for(let t=0;t<I.length;t+=3)for(let k=0;k<3;k++){const a=I[t+k];adj[fl[a]++]=I[t+(k+1)%3];adj[fl[a]++]=I[t+(k+2)%3];}
  let wa=0;for(let i=0;i<nv;i++){st[i]=wa;const sl=adj.subarray(dg[i],dg[i+1]).sort();let last=-1;for(let k=0;k<sl.length;k++){const j=sl[k];if(j!==last){adj[wa++]=j;last=j;}}}st[nv]=wa;
  for(let it=0;it<iters;it++){const o=P.slice(),l=it%2?-0.53:0.5;for(let i=0;i<nv;i++){let sx=0,sy=0,sz=0,n=0;for(let k=st[i];k<st[i+1];k++){const j=adj[k];sx+=o[j*3];sy+=o[j*3+1];sz+=o[j*3+2];n++;}if(!n)continue;
    P[i*3]+=l*(sx/n-o[i*3]);P[i*3+1]+=l*(sy/n-o[i*3+1]);P[i*3+2]+=l*(sz/n-o[i*3+2]);}}}
smooth(net.P,net.I,BUMP?28:16); // Taubin: smooths what is left of the grain without shrinking
// ── Big Head: the head's own columns take the head scale about the neck, the body the body scale about its base
let bx=0,bn=0,hx=0,hn=0,bot=0,h0=CW,h1=0;for(let y=0;y<CH;y++)for(let x=0;x<CW;x++){const l=lab[y*CW+x];if(!l)continue;if(y<NECK){hx+=x;hn++;}else{bx+=x;bn++;}if(l!==2&&y<NECK){h0=Math.min(h0,x);h1=Math.max(h1,x);}bot=Math.max(bot,y);}
bx/=Math.max(1,bn);hx/=Math.max(1,hn);
function reshape(v,x,y,z){if(!v.head)return[x,y,z];const kb=v.bodyS,kh=v.head,B=[bx+(x-bx)*kb,bot+(y-bot)*kb,z*kb],nX=bx+(hx-bx)*kb,nY=bot+(NECK-bot)*kb,Hd=[nX+(x-hx)*kh,nY+(y-NECK)*kh,z*kh];
  const w=Math.max(0,Math.min(1,(NECK+4-y)/8))*Math.max(0,Math.min(1,1-Math.max(h0-x,x-h1,0)/6)),f=w*w*(3-2*w);return[B[0]+(Hd[0]-B[0])*f,B[1]+(Hd[1]-B[1])*f,B[2]+(Hd[2]-B[2])*f];}
function buildGeo(v){
  const nv=net.P.length/3;if(nv>65535)throw new Error('too many vertices for 16-bit indices: '+nv);
  const raw=new Float32Array(nv*3);for(let i=0;i<nv;i++){const r=reshape(v,net.P[i*3],net.P[i*3+1],net.P[i*3+2]);raw[i*3]=r[0];raw[i*3+1]=r[1];raw[i*3+2]=r[2];}
  let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(let i=0;i<nv;i++){x0=Math.min(x0,raw[i*3]);x1=Math.max(x1,raw[i*3]);y0=Math.min(y0,raw[i*3+1]);y1=Math.max(y1,raw[i*3+1]);}
  const cx=(x0+x1)/2,cy=(y0+y1)/2,pos=new Float32Array(nv*3);let R=0;
  for(let i=0;i<nv;i++){pos[i*3]=(raw[i*3]-cx)/CH;pos[i*3+1]=(cy-raw[i*3+1])/CH;pos[i*3+2]=raw[i*3+2]/CH;R=Math.max(R,Math.hypot(pos[i*3],pos[i*3+1],pos[i*3+2]));} // model units: 1 = strip cell height; x forward, y up, z across
  const idx=Uint16Array.from(net.I);
  let vol=0;for(let t=0;t<idx.length;t+=3){const a=idx[t]*3,b=idx[t+1]*3,c=idx[t+2]*3;vol+=pos[a]*(pos[b+1]*pos[c+2]-pos[b+2]*pos[c+1])-pos[a+1]*(pos[b]*pos[c+2]-pos[b+2]*pos[c])+pos[a+2]*(pos[b]*pos[c+1]-pos[b+1]*pos[c]);}
  if(vol<0)for(let t=0;t<idx.length;t+=3){const s=idx[t+1];idx[t+1]=idx[t+2];idx[t+2]=s;} // counter-clockwise outward, whatever the grid's handedness
  const nrm=new Float32Array(nv*3); // from the smooth field's gradient (outward = where it falls), in model axes (y up)
  for(let i=0;i<nv;i++){const x=net.P[i*3],y=net.P[i*3+1],z=net.P[i*3+2],e=0.75;
    let gx=-(sampleF(x+e,y,z)-sampleF(x-e,y,z)),gy=sampleF(x,y+e,z)-sampleF(x,y-e,z),gz=-(sampleF(x,y,z+e)-sampleF(x,y,z-e));const l=Math.hypot(gx,gy,gz)||1;
    nrm[i*3]=gx/l;nrm[i*3+1]=gy/l;nrm[i*3+2]=gz/l;}
  const bw=new Uint8Array(nv);for(let i=0;i<nv;i++){const x=net.P[i*3],y=net.P[i*3+1],z=net.P[i*3+2],sb=bil(BSD,x,y),c=v=>Math.max(0,Math.min(1,v)),out=Math.max(c(0.5-bil(HSIL,x,y)/1.5),c((Math.abs(z)-bil(TH0,x,y)-0.4)/1.6));bw[i]=Math.round(255*c(0.5+sb/1.5)*out);} // how much of the bill (vs the face) this vertex is: inside the side view's bill and outside the head as it would be without one (beyond its outline, or standing proud of its sides) — the bill is its own colour, whatever the drawings project there
  const uv=new Uint16Array(nv*3);for(let i=0;i<nv;i++)for(let c=0;c<3;c++)uv[i*3+c]=Math.max(0,Math.min(65535,Math.round((net.P[i*3+c]+(c===2?128:0))*256))); // the strip pixel it came from (before Big Head) and its depth across (+128), ×256
  const ext=new Set(),K=420;for(let k=0;k<K;k++){const z=1-2*(k+0.5)/K,r=Math.sqrt(1-z*z),a=k*2.39996323,dx=r*Math.cos(a),dy=r*Math.sin(a);
    let bi=0,bd=-1e9;for(let i=0;i<nv;i++){const d=pos[i*3]*dx+pos[i*3+1]*dy+pos[i*3+2]*z;if(d>bd){bd=d;bi=i;}}ext.add(bi);}
  const hp=[];for(const i of ext)hp.push(pos[i*3],pos[i*3+1],pos[i*3+2]);
  return{nv,R,pos,nrm,uv,bw,idx,hp:Float32Array.from(hp)};}
const html=fs.readFileSync(GAME,'utf8'),bh=/DUCK_TYPES\.bighead=\{[^}]*head:([\d.]+),bodyS:([\d.]+)/.exec(html);
if(!bh)throw new Error('Big Head proportions not found in the game');
const z64=a=>zlib.deflateRawSync(Buffer.from(a.buffer,a.byteOffset,a.byteLength),{level:9}).toString('base64');
// streams are delta-encoded per component with wrap-around (lossless): neighbours are close in grid order, so deltas compress far better
const dz=(a,k,bits)=>{const m=(1<<bits)-1,o=bits===8?new Uint8Array(a.length):new Uint16Array(a.length);for(let i=0;i<a.length;i++)o[i]=(a[i]-(i>=k?a[i-k]:0))&m;return z64(o);};
const qz=(a,k)=>Int32Array.from(a,v=>Math.round(v*k));
const C=buildGeo({}),B=buildGeo({head:+bh[1],bodyS:+bh[2]});
const enc=m=>({R:+m.R.toFixed(4),p:dz(qz(m.pos,32000),3,16),n:dz(qz(m.nrm,127),3,8),h:z64(Int16Array.from(m.hp,v=>Math.round(v*32000)))});
const data={nv:C.nv,tex:{w:TW,h:TH,s:CW,t:CH,f:+fc.toFixed(2),p:PANELS,b:BUMP?1:0,d:z64(tex)},i:dz(Int32Array.from(C.idx),1,16),u:dz(Int32Array.from(C.uv),3,16),w:dz(Int32Array.from(C.bw),1,8),
  classic:enc(C),bighead:enc(B)}; // both shapes share topology and markings coordinates (Big Head only moves vertices)
// self-check: decode exactly as the game does and compare
{const un=(t,k,bits,signed)=>{const r=zlib.inflateRawSync(Buffer.from(t,'base64')),a=bits===8?new Uint8Array(r.buffer,r.byteOffset,r.length):new Uint16Array(r.buffer,r.byteOffset,r.length/2),m=(1<<bits)-1,h=1<<(bits-1),o=new Int32Array(a.length);
    for(let i=0;i<a.length;i++){const v=((i>=k?o[i-k]:0)+a[i])&m;o[i]=signed&&v>=h?v-(m+1):v;}
    return o;};
  const ck=(name,got,want)=>{for(let i=0;i<want.length;i++)if(got[i]!==want[i])throw new Error(name+' mismatch at '+i+': '+got[i]+' vs '+want[i]);};
  ck('idx',un(data.i,1,16,false),C.idx);ck('uv',un(data.u,3,16,false),C.uv);ck('pos',un(data.classic.p,3,16,true),qz(C.pos,32000));ck('nrm',un(data.bighead.n,3,8,true),qz(B.nrm,127));}
// ── texture_maps/: everything the duck is textured from, as pictures to study (written on every bake) ──
{ const dir=path.join(__dirname,'texture_maps');fs.mkdirSync(dir,{recursive:true});
  const crc=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0;}return b=>{let c=0xFFFFFFFF;for(const x of b)c=t[(c^x)&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0;};})();
  const png=(file,w,h,rgb)=>{const raw=Buffer.alloc((w*3+1)*h);for(let y=0;y<h;y++){raw[y*(w*3+1)]=0;for(let x=0;x<w*3;x++)raw[y*(w*3+1)+1+x]=rgb[y*w*3+x];}
    const ch=(ty,d)=>{const l=Buffer.alloc(4);l.writeUInt32BE(d.length);const td=Buffer.concat([Buffer.from(ty),d]),c=Buffer.alloc(4);c.writeUInt32BE(crc(td));return Buffer.concat([l,td,c]);};
    const hd=Buffer.alloc(13);hd.writeUInt32BE(w,0);hd.writeUInt32BE(h,4);hd[8]=8;hd[9]=2;fs.writeFileSync(path.join(dir,file),Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),ch('IHDR',hd),ch('IDAT',zlib.deflateSync(raw)),ch('IEND',Buffer.alloc(0))]));};
  const COL=[[0,0,0],[255,230,0],[225,195,0],[255,128,0],[255,255,255],[40,40,40]];
  const labs=(file,Ls,w,h)=>{const n=Ls.length,o=new Uint8Array(w*n*h*3);Ls.forEach((L,v)=>{for(let y=0;y<h;y++)for(let x=0;x<w;x++){const c=COL[L[y*w+x]]||[255,0,255],j=(y*w*n+v*w+x)*3;o[j]=c[0];o[j+1]=c[1];o[j+2]=c[2];}});png(file,w*n,h,o);};
  labs('1_shape_labels.png',LAB1,CW,CH); // what the mesh is built from (head / body / bill / eye / line), one cell per view
  if(LABH)labs('2_marking_labels_svg.png',LABH,HW,HH); // the SVG's labels, registered onto the strip's views, at its fine grid
  const ch=(file,c)=>{const o=new Uint8Array(TW*TH*3);for(let i=0;i<TW*TH;i++){const v=tex[i*4+c];o[i*3]=o[i*3+1]=o[i*3+2]=v;}png(file,TW,TH,o);};
  ch('3_texture_R_bill.png',0);ch('3_texture_G_eye.png',1);ch('3_texture_B_line.png',2);ch('3_texture_A_mouth.png',3); // the markings texture's four channels: distance fields (mid-grey = the edge); left panel side view, right panel front view
  {const o=new Uint8Array(CW*CH*3);for(let i=0;i<N;i++){const b=Math.max(0,Math.min(1,0.5+BSD[i]/1.5));o[i*3]=Math.round(255*b);o[i*3+1]=Math.round(120*b+(lab[i]?60:0));o[i*3+2]=lab[i]?60:0;}png('4_bill_side_mask.png',CW,CH,o);} // where the side view counts as bill
  {const m=Math.max(...TH0,1),o=new Uint8Array(CW*CH*3);for(let i=0;i<N;i++){o[i*3]=Math.round(255*th[i]/m);o[i*3+1]=Math.round(255*TH0[i]/m);o[i*3+2]=0;}png('5_widths_with_and_without_bill.png',CW,CH,o);} // red: the half-width the mesh has, green: the head's own; red alone = the bill standing proud
}
const line='const DUCK_MESH='+JSON.stringify(data)+'; // baked by tools/build_duck_meshes.js — do not edit by hand';
const re=/^const DUCK_MESH=.*$/m;
const dst=fs.readFileSync(OUT,'utf8');if(!re.test(dst))throw new Error('DUCK_MESH line not found in '+OUT);fs.writeFileSync(OUT,dst.replace(re,()=>line));
console.log(TOP?'top view: yes':'top view: none in the strip (4 views)');console.log('baked classic + bighead:',data.nv,'vertices each,',C.idx.length/3,'triangles · markings',TW+'×'+TH,'· in the game:',(line.length/1024).toFixed(0)+' KB');
