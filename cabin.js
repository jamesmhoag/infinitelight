// ── Below deck (the Surface Map): click your buoy and you climb down its hatch into its cabin, a hexagonal room drawn in WebGL by a renderer of its own:
// smooth round geometry (lathed, tubed, draped cloth), materials worked out per pixel (plank wood with its grain and joints as a bump map, brass and gold
// metal, white enamel, leather, striped canvas, glass, wax, iron, rope, paint), every surface lit per pixel by the room's lights (the swaying lantern, two
// candles, the pool, the portholes and the hatch, each with its own colour and specular shine), and the lantern casts real shadows (a shadow map, filtered).
// The Observation Desk faces the ladder up to the hatch. On it: the surface map as it is (white hexes bright clears, black circles dark ones, black marks
// Rifts) with the day at its top right, a fortune card for each day (yesterday's, today's, tomorrow's: face up when known), the Ink Well (your Dim) and the
// Journal; the shovel-sized Fountain Pen (white enamel, a gold nib) and the Net (a white pole, a hoop and a net that drapes off the desk and sways with the
// water) lie on it. The open Treasure Chest (your Bright and exotic remnants) stands on the floor to its right; the pool in the floor shows your hex's surface,
// its particles drifting; the Loom (a Spindle, its Pins) and the Gadget Shelf (camera, spectrometer, a telescope at the pool, compass, hourglass) are to its
// left; Storage (the Hull Compartment) is on the right between the desk and the ladder; the Mirror (your buoy in it) is right of the ladder; the Fresh water
// barrel (a white hexagon painted on it, six drinks on its lid) is left of it, the Hammock hung low beside it. The room rocks with the water, the hammock,
// the net and the lantern sway, and the view leans toward the cursor. Pointing at anything lights every face of it and names it in the feed (the Ink Well
// your exact Dim, the chest your exact Bright and exotic remnants); the Mirror opens your buoy's Status, Storage its gear, the Journal the Guide; the ladder
// (Esc, right click) takes you back up.
const CABIN={on:false,t0:0,dir:1,cv:null,ov:null,gl:null,hov:null,mx:null,my:null,atlasAt:0,shotAt:0};
const CABIN_A=3,CABIN_H=2.7,CABIN_RV=CABIN_A/Math.cos(Math.PI/6),CABIN_POOL=[0,0.55,0.95]; // the room: its apothem, height, corner radius; the pool (x, z, radius)
const CABIN_DO={ladder:'up',mirror:'buoy',storage:'buoy',journal:'guide'}; // what a click opens (anything else: what it is, in the feed)
const CAB_OBJ=['ladder','desk','map','day','cards','ink','journal','pen','net','chest','storage','mirror','barrel','hammock','loom','shelf','candle','lantern','pool','porthole'];
const CM={wood:0,dark:1,brass:2,white:3,leather:4,canvas:5,glass:6,mirror:7,atlas:8,flame:9,iron:10,rope:11,paint:12,gem:13,net:14,sky:15,wax:16,gold:17,decal:18,pool:19,hatch:20,parch:21,bottle:22};
function cabinOpen(){if(CABIN.on||!nebReady||currentView!=='map'||shopUI)return;buoy.dip=performance.now();
  if(!CABIN.cv&&!cabInit())return;CABIN.on=true;CABIN.dir=1;CABIN.t0=performance.now()+350;currentView='cabin';CABIN.cv.style.display=CABIN.ov.style.display='block';requestAnimationFrame(()=>{CABIN.cv.style.opacity=CABIN.ov.style.opacity='1';});feed(txt('cabin.title'),txt('cabin.hint'));updateHint();cabinLoop();}
function cabinClose(){if(!CABIN.on||CABIN.dir<0)return;CABIN.dir=-1;CABIN.t0=performance.now();const ms=T.cabinMoveMs||1400;setTimeout(()=>{CABIN.cv.style.opacity=CABIN.ov.style.opacity='0';},ms*0.55);
  setTimeout(()=>{CABIN.on=false;CABIN.cv.style.display=CABIN.ov.style.display='none';if(currentView==='cabin')currentView='map';buoy.dunk={t0:performance.now(),d:-1,ms:700};startMapLoop();updateHint();},ms*0.55+500);} // up the ladder, out of the hatch: your buoy bobs as you come up
function cabinBack(){if(CABIN.on&&currentView==='map'){currentView='cabin';updateHint();}} // (a menu closed: back in the cabin)
function cabinClick(){const h=CABIN.hov;if(!h)return;const d=CABIN_DO[h];if(d==='up'){cabinClose();return;}if(d==='guide'){currentView='map';openGuide();return;}if(d){currentView='map';openCollections(d);return;}feed(...cabinInfo(h));}
function cabinInfo(id){const n=k=>Math.floor(inv&&inv[k]||0).toLocaleString('en-US'),f=r=>{const F=r&&(FORTUNE_ROWS[(r.good?'good:':'dim:')+r.id]||{});return r?(F.name||r.id):txt('cabin.none');};
  switch(id){case 'ink':return[txt('cabin.ink'),txt('cabin.ink_d',n('dim'))];case 'chest':return[txt('cabin.chest'),txt('cabin.chest_d',n('bright'),n('neutron'),n('magnetic'),n('pulsing'))];
    case 'cards':return[txt('cabin.cards'),txt('cabin.cards_d',f(run&&run.prevFortune),f(run&&run.fortune),run&&run.dimDone&&run.dimDone.fortune?f(run.dimNext):txt('cabin.untold'))];
    case 'day':return[txt('cabin.day',day),clockStr()];case 'map':case 'desk':return[txt('cabin.desk'),txt('cabin.desk_d',dayCnt.b,dayCnt.d)];
    default:return[txt('cabin.'+id),txt('cabin.'+id+'_d')];}}
const cabinHint=()=>CABIN.hov?cabinInfo(CABIN.hov):[txt('cabin.title'),txt('cabin.hint')]; // the feed's resting line below deck (never the surface's)
// ── geometry: smooth parts, each vertex its position, normal, uv, material and the thing it belongs to ──
function cabGeo(){return{p:[],n:[],u:[],m:[],i:[],x:[]};}
function cabV(G,p,n,u,m,id){G.p.push(p[0],p[1],p[2]);G.n.push(n[0],n[1],n[2]);G.u.push(u[0],u[1]);G.m.push(m);G.i.push(id?CAB_OBJ.indexOf(id)+1:0);return G.p.length/3-1;}
const cabV3={s:(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],a:(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]],k:(a,k)=>[a[0]*k,a[1]*k,a[2]*k],c:(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],d:(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],n:a=>{const l=Math.hypot(a[0],a[1],a[2])||1;return[a[0]/l,a[1]/l,a[2]/l];}};
function cabQuad(G,A,B,C,D,m,id,U){const n=cabV3.n(cabV3.c(cabV3.s(B,A),cabV3.s(D,A))),u=U||[[0,0],[1,0],[1,1],[0,1]],a=cabV(G,A,n,u[0],m,id),b=cabV(G,B,n,u[1],m,id),c=cabV(G,C,n,u[2],m,id),d=cabV(G,D,n,u[3],m,id);G.x.push(a,b,c,a,c,d);}
function cabBox(G,x0,y0,z0,x1,y1,z1,m,id,s){s=s||1;const P=(a,b,c)=>[a?x1:x0,b?y1:y0,c?z1:z0],W=x1-x0,H=y1-y0,D=z1-z0,U=(w,h,o)=>[[o,0],[o+w*s,0],[o+w*s,h*s],[o,h*s]]; // (uv in metres: the procedural textures stay to scale)
  cabQuad(G,P(0,1,0),P(1,1,0),P(1,1,1),P(0,1,1),m,id,U(W,D,0.3));cabQuad(G,P(0,0,1),P(1,0,1),P(1,0,0),P(0,0,0),m,id,U(W,D,0.7));cabQuad(G,P(0,0,0),P(1,0,0),P(1,1,0),P(0,1,0),m,id,U(W,H,0.1));
  cabQuad(G,P(1,0,1),P(0,0,1),P(0,1,1),P(1,1,1),m,id,U(W,H,0.5));cabQuad(G,P(0,0,1),P(0,0,0),P(0,1,0),P(0,1,1),m,id,U(D,H,0.9));cabQuad(G,P(1,0,0),P(1,0,1),P(1,1,1),P(1,1,0),m,id,U(D,H,0.2));}
