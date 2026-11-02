// Bakes the two duck meshes (classic and Big Head) into chromatic_nebula.html — the game never builds a mesh.
// Run from the repo root after changing the strip or the pipeline:   node tools/build_duck_meshes.js
// SHAPE pipeline: the strip's side silhouette is inflated into a closed body; each row of it is cut into runs, and a run gets an
// elliptical cross-section whose width is the duck's width at that height in the front / back views (capped by the run's own
// length, so a beak or tail tip stays slim) — the visual hull of the three silhouettes — rounded at the outline and smoothed.
// Every vertex keeps its strip section (head, body, beak, eye, interior line) for the game's material shader. Big Head reshapes it.
const fs=require('fs'),zlib=require('zlib'),path=require('path');
const GAME=path.join(__dirname,'..','chromatic_nebula.html'),STRIP=path.join(__dirname,'duck_strip.png');
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
const png=readPNG(STRIP),duckLab=new Uint8Array(png.w*png.h);for(let i=0;i<duckLab.length;i++)duckLab[i]=Math.round(png.data[i]/40); // section labels: grey/40
const DUCK_CW=149,DUCK_CH=138,DUCK_NECK=[46,45,46,47],g=2; // one view cell of the strip (side-right, front, side-left, back); mesh on every 2nd pixel
function buildGeo(v){
const CW=DUCK_CW,CH=DUCK_CH,AW=CW*4,N=CW*CH,L=(vw,x,y)=>duckLab[y*AW+vw*CW+x];
  const half=new Float32Array(CH); // the duck's half-width at each height, from the front and back views
  for(let y=0;y<CH;y++){let w=0,n=0;for(const vw of [1,3]){let a=-1,b=-1;for(let x=0;x<CW;x++)if(L(vw,x,y)){if(a<0)a=x;b=x;}if(a>=0){w+=(b-a+1)/2;n++;}}half[y]=n?w/n:0;}
  const lab=new Uint8Array(N);for(let y=0;y<CH;y++)for(let x=0;x<CW;x++)lab[y*CW+x]=L(0,x,y);
  const isIn=(x,y)=>x>=0&&y>=0&&x<CW&&y<CH&&lab[y*CW+x]>0;
  const edge=new Uint8Array(N);for(let y=0;y<CH;y++)for(let x=0;x<CW;x++)if(isIn(x,y)&&(!isIn(x-1,y)||!isIn(x+1,y)||!isIn(x,y-1)||!isIn(x,y+1)))edge[y*CW+x]=1;
  for(let it=0;it<3;it++){const nb=lab.slice();for(let i=0;i<N;i++){if(lab[i]!==5)continue;const x=i%CW,y=(i/CW)|0; // the drawn outline is handed to the section beside it (a 3D duck has none); interior lines stay
    let near=0;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)if(!isIn(x+dx,y+dy))near=1;if(!near)continue;
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]]){const s=isIn(x+dx,y+dy)?lab[(y+dy)*CW+x+dx]:0;if(s&&s!==5){nb[i]=s;break;}}}lab.set(nb);}
  let th=new Float32Array(N);
  for(let y=0;y<CH;y++){let x=0;while(x<CW){if(!isIn(x,y)){x++;continue;}let b=x;while(b+1<CW&&isIn(b+1,y))b++;
    const c=(x+b)/2,hl=(b-x+1)/2,w=Math.min(half[y],hl*1.15);for(let k=x;k<=b;k++){const s=(k-c)/hl;th[y*CW+k]=w*Math.sqrt(Math.max(0,1-s*s));}x=b+1;}}
  for(let it=0;it<3;it++){const o=new Float32Array(N);for(let y=0;y<CH;y++)for(let x=0;x<CW;x++){const i=y*CW+x;if(!lab[i])continue;let s=0,n=0;
    for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)if(isIn(x+dx,y+dy)){s+=th[(y+dy)*CW+x+dx];n++;}o[i]=s/n;}th=o;}
  const dO=new Float32Array(N);for(let i=0;i<N;i++)dO[i]=lab[i]?1e4:0; // distance to the outline (two-pass chamfer): the body rounds over into it instead of meeting it in a ridge
  for(let y=0;y<CH;y++)for(let x=0;x<CW;x++){const i=y*CW+x;if(!dO[i])continue;let m=dO[i];if(x>0)m=Math.min(m,dO[i-1]+1);if(y>0){m=Math.min(m,dO[i-CW]+1);if(x>0)m=Math.min(m,dO[i-CW-1]+1.414);if(x<CW-1)m=Math.min(m,dO[i-CW+1]+1.414);}if(!x||!y||x===CW-1)m=Math.min(m,1);dO[i]=m;}
  for(let y=CH-1;y>=0;y--)for(let x=CW-1;x>=0;x--){const i=y*CW+x;if(!dO[i])continue;let m=dO[i];if(x<CW-1)m=Math.min(m,dO[i+1]+1);if(y<CH-1){m=Math.min(m,dO[i+CW]+1);if(x<CW-1)m=Math.min(m,dO[i+CW+1]+1.414);if(x>0)m=Math.min(m,dO[i+CW-1]+1.414);}dO[i]=m;}
  for(let i=0;i<N;i++){if(edge[i]){th[i]=0;continue;}const u=Math.min(1,(dO[i]-1)/9);th[i]*=Math.sqrt(1-(1-u)*(1-u));} // both halves meet on the outline: a closed body
  const neck=DUCK_NECK[0];let bx=0,bn=0,hx=0,hn=0,bot=0,h0=CW,h1=0;for(let y=0;y<CH;y++)for(let x=0;x<CW;x++){const l=lab[y*CW+x];if(!l)continue;if(y<neck){hx+=x;hn++;}else{bx+=x;bn++;}if(l!==2&&y<neck){h0=Math.min(h0,x);h1=Math.max(h1,x);}bot=Math.max(bot,y);}
  bx/=Math.max(1,bn);hx/=Math.max(1,hn);
  const reshape=(x,y,z)=>{if(!v.head)return[x,y,z];const kb=v.bodyS,kh=v.head,B=[bx+(x-bx)*kb,bot+(y-bot)*kb,z*kb],nX=bx+(hx-bx)*kb,nY=bot+(neck-bot)*kb,Hd=[nX+(x-hx)*kh,nY+(y-neck)*kh,z*kh];
    const w=Math.max(0,Math.min(1,(neck+4-y)/8))*Math.max(0,Math.min(1,1-Math.max(h0-x,x-h1,0)/6)),f=w*w*(3-2*w);return[B[0]+(Hd[0]-B[0])*f,B[1]+(Hd[1]-B[1])*f,B[2]+(Hd[2]-B[2])*f];}; // the head's scale only reaches the head's own columns (not a wing tip level with it)
  const P=[],S=[],U=[],top=new Int32Array(N).fill(-1),botI=new Int32Array(N).fill(-1);
  const addV=(x,y,z,s)=>{const r=reshape(x,y,z);P.push(r[0],r[1],r[2]);S.push(s);U.push(x,y);return P.length/3-1;};
  const ge=new Uint8Array(N);for(let i=0;i<N;i++){if(!lab[i])continue;const x=i%CW,y=(i/CW)|0;if(x%g||y%g)continue;const e=ge[i]=edge[i]||!isIn(x-g,y)||!isIn(x+g,y)||!isIn(x,y-g)||!isIn(x,y+g)?1:0;
    top[i]=addV(x,y,e?0:th[i],lab[i]);botI[i]=e?top[i]:addV(x,y,-th[i],lab[i]);}
  const I=[],tri=(a,b,c,flip)=>{if(flip)I.push(a,c,b);else I.push(a,b,c);};
  for(let y=0;y+g<CH;y+=g)for(let x=0;x+g<CW;x+=g){const q=[y*CW+x,y*CW+x+g,(y+g)*CW+x,(y+g)*CW+x+g],inn=q.map(i=>lab[i]>0),k=inn.filter(Boolean).length;if(k<3)continue;
    for(const [A,side] of [[top,0],[botI,1]]){if(k===4){tri(A[q[0]],A[q[2]],A[q[1]],side);tri(A[q[1]],A[q[2]],A[q[3]],side);}
      else{const t=q.filter((_,j)=>inn[j]).map(i=>[A[i],i%CW,(i/CW)|0]);const cr=(t[1][1]-t[0][1])*(-(t[2][2]-t[0][2]))-(-(t[1][2]-t[0][2]))*(t[2][1]-t[0][1]);tri(t[0][0],t[1][0],t[2][0],(cr<0)!==!!side);}}}
  let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(let i=0;i<P.length;i+=3){x0=Math.min(x0,P[i]);x1=Math.max(x1,P[i]);y0=Math.min(y0,P[i+1]);y1=Math.max(y1,P[i+1]);}
  const cx=(x0+x1)/2,cy=(y0+y1)/2,nv=P.length/3,pos=new Float32Array(nv*3);let R=0;
  for(let i=0;i<nv;i++){pos[i*3]=(P[i*3]-cx)/CH;pos[i*3+1]=(cy-P[i*3+1])/CH;pos[i*3+2]=P[i*3+2]/CH;R=Math.max(R,Math.hypot(pos[i*3],pos[i*3+1],pos[i*3+2]));} // model units: 1 = the strip cell height; x forward (beak), y up, z across
  const idx=new Uint16Array(I),nrm=new Float32Array(nv*3);
  { const dg=new Int32Array(nv+1);for(let t=0;t<idx.length;t++)dg[idx[t]+1]+=2;for(let i=0;i<nv;i++)dg[i+1]+=dg[i]; // neighbour lists as flat arrays (deduplicated)
    const adj=new Int32Array(dg[nv]),fl=dg.slice(0,nv),st=new Int32Array(nv+1);
    for(let t=0;t<idx.length;t+=3)for(let k=0;k<3;k++){const a=idx[t+k];adj[fl[a]++]=idx[t+(k+1)%3];adj[fl[a]++]=idx[t+(k+2)%3];}
    let wa=0;for(let i=0;i<nv;i++){st[i]=wa;const sl=adj.subarray(dg[i],dg[i+1]).sort();let last=-1;for(let k=0;k<sl.length;k++){const j=sl[k];if(j!==last){adj[wa++]=j;last=j;}}}st[nv]=wa;
    for(let it=0;it<4;it++){const o=pos.slice();for(let i=0;i<nv;i++){let sx=0,sy=0,sz=0,n=0;for(let k=st[i];k<st[i+1];k++){const j=adj[k];sx+=o[j*3];sy+=o[j*3+1];sz+=o[j*3+2];n++;}if(!n)continue; // smoothing: the pixel steps of the strip melt into a smooth surface
      const l=it%2?-0.53:0.5;pos[i*3]+=l*(sx/n-o[i*3]);pos[i*3+1]+=l*(sy/n-o[i*3+1]);pos[i*3+2]+=l*(sz/n-o[i*3+2]);}} }
  for(let t=0;t<idx.length;t+=3){const a=idx[t]*3,b=idx[t+1]*3,c=idx[t+2]*3,ux=pos[b]-pos[a],uy=pos[b+1]-pos[a+1],uz=pos[b+2]-pos[a+2],wx=pos[c]-pos[a],wy=pos[c+1]-pos[a+1],wz=pos[c+2]-pos[a+2];
    const nx=uy*wz-uz*wy,ny=uz*wx-ux*wz,nz=ux*wy-uy*wx;for(const o of [a,b,c]){nrm[o]+=nx;nrm[o+1]+=ny;nrm[o+2]+=nz;}}
  for(let i=0;i<nrm.length;i+=3){const l=Math.hypot(nrm[i],nrm[i+1],nrm[i+2])||1;nrm[i]/=l;nrm[i+1]/=l;nrm[i+2]/=l;}
  const hp=[];for(let i=0;i<N;i++){if(top[i]<0)continue;const x=i%CW,y=(i/CW)|0;if(ge[i]?(x+y)%(3*g):(x%4||y%4))continue;for(const vi of ge[i]?[top[i]]:[top[i],botI[i]])hp.push(pos[vi*3],pos[vi*3+1],pos[vi*3+2]);} // collision samples: the outline and a grid over both halves
  // collision samples: only points that are the farthest out in some direction can ever be on the projected outline, so keep those
  const ext=new Set(),np=hp.length/3,K=2000;for(let k=0;k<K;k++){const z=1-2*(k+0.5)/K,r=Math.sqrt(1-z*z),a=k*2.39996323,dx=r*Math.cos(a),dy=r*Math.sin(a);
    let bi=0,bd=-1e9;for(let i=0;i<np;i++){const d=hp[i*3]*dx+hp[i*3+1]*dy+hp[i*3+2]*z;if(d>bd){bd=d;bi=i;}}ext.add(bi);}
  const ex=[];for(const i of ext)ex.push(hp[i*3],hp[i*3+1],hp[i*3+2]);
  return{pos,nrm,sec:Uint8Array.from(S),uv:Uint8Array.from(U),idx,R,hp:Float32Array.from(ex)};}