function cabLathe(G,c,prof,seg,m,id,ms,a0,a1,sw){a0=a0||0;a1=a1==null?6.2832:a1;const N=prof.length,base=G.p.length/3; // prof: [[y, r], …] round a vertical axis at c; ms(i): a band's own material
  for(let i=0;i<N;i++){const[y,r]=prof[i],pa=prof[Math.max(0,i-1)],pb=prof[Math.min(N-1,i+1)],dy=pb[0]-pa[0],dr=pb[1]-pa[1],l=Math.hypot(dy,dr)||1,ny=-dr/l,nr=dy/l;
    for(let j=0;j<=seg;j++){const t=a0+(a1-a0)*j/seg,cs=Math.cos(t),sn=Math.sin(t);cabV(G,[c[0]+r*cs,c[1]+y,c[2]+r*sn],[nr*cs,ny,nr*sn],sw?[y,t*Math.max(0.05,r)]:[t*Math.max(0.05,r),y],ms?ms(Math.min(i,N-2)):m,id);}}
  for(let i=0;i<N-1;i++)for(let j=0;j<seg;j++){const a=base+i*(seg+1)+j,b=a+seg+1;G.x.push(a,b,a+1,a+1,b,b+1);}}
function cabTube(G,pts,r,seg,m,id,rf){const N=pts.length,base=G.p.length/3;let L=0,nn=null; // a round tube along a path (parallel-transported frames); rf(i): its radius there
  for(let i=0;i<N;i++){const t=cabV3.n(cabV3.s(pts[Math.min(N-1,i+1)],pts[Math.max(0,i-1)]));if(!nn){nn=cabV3.n(cabV3.c(t,Math.abs(t[1])<0.9?[0,1,0]:[1,0,0]));}else nn=cabV3.n(cabV3.c(cabV3.c(t,nn),t));const bb=cabV3.c(t,nn),R=rf?rf(i):r;if(i)L+=Math.hypot(...cabV3.s(pts[i],pts[i-1]));
    for(let j=0;j<=seg;j++){const a=j/seg*6.2832,d=cabV3.a(cabV3.k(nn,Math.cos(a)),cabV3.k(bb,Math.sin(a)));cabV(G,cabV3.a(pts[i],cabV3.k(d,R)),d,[L,j/seg*6.2832*R],m,id);}}
  for(let i=0;i<N-1;i++)for(let j=0;j<seg;j++){const a=base+i*(seg+1)+j,b=a+seg+1;G.x.push(a,b,a+1,a+1,b,b+1);}}
function cabTorus(G,c,R,r,ax,seg,m,id){const pts=[];for(let i=0;i<=seg;i++){const a=i/seg*6.2832;pts.push(Array.isArray(ax)?[c[0]-ax[2]*R*Math.cos(a),c[1]+R*Math.sin(a),c[2]+ax[0]*R*Math.cos(a)]:ax==='z'?[c[0]+R*Math.cos(a),c[1]+R*Math.sin(a),c[2]]:ax==='x'?[c[0],c[1]+R*Math.sin(a),c[2]+R*Math.cos(a)]:[c[0]+R*Math.cos(a),c[1],c[2]+R*Math.sin(a)]);}cabTube(G,pts,r,10,m,id);}
function cabSheet(G,fn,nu,nv,m,id,U){const base=G.p.length/3; // a cloth (or any surface) from fn(u, v) → position, its normals from its own slopes
  for(let j=0;j<=nv;j++)for(let i=0;i<=nu;i++){const u=i/nu,v=j/nv,p=fn(u,v),e=1e-3,a=cabV3.s(fn(Math.min(1,u+e),v),fn(Math.max(0,u-e),v)),b=cabV3.s(fn(u,Math.min(1,v+e)),fn(u,Math.max(0,v-e)));cabV(G,p,cabV3.n(cabV3.c(a,b)),U?U(u,v):[u,v],m,id);}
  for(let j=0;j<nv;j++)for(let i=0;i<nu;i++){const a=base+j*(nu+1)+i,b=a+nu+1;G.x.push(a,a+1,b,a+1,b+1,b);}}
// the atlas: what is painted or written in the room (the desk's map, the day, the fortune cards, the barrel's FRESH, the Journal's title, the
// Hull Compartment's plaque, your buoy in the mirror), redrawn now and then; the pool's surface is its own texture, every frame
const CAB_AT={map:[0,0,512,320],cards:[[512,0,160,240],[672,0,160,240],[832,0,160,240]],fresh:[0,320,256,256],journal:[256,320,256,256],plaque:[512,320,320,96],mirror:[512,416,192,320]};
const atUV=(r,flipX)=>{const[x,y,w,h]=r,A=1024;return flipX?[[(x+w)/A,(y+h)/A],[x/A,(y+h)/A],[x/A,y/A],[(x+w)/A,y/A]]:[[x/A,(y+h)/A],[(x+w)/A,(y+h)/A],[(x+w)/A,y/A],[x/A,y/A]];};
function cabStatic(){const G=cabGeo(),RV=CABIN_RV,A=CABIN_A,H=CABIN_H,co=k=>[RV*Math.cos(k*Math.PI/3),RV*Math.sin(k*Math.PI/3)];
  {const c=[0,1,2,3,4,5].map(co);for(let k=1;k<5;k++)cabQuad(G,[c[0][0],0,c[0][1]],[c[k+1][0],0,c[k+1][1]],[c[k][0],0,c[k][1]],[c[0][0],0,c[0][1]],CM.wood,null,[[c[0][0],c[0][1]],[c[k+1][0],c[k+1][1]],[c[k][0],c[k][1]],[c[0][0],c[0][1]]]);} // the floor: planks
  for(let k=0;k<6;k++){const a=co(k),b=co(k+1),L=Math.hypot(b[0]-a[0],b[1]-a[1]);cabQuad(G,[b[0],0,b[1]],[a[0],0,a[1]],[a[0],H,a[1]],[b[0],H,b[1]],CM.wood,null,[[0,0],[L,0],[L,H],[0,H]].map(([u,v])=>[u+k*3.1,v]));} // the hull's six walls: planks laid along them
  for(let k=0;k<6;k++){const a=co(k),cx=a[0]*0.97,cz=a[1]*0.97;cabTube(G,[[cx,0,cz],[cx*0.985,H*0.5,cz*0.985],[cx*0.94,H,cz*0.94]],0.09,8,CM.dark,null);} // its ribs at the corners
  {const c=[0,1,2,3,4,5].map(co);for(let k=1;k<5;k++)cabQuad(G,[c[0][0],H,c[0][1]],[c[k][0],H,c[k][1]],[c[k+1][0],H,c[k+1][1]],[c[0][0],H,c[0][1]],CM.dark,null,[[c[0][0],c[0][1]],[c[k][0],c[k][1]],[c[k+1][0],c[k+1][1]],[c[0][0],c[0][1]]]);for(let x=-2.4;x<=2.4;x+=0.8)cabBox(G,x-0.07,H-0.16,-A,x+0.07,H,A,CM.dark,null);} // ceiling and its beams
  cabQuad(G,[-0.45,H-0.17,A-0.95],[0.45,H-0.17,A-0.95],[0.45,H-0.17,A-0.15],[-0.45,H-0.17,A-0.15],CM.hatch,'ladder');for(const[x0,z0,x1,z1]of[[-0.5,A-1,0.5,A-0.95],[-0.5,A-0.15,0.5,A-0.1],[-0.5,A-1,-0.45,A-0.1],[0.45,A-1,0.5,A-0.1]])cabBox(G,x0,H-0.2,z0,x1,H-0.15,z1,CM.dark,'ladder'); // the hatch overhead: the sky up there
  for(const x of[-0.3,0.3])cabTube(G,[[x,0,A-0.22],[x,H-0.15,A-0.62]],0.035,10,CM.wood,'ladder');for(let i=1;i<9;i++){const t=i/9,z=A-0.22-0.4*t;cabTube(G,[[-0.3,t*(H-0.15),z],[0.3,t*(H-0.15),z]],0.022,8,CM.wood,'ladder');} // the ladder: round rails and rungs
  // the pool, its brass rim
  {const[px,pz,pr]=CABIN_POOL;cabSheet(G,(u,v)=>[px+pr*v*Math.cos(u*6.2832),0.004,pz+pr*v*Math.sin(u*6.2832)],40,6,CM.pool,'pool',(u,v)=>[0.5+0.5*v*Math.cos(u*6.2832),0.5+0.5*v*Math.sin(u*6.2832)]);cabTorus(G,[px,0.02,pz],pr+0.02,0.04,'y',48,CM.brass,'pool');}
  // the Observation Desk: a heavy top, solid panelled sides, a front rail
  cabBox(G,-1.95,0.9,-1.98,1.95,1.0,-0.82,CM.wood,'desk',1);cabBox(G,-1.85,0,-1.9,-1.4,0.9,-0.9,CM.dark,'desk');cabBox(G,1.4,0,-1.9,1.85,0.9,-0.9,CM.dark,'desk');cabBox(G,-1.4,0.55,-1.88,1.4,0.9,-1.82,CM.dark,'desk');
  for(const x of[-1.62,1.62])for(const y of[0.25,0.6])cabTube(G,[[x-0.09,y,-0.885],[x+0.09,y,-0.885]],0.012,6,CM.brass,'desk'); // drawer pulls
  cabQuad(G,[-0.95,1.001,-1.82],[0.95,1.001,-1.82],[0.95,1.001,-1.0],[-0.95,1.001,-1.0],CM.parch,'map',atUV(CAB_AT.map)); // the surface map on parchment (the day at its top right)
  [-1.62,-1.36,-1.1].forEach((x,i)=>{const z0=-1.42,z1=-1.06,y=1.003+i*0.0006,r=(i-1)*0.06,cx=x+0.11,cz=(z0+z1)/2,R=([a,b])=>[cx+(a-cx)*Math.cos(r)-(b-cz)*Math.sin(r),cz+(a-cx)*Math.sin(r)+(b-cz)*Math.cos(r)],P=[[x,z0],[x+0.22,z0],[x+0.22,z1],[x,z1]].map(R);cabQuad(G,[P[0][0],y,P[0][1]],[P[1][0],y,P[1][1]],[P[2][0],y,P[2][1]],[P[3][0],y,P[3][1]],CM.atlas,'cards',atUV(CAB_AT.cards[i]));}); // a fortune card for each day: yesterday, today, tomorrow
  {const c=[1.38,1.0,-1.1];cabLathe(G,c,[[0,0],[0,0.11],[0.02,0.12],[0.15,0.12],[0.19,0.08],[0.21,0.045],[0.215,0.045]],28,CM.glass,'ink');cabLathe(G,c,[[0.205,0.05],[0.215,0.058],[0.25,0.058],[0.255,0.04],[0.255,0]],28,CM.brass,'ink');cabLathe(G,[c[0],c[1]+0.17,c[2]],[[0,0.085],[0,0]],20,CM.flame,null);} // the Ink Well, on the desk: thick glass, a brass collar; its ink (Dim) glows faintly
  cabBox(G,1.05,1.0,-1.78,1.62,1.06,-1.38,CM.leather,'journal');cabBox(G,1.07,1.004,-1.775,1.6,1.054,-1.385,CM.parch,'journal');cabQuad(G,[1.06,1.0605,-1.38],[1.61,1.0605,-1.38],[1.61,1.0605,-1.78],[1.06,1.0605,-1.78],CM.decal,'journal',(U=>[U[2],U[3],U[0],U[1]])(atUV(CAB_AT.journal)));cabTube(G,[[1.05,1.03,-1.78],[1.05,1.03,-1.38]],0.032,10,CM.leather,'journal'); // the Journal: leather, its pages, its title in gold, its spine
  // the Fountain Pen, lying on the desk: as big as a shovel, white enamel, round; a gold band, a gold nib (its slit, its breather hole)
  {const a=[-1.88,1.04,-1.75],b=[-0.95,1.04,-1.0],d=cabV3.n(cabV3.s(b,a)),pts=[];for(let i=0;i<=12;i++)pts.push(cabV3.a(a,cabV3.k(cabV3.s(b,a),i/12)));cabTube(G,pts,0.04,18,CM.white,'pen',i=>i===0?0.032:i===12?0.035:0.04);
    cabTube(G,[cabV3.a(b,cabV3.k(d,-0.04)),cabV3.a(b,cabV3.k(d,0.02))],0.042,18,CM.gold,'pen');const tip=cabV3.a(b,cabV3.k(d,0.24)),np=[];for(let i=0;i<=8;i++)np.push(cabV3.a(b,cabV3.k(cabV3.s(tip,b),i/8)));cabTube(G,np,0.03,16,CM.gold,'pen',i=>0.034*(1-i/8)**0.8+0.002);}
  // the Net, lying on the desk: a round white pole, a white hoop off the desk's edge (its net is in the moving parts: it drapes and sways)
  {const a=[-1.6,1.035,-1.95],b=[-1.92,1.04,-0.86];cabTube(G,[a,b],0.03,14,CM.white,'net');}
  // the Treasure Chest, open on the floor to the desk's right: wood bound in gold, its lid thrown back, its hoard glowing
  {const x0=2.0,x1=2.72,z0=-1.78,z1=-1.18;cabBox(G,x0,0,z0,x1,0.48,z1,CM.wood,'chest',1.4);for(const x of[2.15,2.57])cabBox(G,x-0.035,-0.005,z0-0.008,x+0.035,0.485,z1+0.008,CM.gold,'chest');cabBox(G,x0-0.008,0.43,z0-0.008,x1+0.008,0.485,z1+0.008,CM.gold,'chest');
    {const r=(z1-z0)/2,al=1.95,ca=Math.cos(al),sa=Math.sin(al),lid=(u,v,k)=>{const t=v*Math.PI,dy=r*0.62*Math.sin(t)*k,dz=-r-r*Math.cos(t)*k-(1-k)*0;return[x0+(x1-x0)*u,0.48+dy*ca-dz*sa,z1+dz*ca+dy*sa];}; // its rounded lid, thrown back on its hinge
      cabSheet(G,(u,v)=>lid(u,v,1),6,12,CM.wood,'chest',(u,v)=>[u*0.7,v*0.6]);cabSheet(G,(u,v)=>lid(u,v,0.93),6,12,CM.dark,'chest');for(const x of[0.21,0.79])cabSheet(G,(u,v)=>lid(x+(u-0.5)*0.1,v,1.012),1,12,CM.gold,'chest');}
    cabQuad(G,[x0+0.03,0.44,z1-0.03],[x1-0.03,0.44,z1-0.03],[x1-0.03,0.44,z0+0.03],[x0+0.03,0.44,z0+0.03],CM.gold,'chest');
    for(let i=0;i<26;i++){const x=x0+0.08+((i*37)%23)/23*(x1-x0-0.16),z=z0+0.08+((i*17)%13)/13*(z1-z0-0.16),y=0.45+((i*7)%5)*0.012,r=0.028+((i*11)%4)*0.006;cabLathe(G,[x,y,z],[[-r,0],[0,r],[r*1.2,0]],4,i%5===0?CM.gem:CM.gem,'chest');}
    cabBox(G,2.3,0.32,z0-0.025,2.42,0.44,z0-0.008,CM.gold,'chest');}
  // Storage: the Hull Compartment (painted wood, panelled doors, brass pulls, a brass plaque)
  {const x=2.0;cabBox(G,x,0,0.1,2.62,1.8,1.4,CM.paint,'storage');for(const[z0,z1]of[[0.16,0.74],[0.76,1.34]]){cabBox(G,x-0.02,0.1,z0,x,1.7,z1,CM.paint,'storage');cabBox(G,x-0.035,0.25,z0+0.06,x-0.02,1.55,z1-0.06,CM.dark,'storage');}for(const z of[0.68,0.82])cabTube(G,[[x-0.05,0.85,z],[x-0.05,1.05,z]],0.014,8,CM.brass,'storage');
    cabQuad(G,[x-0.04,1.6,1.25],[x-0.04,1.6,0.25],[x-0.04,1.74,0.25],[x-0.04,1.74,1.25],CM.atlas,'storage',atUV(CAB_AT.plaque));}
  // the Mirror, right of the ladder: a gold frame, your buoy in the glass
  {const z=A-0.07;cabQuad(G,[1.4,0.6,z],[0.8,0.6,z],[0.8,2.0,z],[1.4,2.0,z],CM.mirror,'mirror',atUV(CAB_AT.mirror));const fr=[[0.78,0.58],[1.42,0.58],[1.42,2.02],[0.78,2.02],[0.78,0.58]].map(([x,y])=>[x,y,z-0.01]);cabTube(G,fr,0.035,10,CM.gold,'mirror');}
  // the Fresh water barrel: bulging staves, iron hoops, a lid, FRESH in a white hexagon, six drinks
  {const c=[-1.05,0,2.2],prof=[];for(let i=0;i<=12;i++){const y=i/12*1.05;prof.push([y,0.38+0.07*Math.sin(Math.PI*i/12)]);}cabLathe(G,c,prof,40,CM.wood,'barrel',null,0,6.2832,1);cabLathe(G,c,[[1.05,0.38],[1.05,0]],40,CM.dark,'barrel');
    for(const y of[0.12,0.42,0.63,0.93]){const r=0.38+0.07*Math.sin(Math.PI*y/1.05)+0.006;cabLathe(G,c,[[y,r],[y+0.05,r]],40,CM.iron,'barrel');}
    {const[ax,ay,aw,ah]=CAB_AT.fresh;cabSheet(G,(u,v)=>{const t=-Math.PI/2+(u-0.5)*0.9,y=0.3+v*0.46,r=0.38+0.07*Math.sin(Math.PI*y/1.05)+0.004;return[c[0]+r*Math.cos(t),y,c[2]+r*Math.sin(t)];},10,6,CM.decal,'barrel',(u,v)=>[(ax+u*aw)/1024,(ay+(1-v)*ah)/1024]);} // FRESH in its white hexagon, painted on the front
    const fz=G.p.length;for(let i=0;i<6;i++){const a=i/6*6.2832;cabLathe(G,[c[0]+0.2*Math.cos(a),1.05,c[2]+0.2*Math.sin(a)],[[0,0],[0,0.045],[0.12,0.045],[0.16,0.02],[0.2,0.02],[0.2,0]],12,CM.bottle,'barrel');}
  }
  // the Weaving Loom (round frame posts, its warp, a Spindle, its Pins) and the Gadget Shelf, to the desk's left
  {const x=-2.62;for(const z of[-1.2,-0.3])cabTube(G,[[x,0,z],[x,1.65,z]],0.045,10,CM.wood,'loom');for(const y of[0.45,1.6])cabTube(G,[[x,y,-1.2],[x,y,-0.3]],0.04,10,CM.wood,'loom');for(let i=0;i<14;i++){const z=-1.13+i*0.06;cabTube(G,[[x+0.02,0.47,z],[x+0.02,1.58,z]],0.004,4,CM.rope,'loom');}
    cabLathe(G,[x+0.16,0.95,-0.75],[[-0.18,0],[-0.18,0.015],[-0.1,0.05],[0,0.06],[0.1,0.05],[0.18,0.015],[0.18,0]],14,CM.wood,'loom');for(let i=0;i<5;i++)cabTube(G,[[x+0.04,1.62,-1.05+i*0.17],[x+0.04,1.78,-1.05+i*0.17]],0.012,6,CM.brass,'loom');}
  {const x0=-2.82,x1=-2.42,z0=-0.05,z1=1.1;for(const y of[0.78,1.42,1.95])cabBox(G,x0,y,z0,x1,y+0.04,z1,CM.wood,'shelf');cabBox(G,x0-0.03,0.4,z0-0.02,x0,2.05,z1+0.02,CM.dark,'shelf');for(const z of[z0,z1])cabBox(G,x0,0.4,z-0.02,x1,1.99,z+0.02,CM.dark,'shelf');
    cabBox(G,-2.74,0.82,0.05,-2.52,0.98,0.3,CM.iron,'shelf');cabLathe(G,[-2.5,0.9,0.175],[[-0.06,0],[-0.06,0.05],[0.0,0.05],[0,0]],16,CM.brass,'shelf');cabLathe(G,[-2.47,0.9,0.175],[[0,0.04],[0,0]],16,CM.glass,'shelf'); // a camera
    cabBox(G,-2.74,0.82,0.45,-2.56,0.96,0.7,CM.brass,'shelf');cabLathe(G,[-2.62,0.96,0.575],[[0,0.05],[0.1,0]],3,CM.glass,'shelf'); // a spectrometer, its prism
    {const b=[-2.6,1.46,0.3],e=[-2.25,1.6,0.42];cabTube(G,[b,e],0.04,14,CM.brass,'shelf',i=>i?0.045:0.03);for(const d of[[-0.08,0,-0.06],[0.06,0,-0.06],[0,0,0.08]])cabTube(G,[cabV3.a(b,[0.1,0,0]),[b[0]+0.1+d[0],1.46,b[2]+d[2]]],0.008,5,CM.dark,'shelf');} // a telescope, pointed at the pool
    cabLathe(G,[-2.62,1.46,0.85],[[0,0],[0,0.08],[0.03,0.08],[0.03,0]],20,CM.brass,'shelf');cabLathe(G,[-2.62,1.49,0.85],[[0.002,0.07],[0.002,0]],20,CM.bottle,'shelf'); // a compass
    cabLathe(G,[-2.6,1.99,0.5],[[0,0],[0,0.06],[0.02,0.06],[0.02,0.05],[0.1,0.045],[0.13,0.012],[0.16,0.045],[0.24,0.05],[0.24,0.06],[0.26,0.06],[0.26,0]],16,CM.bottle,'shelf');} // an hourglass
  // candles (their flames are the moving parts), portholes
  for(const[x,y,z]of[[-1.05,1.0,-1.25],[-2.55,1.46,0.12]]){cabLathe(G,[x,y,z],[[0,0],[0,0.05],[0.01,0.055],[0.02,0.055],[0.02,0]],14,CM.brass,'candle');cabLathe(G,[x,y+0.02,z],[[0,0.03],[0.2,0.03],[0.21,0.022],[0.21,0]],14,CM.wax,'candle');}
  for(const[x,z,nx,nz]of CABIN_PORTS){cabTorus(G,[x+nx*0.02,1.7,z+nz*0.02],0.3,0.045,[nx,0,nz],36,CM.brass,'porthole');cabSheet(G,(u,v)=>{const a=u*6.2832,r=0.3*v;return[x-nz*r*Math.cos(a)+nx*0.01,1.7+r*Math.sin(a),z+nx*r*Math.cos(a)+nz*0.01];},24,3,CM.sky,'porthole');}
  return G;}