const html=fs.readFileSync(GAME,'utf8'),bh=/DUCK_TYPES\.bighead=\{[^}]*head:([\d.]+),bodyS:([\d.]+)/.exec(html);
if(!bh)throw new Error('Big Head proportions not found in the game');
const b64=a=>Buffer.from(a.buffer,a.byteOffset,a.byteLength).toString('base64'),q=(a,k,T)=>T.from(a,v=>Math.round(v*k));
const enc=m=>({R:+m.R.toFixed(4),p:b64(q(m.pos,32000,Int16Array)),n:b64(q(m.nrm,127,Int8Array)),s:b64(m.sec),u:b64(m.uv),i:b64(m.idx),h:b64(q(m.hp,32000,Int16Array))});
const data={classic:enc(buildGeo({})),bighead:enc(buildGeo({head:+bh[1],bodyS:+bh[2]}))};
const line='const DUCK_MESH='+JSON.stringify(data)+'; // baked by tools/build_duck_meshes.js — do not edit by hand';
const re=/^const DUCK_MESH=.*$/m;if(!re.test(html))throw new Error('DUCK_MESH line not found in the game');
fs.writeFileSync(GAME,html.replace(re,()=>line));
console.log('baked',Object.keys(data).map(k=>k+' '+(Buffer.from(data[k].p,'base64').length/6)+' vertices').join(', '),'·',(line.length/1024).toFixed(0)+' KB');