const CABIN_PORTS=(()=>{const P=[];for(const k of[0,2]){const a=k*Math.PI/3,b=a+Math.PI/3,m=[(Math.cos(a)+Math.cos(b))/2*CABIN_RV*0.985,(Math.sin(a)+Math.sin(b))/2*CABIN_RV*0.985],l=Math.hypot(...m);P.push([m[0],m[1],-m[0]/l,-m[1]/l]);}return P;})(); // on the two walls either side of the back one (the ladder's)
// the moving parts, rebuilt every frame: the lantern (swinging on its chain), the candle flames, the hammock (swaying), the net (draped off the desk, swaying with the water)
function cabDynamic(now){const G=cabGeo(),t=now/1000,sw=Math.sin(t/1.7*6.2832/6.2832*3.7)*0.22,H=CABIN_H,piv=[0.35,H-0.16,0.3],L=0.45,ang=Math.sin(now/1700)*0.22,ang2=Math.cos(now/2300)*0.08;
  const lp=[piv[0]+Math.sin(ang)*L,piv[1]-Math.cos(ang)*Math.cos(ang2)*L,piv[2]+Math.sin(ang2)*L],chain=[];for(let i=0;i<=6;i++)chain.push(cabV3.a(piv,cabV3.k(cabV3.s(lp,piv),i/6)));cabTube(G,chain,0.008,5,CM.iron,'lantern');CABIN.lantern=lp;
  {const c=lp,body=[[0,0.02],[0.02,0.05],[0.04,0.05]];cabTorus(G,[c[0],c[1]+0.025,c[2]],0.04,0.008,'z',16,CM.brass,'lantern');cabLathe(G,[c[0],c[1]-0.05,c[2]],[[0,0.02],[0.01,0.1],[0.035,0.1],[0.05,0.06],[0.05,0]],20,CM.brass,'lantern'); // its ring and cap
    cabLathe(G,[c[0],c[1]-0.27,c[2]],[[0,0.07],[0.22,0.07]],6,CM.glass,'lantern');for(let k=0;k<6;k++){const a=k/6*6.2832+Math.PI/6;cabTube(G,[[c[0]+0.074*Math.cos(a),c[1]-0.27,c[2]+0.074*Math.sin(a)],[c[0]+0.074*Math.cos(a),c[1]-0.05,c[2]+0.074*Math.sin(a)]],0.006,4,CM.brass,'lantern');} // its glass in a brass cage
    cabLathe(G,[c[0],c[1]-0.33,c[2]],[[0,0],[0,0.06],[0.04,0.1],[0.06,0.09],[0.06,0]],20,CM.brass,'lantern');const fl=0.06+0.012*Math.sin(now/70)*Math.sin(now/43);cabLathe(G,[c[0],c[1]-0.26,c[2]],[[0,0.018],[fl*0.5,0.022],[fl,0]],10,CM.flame,'lantern');} // its base; its flame inside
  for(const[x,y,z]of[[-1.05,1.21,-1.25],[-2.55,1.67,0.12]]){const k=0.05+0.01*Math.sin(now/60+x*9)*Math.sin(now/37+z*5),wob=0.006*Math.sin(now/90+x);cabLathe(G,[x+wob,y,z],[[0,0.008],[k*0.35,0.016],[k,0]],8,CM.flame,'candle');}
  {const a=[-2.5,2.2,0.75],b=[-1.5,2.2,2.5],swg=Math.sin(now/1500)*0.11,swz=Math.cos(now/2100)*0.05,s=(u,v)=>{const sg=Math.sin(Math.PI*u),w=0.32*Math.sin(Math.PI*Math.min(1,Math.max(0,(u-0.06)/0.88)))+0.02,ax=cabV3.n(cabV3.s(b,a)),side=cabV3.n(cabV3.c(ax,[0,1,0]));
      return cabV3.a(cabV3.a(a,cabV3.k(cabV3.s(b,a),u)),[side[0]*(v-0.5)*2*w+swg*sg,-1.25*sg-0.25*sg*((v-0.5)*2)**2+0.04*Math.sin(t*1.3+u*3)*sg,side[2]*(v-0.5)*2*w+swz*sg]);}; // the hammock: a sling of canvas, low, swaying (a gentle ripple runs along it)
    cabSheet(G,s,28,10,CM.canvas,'hammock',(u,v)=>[u*2.2,v]);for(const e of[0,1]){const p=s(e?0.97:0.03,0.5),q=e?b:a;for(const v of[0,0.5,1]){const r=s(e?0.97:0.03,v);cabTube(G,[r,cabV3.a(q,[0,0.05,0])],0.008,5,CM.rope,'hammock');}cabTube(G,[cabV3.a(q,[0,0.05,0]),[q[0],H-0.16,q[2]]],0.014,6,CM.rope,'hammock');cabTube(G,[s(e?0.97:0.03,0),s(e?0.97:0.03,1)],0.02,8,CM.wood,'hammock');}}
  {const c=[-2.08,0.98,-0.72],sway=(T.cabinSway!=null?T.cabinSway:0.018)*14,ph=Math.sin(now/1700)*sway,ph2=Math.sin(now/1100+1)*sway*0.5; // the net: its hoop over the desk's edge, the net hanging from it, draping and swaying with the water
    cabTorus(G,c,0.26,0.018,'x',36,CM.white,'net');cabSheet(G,(u,v)=>{const a=u*6.2832,R=0.26*(1-v*0.55),dep=0.55*Math.sin(v*Math.PI/2);return[c[0]-dep*0.35+ph*v*v+0.03*Math.sin(a*3+now/600)*v,c[1]+R*Math.sin(a)-dep*0.9+ph2*v*v*0.4,c[2]+R*Math.cos(a)+ph2*v*v];},28,10,CM.net,'net',(u,v)=>[u*9,v*6]);
    cabTube(G,[[-1.92,1.04,-0.86],[c[0]+0.02,c[1]+0.0,c[2]-0.26]],0.022,10,CM.white,'net');}
  return G;}
// ── the renderer ──
const CAB_VS=`attribute vec3 aP,aN;attribute vec2 aU;attribute float aM,aI;uniform mat4 uVP,uLVP;varying vec3 vP,vN;varying vec2 vU;varying float vM,vI;varying vec4 vL;
void main(){vP=aP;vN=aN;vU=aU;vM=aM;vI=aI;vL=uLVP*vec4(aP,1.);gl_Position=uVP*vec4(aP,1.);}`;
const CAB_FS=`#extension GL_OES_standard_derivatives : enable
precision highp float;varying vec3 vP,vN;varying vec2 vU;varying float vM,vI;varying vec4 vL;
uniform vec3 uEye,uLp[8],uLc[8],uSky,uChroma;uniform float uT,uHov;uniform sampler2D uAt,uPool,uSh;
float h2(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h2(i),h2(i+vec2(1,0)),f.x),mix(h2(i+vec2(0,1)),h2(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<4;i++){s+=a*n2(p);p*=2.03;a*=.5;}return s;}
vec3 wood(vec2 uv,float tone,out float b){float pw=.23,row=floor(uv.y/pw),x=uv.x+h2(vec2(row,3.))*5.,seg=floor(x/1.6),gy=fract(uv.y/pw),gx=fract(x/1.6); // planks: long grain lines that wander along each board, a knot now and then, a tone of its own, butt joints and seams
 float n=fbm(vec2(x*.7,uv.y*5.+row*7.)),g=.5+.5*sin((gy*3.2+n*1.6+sin(x*.6+row*2.)*.4)*3.1416),fine=n2(vec2(x*40.,gy*60.)),kd=length(vec2((fract(x*.45+row*.37)-.5)*3.,gy-.5)),knot=smoothstep(.22,.0,kd)*step(.7,h2(vec2(row,floor(x*.45+row*.37))));
 vec3 c=mix(vec3(.36,.21,.1),vec3(.5,.31,.16),g*.35+n*.65)*(.94+.05*fine)*tone*(.8+.32*h2(vec2(row,seg)));c=mix(c,vec3(.16,.08,.03)*tone,knot*.75);
 float gap=smoothstep(0.,.035,gy)*smoothstep(1.,.965,gy)*smoothstep(0.,.003,gx)*smoothstep(1.,.997,gx);c*=mix(.25,1.,gap);b=g*.25+knot*.4-(1.-gap)*1.;return c;}
vec3 bumpN(vec3 N,vec3 P,float h,float k){vec3 dx=dFdx(P),dy=dFdy(P),r1=cross(dy,N),r2=cross(N,dx);float det=dot(dx,r1),hx=dFdx(h),hy=dFdy(h);vec3 g=sign(det)*(hx*r1+hy*r2);return normalize(abs(det)*N-k*g);}
float unp(vec4 c){return dot(c,vec4(1.,1./255.,1./65025.,1./16581375.));}
float shadow(){vec3 s=vL.xyz/vL.w*.5+.5;if(vL.w<=0.||s.x<0.||s.x>1.||s.y<0.||s.y>1.)return 1.;float r=0.;for(int i=-1;i<=1;i++)for(int j=-1;j<=1;j++)r+=s.z-.0025>unp(texture2D(uSh,s.xy+vec2(float(i),float(j))/1024.))?0.:1.;return r/9.;}
void main(){int m=int(vM+.5);vec3 N=normalize(vN),V=normalize(uEye-vP);if(dot(N,V)<0.)N=-N;
 vec3 base=vec3(.5);float sp=.15,sh=24.,met=0.,b=0.,bk=0.,em=0.;vec3 emc=vec3(0.);float alpha=1.;
 if(m==0||m==1||m==12){base=wood(vU,m==1?.55:1.,b);bk=.0012;sp=.22;sh=36.;if(m==12){base=vec3(.2,.18,.3)*(.95+.1*n2(vU*3.));b=0.;bk=0.;sp=.35;sh=60.;}}
 else if(m==2||m==17){base=m==17?vec3(1.,.76,.33):vec3(.86,.63,.32);float n=n2(vec2(vU.x*3.,vU.y*160.));base*=.9+.12*n;sp=1.5;sh=m==17?140.:80.;met=1.;}
 else if(m==3){base=vec3(.96,.95,.92);sp=.9;sh=110.;}
 else if(m==4){float n=fbm(vU*25.);base=vec3(.36,.15,.08)*(.8+.3*n);sp=.3;sh=22.;b=n;bk=.0004;}
 else if(m==5){float st=step(.5,fract(vU.x*3.5));base=mix(vec3(.86,.78,.62),vec3(.68,.2,.16),st);float w=fbm(vU*vec2(40.,20.));base*=.9+.12*w;b=w;bk=.0003;sp=.05;sh=8.;}
 else if(m==6||m==22){base=m==22?vec3(.35,.6,.75):vec3(.05,.08,.2);sp=2.;sh=160.;emc=m==6?vec3(.02,.03,.08)+uChroma*.02:vec3(.02,.05,.06);em=1.;}
 else if(m==7){base=texture2D(uAt,vU).rgb*.9+vec3(.05,.07,.09);sp=1.5;sh=200.;em=1.;emc=base*.35;}
 else if(m==8||m==21){vec4 a=texture2D(uAt,vU);base=a.rgb;sp=.08;sh=10.;if(m==21){float n=fbm(vU*300.);base*=.92+.12*n;}}
 else if(m==18){vec4 a=texture2D(uAt,vU);if(a.a<.5){if(vU.x>.24&&vU.x<.51){base=vec3(.36,.15,.08);}else{base=wood(vec2(vP.y,atan(vP.z-2.2,vP.x+1.05)*.45),1.,b);bk=.0025;}}else base=a.rgb;sp=.2;sh=30.;if(a.a>=.5&&vU.x>.24&&vU.x<.51){sp=1.2;sh=90.;met=1.;}}
 else if(m==9){float f=.75+.25*sin(uT*17.+vP.y*90.);gl_FragColor=vec4(vec3(1.,.72,.32)*1.6*f+vec3(.4,.3,.1)*smoothstep(.0,.04,vP.y-floor(vP.y)),1.);return;}
 else if(m==10){float n=fbm(vU*12.);base=vec3(.13,.13,.14)*(.8+.3*n);sp=.7;sh=40.;met=.6;b=n;bk=.0003;}
 else if(m==11){base=vec3(.66,.55,.38)*(.8+.3*sin(vU.x*300.+vU.y*20.));sp=.05;sh=6.;}
 else if(m==13){gl_FragColor=vec4(mix(vec3(1.,.97,.86),uChroma,.45)*(1.+.4*sin(uT*3.+vP.x*40.+vP.z*30.)),1.);return;}
 else if(m==14){vec2 g=fract(vU);float l=min(min(g.x,1.-g.x),min(g.y,1.-g.y));if(l>.1)discard;base=vec3(.95,.95,.92);sp=.3;sh=20.;}
 else if(m==15){gl_FragColor=vec4(uSky*(.85+.15*fbm(vU*8.+uT*.02)),1.);return;}
 else if(m==16){base=vec3(.95,.9,.78);em=1.;emc=vec3(.35,.25,.12);sp=.2;sh=20.;}
 else if(m==19){vec3 c=texture2D(uPool,vU).rgb;float r=length(vU-.5)*2.;gl_FragColor=vec4(c*(1.-.35*r*r)+uChroma*.08,1.);return;}
 else if(m==20){gl_FragColor=vec4(uSky*1.3+.15,1.);return;}
 if(bk>0.)N=bumpN(N,vP,b,bk*120.);
 vec3 col=base*vec3(.10,.08,.07)+emc*em;float shd=shadow();
 for(int i=0;i<8;i++){vec3 L=uLp[i]-vP;float d=length(L);L/=d;float att=1./(1.+d*d*.9);float df=max(dot(N,L),0.);vec3 Hh=normalize(L+V);float s=pow(max(dot(N,Hh),0.),sh)*sp;float k=i==0?shd:1.;
  vec3 sc=met>.5?base:vec3(1.);col+=k*att*uLc[i]*(base*df*(1.-met*.6)+sc*s*(df>0.?1.:0.));}
 float fr=pow(1.-max(dot(N,V),0.),4.);col+=fr*(met>.5?base*.25:vec3(.04))+(met>.5?base*vec3(.09,.07,.05):vec3(0.)); // (metal catches the room's warm light from everywhere)
 if(abs(vI-uHov)<.5&&uHov>.5){col=col*1.12+vec3(.07,.055,.025)+fr*vec3(1.,.85,.5)*.9;} // (every face of it, a warm rim light)
 gl_FragColor=vec4(pow(col,vec3(.9)),alpha);}`;
const CAB_SVS=`attribute vec3 aP;uniform mat4 uLVP;varying float vZ;void main(){vec4 p=uLVP*vec4(aP,1.);gl_Position=p;vZ=p.z/p.w*.5+.5;}`;
const CAB_SFS=`precision highp float;varying float vZ;void main(){vec4 e=vec4(1.,255.,65025.,16581375.)*vZ;e=fract(e);e-=e.yzww*vec4(1./255.,1./255.,1./255.,0.);gl_FragColor=e;}`;
function cabInit(){const cv=document.createElement('canvas');cv.id='cabin';cv.style.cssText='position:fixed;inset:0;width:100vw;height:100vh;z-index:12;opacity:0;transition:opacity .5s ease;background:#07060a;display:none';document.body.appendChild(cv);
  const gl=cv.getContext('webgl',{antialias:true,alpha:false});if(!gl){cv.remove();feed(txt('cabin.title'),txt('cabin.nogl'));return false;}gl.getExtension('OES_standard_derivatives');CABIN.ext=gl.getExtension('OES_element_index_uint');
  const ov=document.createElement('canvas');ov.style.cssText='position:fixed;inset:0;width:100vw;height:100vh;z-index:13;opacity:0;transition:opacity .5s ease;pointer-events:none;display:none';document.body.appendChild(ov); // glows over it (the lantern's and candles' haloes)
  const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))console.error('cabin shader:',gl.getShaderInfoLog(o));return o;},pr=(a,b)=>{const p=gl.createProgram();gl.attachShader(p,sh(gl.VERTEX_SHADER,a));gl.attachShader(p,sh(gl.FRAGMENT_SHADER,b));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))console.error('cabin program:',gl.getProgramInfoLog(p));return p;};
  CABIN.P=pr(CAB_VS,CAB_FS);CABIN.SP=pr(CAB_SVS,CAB_SFS);CABIN.cv=cv;CABIN.ov=ov;CABIN.gl=gl;
  const tex=()=>{const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);return t;};
  CABIN.tAt=tex();CABIN.tPool=tex();CABIN.tSh=tex();gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1024,1024,0,gl.RGBA,gl.UNSIGNED_BYTE,null);CABIN.fb=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,CABIN.fb);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,CABIN.tSh,0);
  const rb=gl.createRenderbuffer();gl.bindRenderbuffer(gl.RENDERBUFFER,rb);gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16,1024,1024);gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,rb);gl.bindFramebuffer(gl.FRAMEBUFFER,null);
  CABIN.atlas=document.createElement('canvas');CABIN.atlas.width=CABIN.atlas.height=1024;CABIN.pool=document.createElement('canvas');CABIN.pool.width=CABIN.pool.height=256;
  const SG=cabStatic();CABIN.S=cabBuf(SG);CABIN.D=null;CABIN.boxes=Object.assign(cabBoxes(cabDynamic(0)),cabBoxes(SG));
  cv.addEventListener('mousemove',e=>{CABIN.mx=e.clientX;CABIN.my=e.clientY;});cv.addEventListener('mouseleave',()=>{CABIN.mx=CABIN.my=null;});cv.addEventListener('click',e=>{e.stopPropagation();cabinClick();});cv.addEventListener('contextmenu',e=>{e.preventDefault();cabinClose();});return true;}
function cabBuf(G,old){const gl=CABIN.gl,B=old||{v:gl.createBuffer(),e:gl.createBuffer()},n=G.p.length/3,D=new Float32Array(n*10);for(let k=0;k<n;k++){D.set(G.p.slice(k*3,k*3+3),k*10);D.set(G.n.slice(k*3,k*3+3),k*10+3);D[k*10+6]=G.u[k*2];D[k*10+7]=G.u[k*2+1];D[k*10+8]=G.m[k];D[k*10+9]=G.i[k];}
  gl.bindBuffer(gl.ARRAY_BUFFER,B.v);gl.bufferData(gl.ARRAY_BUFFER,D,old?gl.DYNAMIC_DRAW:gl.STATIC_DRAW);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,B.e);const big=n>65535&&CABIN.ext;gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,big?new Uint32Array(G.x):new Uint16Array(G.x),old?gl.DYNAMIC_DRAW:gl.STATIC_DRAW);B.n=G.x.length;B.t=big?gl.UNSIGNED_INT:gl.UNSIGNED_SHORT;return B;}
function cabBoxes(G){const b={};for(let k=0;k<G.p.length/3;k++){const id=G.i[k];if(!id)continue;const o=b[id]||(b[id]=[1e9,1e9,1e9,-1e9,-1e9,-1e9]);for(let a=0;a<3;a++){o[a]=Math.min(o[a],G.p[k*3+a]);o[a+3]=Math.max(o[a+3],G.p[k*3+a]);}}return b;} // each thing's bounds (pointing at it: the nearest one along the ray)
// ── the camera, matrices, and what the cursor is on ──
const cabM4={mul:(a,b)=>{const o=new Float32Array(16);for(let i=0;i<4;i++)for(let j=0;j<4;j++){let s=0;for(let k=0;k<4;k++)s+=a[k*4+j]*b[i*4+k];o[i*4+j]=s;}return o;},persp:(f,a,n,fa,mx)=>{const t=1/Math.tan(f/2);return new Float32Array([(mx?-t:t)/a,0,0,0,0,t,0,0,0,0,(fa+n)/(n-fa),-1,0,0,2*fa*n/(n-fa),0]);},
  look:(e,F,U)=>{const z=cabV3.n(cabV3.k(F,-1)),x=cabV3.n(cabV3.c(U,z)),y=cabV3.c(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-cabV3.d(x,e),-cabV3.d(y,e),-cabV3.d(z,e),1]);}};
function cabCam(now,W,H){const ms=T.cabinMoveMs||1400,mv=CABIN.dir>0?Math.min(1,Math.max(0,(now-CABIN.t0)/ms)):1-Math.min(1,(now-CABIN.t0)/ms),e=mv*mv*(3-2*mv); // coming down the ladder from the hatch, then round to the desk (and back up the same way)
  const lx=CABIN.mx!=null?CABIN.mx/W-0.5:0,ly=CABIN.my!=null?CABIN.my/H-0.5:0,lk=T.cabinLook!=null?T.cabinLook:0.14,roll=Math.sin(now/1700)*(T.cabinSway!=null?T.cabinSway:0.018); // it leans toward the cursor; the room rocks on the water
  const P0=[0,CABIN_H-0.25,CABIN_A-0.55],P1=[0,2.3,-2.72],p=P0.map((v,i)=>v+(P1[i]-v)*e+(i===1?Math.sin(now/2300)*0.01:0)),yaw=Math.PI*(1-e)-lx*lk*2,pitch=-0.75*(1-e)-0.42*e-ly*lk;
  const F=[Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),Math.cos(yaw)*Math.cos(pitch)],R0=cabV3.n(cabV3.c(F,[0,1,0])),U0=cabV3.c(R0,F),U=cabV3.n(cabV3.a(cabV3.k(U0,Math.cos(roll)),cabV3.k(R0,Math.sin(roll)))),Rt=cabV3.n(cabV3.c(U,F)),fov=1.05; // (Rt: the screen's right, as drawn)
  return{p,F,U,R:Rt,fov,a:W/H,VP:cabM4.mul(cabM4.persp(fov,W/H,0.05,30,1),cabM4.look(p,F,U))};}
function cabPick(C,X,Y,W,H){if(X==null)return null;const x=(X/W*2-1)*Math.tan(C.fov/2)*C.a,y=(1-Y/H*2)*Math.tan(C.fov/2),d=cabV3.n(cabV3.a(C.F,cabV3.a(cabV3.k(C.R,x),cabV3.k(C.U,y))));let best=null,bt=1e9;
  for(const id in CABIN.boxes){const b=CABIN.boxes[id];let t0=0,t1=1e9;for(let a=0;a<3;a++){if(Math.abs(d[a])<1e-9){if(C.p[a]<b[a]||C.p[a]>b[a+3]){t0=1e9;break;}continue;}let u=(b[a]-C.p[a])/d[a],v=(b[a+3]-C.p[a])/d[a];if(u>v)[u,v]=[v,u];t0=Math.max(t0,u);t1=Math.min(t1,v);}
    const vol=(b[3]-b[0])*(b[4]-b[1])*(b[5]-b[2]),score=t0+Math.cbrt(vol)*0.15; // (smaller things on bigger ones win: the cards on the desk)
    if(t0<=t1&&t0<1e8&&score<bt){bt=score;best=CAB_OBJ[id-1];}}return best;}
// ── the room's lights, the atlas and the pool ──
function cabLights(now){const sk=duckSun(_sunH),day=Math.max(0,Math.min(1,sk.d[1]+0.45)),sc=sk.c,P=chromaRGB(now,0.2).map(v=>v/255),fl=k=>0.82+0.18*Math.sin(now/70+k*7)*Math.sin(now/43+k*3),lp=CABIN.lantern||[0.35,2.1,0.3],H=CABIN_H,A=CABIN_A,pt=CABIN_PORTS;
  return[[cabV3.a(lp,[0,-0.26,0]),[1.9*fl(0),1.25*fl(0),0.55*fl(0)]],[[-1.05,1.3,-1.25],[0.9*fl(1),0.55*fl(1),0.22*fl(1)]],[[-2.55,1.76,0.12],[0.7*fl(2),0.42*fl(2),0.17*fl(2)]],[[CABIN_POOL[0],0.25,CABIN_POOL[1]],P.map(v=>0.35+0.9*v)],
    [[pt[0][0]+pt[0][2]*0.5,1.7,pt[0][1]+pt[0][3]*0.5],sc.map(v=>v*(0.15+0.9*day))],[[pt[1][0]+pt[1][2]*0.5,1.7,pt[1][1]+pt[1][3]*0.5],sc.map(v=>v*(0.15+0.9*day))],[[0,H-0.4,A-0.55],sc.map(v=>v*(0.1+0.7*day))],[[0,1.6,-2.4],[0.08,0.07,0.06]]];}
function cabAtlas(now){const c=CABIN.atlas.getContext('2d'),A=CAB_AT,par=(x,y,w,h)=>{const g=c.createRadialGradient(x+w/2,y+h/2,10,x+w/2,y+h/2,Math.max(w,h)*0.7);g.addColorStop(0,'#efe2bf');g.addColorStop(1,'#c9ad78');c.fillStyle=g;c.fillRect(x,y,w,h);};
  {const[x,y,w,h]=A.map;par(x,y,w,h);c.strokeStyle='rgba(90,60,30,0.6)';c.lineWidth=3;c.strokeRect(x+8,y+8,w-16,h-16);const ks=Object.keys(cells);let mr=1;for(const k of ks){const q=cells[k];mr=Math.max(mr,Math.abs(q.q),Math.abs(q.r),Math.abs(q.q+q.r));}
    const S=Math.min(w,h*1.15)/(mr*2+2)/1.75,cx=x+w*0.46,cy=y+h/2;c.lineWidth=1.2;for(const k of ks){const q=cells[k],px=cx+S*1.732*(q.q+q.r/2),py=cy+S*1.5*q.r;c.beginPath();for(let i=0;i<6;i++){const a=i*Math.PI/3+Math.PI/6;c[i?'lineTo':'moveTo'](px+S*0.96*Math.cos(a),py+S*0.96*Math.sin(a));}c.closePath();
      if(q.cap&&q.kind!=='dark'){c.fillStyle='#fffdf5';c.fill();}c.strokeStyle='rgba(70,45,20,0.7)';c.stroke();
      if(q.rift){c.strokeStyle='#000';c.lineWidth=3;c.beginPath();c.moveTo(px-S*0.6,py-S*0.4);c.lineTo(px+S*0.6,py+S*0.4);c.stroke();c.lineWidth=1.2;}else if(q.cap&&q.kind==='dark'){c.fillStyle='#0b0b0b';c.beginPath();c.arc(px,py,S*0.5,0,6.2832);c.fill();}
      if(q.q===0&&q.r===0){c.fillStyle='rgba(255,255,255,0.9)';c.beginPath();c.arc(px,py,S*0.3,0,6.2832);c.fill();}if(q.q===pQ&&q.r===pR){c.fillStyle=buoyCol;c.strokeStyle='#000';c.beginPath();c.arc(px,py,S*0.28,0,6.2832);c.fill();c.stroke();}}
    c.fillStyle='#3a2410';c.font='bold 30px Georgia,serif';c.textAlign='right';c.textBaseline='top';c.fillText(txt('cabin.day',day),x+w-20,y+18);c.font='italic 18px Georgia,serif';c.fillText(clockStr(),x+w-20,y+52);} // the day, at the map's top right
  const fN=r=>{const F=r&&(FORTUNE_ROWS[(r.good?'good:':'dim:')+r.id]||{});return r?(F.name||r.id):'';};
  [[run&&run.prevFortune,'cabin.card.yesterday'],[run&&run.fortune,'cabin.card.today'],[run&&run.dimDone&&run.dimDone.fortune?run.dimNext:null,'cabin.card.tomorrow',!(run&&run.dimDone&&run.dimDone.fortune)]].forEach(([f,k,hid],i)=>{const[x,y,w,h]=A.cards[i];
    c.fillStyle=hid?'#2b2350':f?(f.good?'#f3e2a6':'#c9bce8'):'#ece0c2';c.fillRect(x,y,w,h);c.strokeStyle=hid?'#d7b45a':'#7a5a2a';c.lineWidth=5;c.strokeRect(x+7,y+7,w-14,h-14);c.textAlign='center';c.textBaseline='middle'; // a card for each day: face up when known; tomorrow's face down until it is told
    if(hid){c.strokeStyle='rgba(215,180,90,0.6)';c.lineWidth=1.5;for(let j=0;j<9;j++){c.beginPath();c.arc(x+w/2,y+h/2,10+j*9,0,6.2832);c.stroke();}c.fillStyle='#e8c870';c.font='bold 44px Georgia,serif';c.fillText('?',x+w/2,y+h/2);}
    else{c.fillStyle=f?(f.good?'#8a5a00':'#4a2f8a'):'#a08860';c.font='bold 56px Georgia,serif';c.fillText(f?(f.good?'★':'☾'):'·',x+w/2,y+h*0.42);c.font='bold 17px Georgia,serif';c.fillStyle='#3a2410';const nm=f?fN(f):txt('cabin.none');c.fillText(nm.length>16?nm.slice(0,15)+'…':nm,x+w/2,y+h*0.72);}
    c.font='italic 15px Georgia,serif';c.fillStyle=hid?'#e8c870':'#5a3a18';c.fillText(txt(k),x+w/2,y+26);});
  {const[x,y,w,h]=A.fresh;c.clearRect(x,y,w,h);c.strokeStyle='#fff';c.fillStyle='#fff';c.lineWidth=12;c.beginPath();for(let i=0;i<6;i++){const a=i*Math.PI/3;c[i?'lineTo':'moveTo'](x+w/2+105*Math.cos(a),y+h/2+105*Math.sin(a));}c.closePath();c.stroke();c.font='bold 54px Georgia,serif';c.textAlign='center';c.textBaseline='middle';c.fillText(txt('cabin.fresh'),x+w/2,y+h/2+4);} // FRESH, painted white in a white hexagon
  {const[x,y,w,h]=A.journal;c.clearRect(x,y,w,h);c.strokeStyle='#e0b040';c.lineWidth=4;c.strokeRect(x+18,y+18,w-36,h-36);c.fillStyle='#f0c860';c.font='italic bold 44px Georgia,serif';c.textAlign='center';c.textBaseline='middle';c.save();c.translate(x+w/2,y+h/2);c.rotate(-Math.PI/2);c.fillText(txt('cabin.journal'),0,0);c.restore();} // its title, tooled in gold
  {const[x,y,w,h]=A.plaque;const g=c.createLinearGradient(x,y,x,y+h);g.addColorStop(0,'#f2cf74');g.addColorStop(1,'#a87a2a');c.fillStyle=g;c.fillRect(x,y,w,h);c.fillStyle='#3a2410';c.font='bold 30px Georgia,serif';c.textAlign='center';c.textBaseline='middle';c.fillText(txt('cabin.storage'),x+w/2,y+h/2);}
  if(now-CABIN.shotAt>1500){CABIN.shotAt=now;const[x,y,w,h]=A.mirror,g=c.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,'#5a6b7a');g.addColorStop(1,'#25303a');c.fillStyle=g;c.fillRect(x,y,w,h);try{drawDuck3D(c,buoyModel(playerName,buoySouv(),buoyCol),quatTurn([0,0,0,1],0.12,now/3000,0),[[x+w/2,y+h*0.62]],w*0.42,1,0,null);}catch(e){}} // your buoy, in the mirror
  const gl=CABIN.gl;gl.bindTexture(gl.TEXTURE_2D,CABIN.tAt);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,CABIN.atlas);}
function cabPool(now){const c=CABIN.pool.getContext('2d'),cl=cells[K(pQ,pR)],im=cl?cellLayer(K(pQ,pR),cl,false):null;c.fillStyle='#04040a';c.fillRect(0,0,256,256);if(im){c.globalAlpha=0.9;c.drawImage(im,0,0,256,256);c.globalAlpha=1;} // your hex's surface, its particles drifting in it
  c.globalCompositeOperation='lighter';for(let i=0;i<70;i++){const u=Math.abs(Math.sin(i*12.9898)*43758.5453)%1,v=Math.abs(Math.sin(i*78.233)*12543.21)%1,t=now/1000,x=((u+t*(0.01+0.02*v)+0.02*Math.sin(t+i))%1)*256,y=((v+t*0.012*(1+u))%1)*256;c.fillStyle=EFFECT_HEX[i%6];c.globalAlpha=0.5+0.5*Math.sin(now/300+i);c.beginPath();c.arc(x,y,1.5+2.5*v,0,6.2832);c.fill();}
  c.globalAlpha=1;c.globalCompositeOperation='source-over';const gl=CABIN.gl;gl.bindTexture(gl.TEXTURE_2D,CABIN.tPool);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,CABIN.pool);}
function cabDraw(P,B,attrs){const gl=CABIN.gl;for(let l=0;l<8;l++)gl.disableVertexAttribArray(l);gl.bindBuffer(gl.ARRAY_BUFFER,B.v);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,B.e);for(const[n,sz,off]of attrs){const l=gl.getAttribLocation(P,n);if(l<0)continue;gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,sz,gl.FLOAT,false,40,off*4);}gl.drawElements(gl.TRIANGLES,B.n,B.t,0);}
function cabinFrame(now){const gl=CABIN.gl,cv=CABIN.cv,dpr=Math.min(2,window.devicePixelRatio||1),W=innerWidth,H=innerHeight;if(cv.width!==Math.round(W*dpr)||cv.height!==Math.round(H*dpr)){cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);CABIN.ov.width=cv.width;CABIN.ov.height=cv.height;}
  if(now-CABIN.atlasAt>400){CABIN.atlasAt=now;cabAtlas(now);}cabPool(now);CABIN.D=cabBuf(cabDynamic(now),CABIN.D);const C=cabCam(now,W,H),Ls=cabLights(now),lp=Ls[0][0];
  const LVP=cabM4.mul(cabM4.persp(2.8,1,0.05,8),cabM4.look(lp,[0,-1,0.0001],[0,0,1])); // the lantern's shadow map: from its flame, looking down over the room
  const all=[[CABIN.S],[CABIN.D]].map(a=>a[0]),A=[['aP',3,0],['aN',3,3],['aU',2,6],['aM',1,8],['aI',1,9]];
  gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.bindFramebuffer(gl.FRAMEBUFFER,CABIN.fb);gl.viewport(0,0,1024,1024);gl.clearColor(1,1,1,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(CABIN.SP);gl.uniformMatrix4fv(gl.getUniformLocation(CABIN.SP,'uLVP'),false,LVP);for(const B of all)cabDraw(CABIN.SP,B,[['aP',3,0]]);
  gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,cv.width,cv.height);gl.clearColor(0.03,0.025,0.035,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);const P=CABIN.P;gl.useProgram(P);const u=n=>gl.getUniformLocation(P,n);
  gl.uniformMatrix4fv(u('uVP'),false,C.VP);gl.uniformMatrix4fv(u('uLVP'),false,LVP);gl.uniform3fv(u('uEye'),C.p);gl.uniform3fv(u('uLp'),Ls.flatMap(l=>l[0]));gl.uniform3fv(u('uLc'),Ls.flatMap(l=>l[1]));const sk=duckSun(_sunH).c;gl.uniform3fv(u('uSky'),sk.map(v=>v*0.55));gl.uniform3fv(u('uChroma'),chromaRGB(now,0.2).map(v=>v/255));gl.uniform1f(u('uT'),now/1000);
  const h=CABIN.dir>0&&now-CABIN.t0>(T.cabinMoveMs||1400)?cabPick(C,CABIN.mx,CABIN.my,W,H):null;if(h!==CABIN.hov){CABIN.hov=h;if(h)feed(...cabinInfo(h),'hint');updateHint();}gl.uniform1f(u('uHov'),h?CAB_OBJ.indexOf(h)+1:0); // every face of what the cursor is on lights up
  [[CABIN.tAt,'uAt'],[CABIN.tPool,'uPool'],[CABIN.tSh,'uSh']].forEach(([t,n],i)=>{gl.activeTexture(gl.TEXTURE0+i);gl.bindTexture(gl.TEXTURE_2D,t);gl.uniform1i(u(n),i);});gl.activeTexture(gl.TEXTURE0);
  for(const B of all)cabDraw(P,B,A);
  const o=CABIN.ov.getContext('2d');o.setTransform(dpr,0,0,dpr,0,0);o.clearRect(0,0,W,H);o.globalCompositeOperation='lighter'; // the haloes round the flames, and a little light in the air
  for(const[q,c,r0]of[[Ls[0][0],[255,190,110],120],[Ls[1][0],[255,170,90],55],[Ls[2][0],[255,170,90],45]]){const v=cabM4.mul(C.VP,new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,q[0],q[1],q[2],1])),w=v[15];if(w<=0.05)continue;const X=(v[12]/w*0.5+0.5)*W,Y=(0.5-v[13]/w*0.5)*H,r=r0*2.4/w,g=o.createRadialGradient(X,Y,0,X,Y,r);g.addColorStop(0,`rgba(${c},0.28)`);g.addColorStop(0.3,`rgba(${c},0.1)`);g.addColorStop(1,`rgba(${c},0)`);o.fillStyle=g;o.fillRect(X-r,Y-r,2*r,2*r);}}
function cabinLoop(){if(!CABIN.on)return;try{cabinFrame(performance.now());}catch(e){console.error(e);}requestAnimationFrame(cabinLoop);}
