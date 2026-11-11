// ═════════════════════════ CONTENT (every page) ═════════════════════════
// ── Content (shared): the game's lists, prices, tuners and text are in content/*.csv — edit them there (a spreadsheet keeps the columns; text with
// commas, quotes or line breaks is "quoted", a quote inside doubled ""). The game reads them as it loads. In text, {…} is filled in as it shows:
// {0}, {1}… are the values the code hands it (a count, a name); anything else is a sum over the tuners, e.g. {Math.round(T.duckChance*100)}.
// ── Players (every page): each player saved in this browser has their own save. Player 1's keys are as they always were; player n's are
// 'p<n>:'-prefixed (localStorage, and the IndexedDB session), so every page reads and writes the chosen player's without knowing it. The player
// is chosen on the title screen (Continue asks which, when there is more than one) and kept for this tab (sessionStorage), or ?profile=n.
const IL_SHARED_KEYS=new Set(['il_profiles','il_dockmin','il_map_modes','il_pondmode','nebula-config']); // (the same for every player: the setup, not the save)
const IL_PROFILE=(()=>{let p=null;try{p=new URLSearchParams(location.search).get('profile');if(p)sessionStorage.setItem('il_profile',p);else p=sessionStorage.getItem('il_profile');}catch(e){}return Math.max(1,parseInt(p)||1);})();
const IL_PRE=n=>n>1?'p'+n+':':'',_lsGet=Storage.prototype.getItem,_lsSet=Storage.prototype.setItem,_lsDel=Storage.prototype.removeItem;
const profileGet=(n,k)=>{try{return _lsGet.call(localStorage,IL_SHARED_KEYS.has(k)?k:IL_PRE(n)+k);}catch(e){return null;}}; // another player's saved value
if(IL_PROFILE>1){const S=Storage.prototype,w=f=>function(k,...a){return f.call(this,this===window.localStorage&&!IL_SHARED_KEYS.has(k)?IL_PRE(IL_PROFILE)+k:k,...a);};S.getItem=w(S.getItem);S.setItem=w(S.setItem);S.removeItem=w(S.removeItem);}
function ilProfiles(){let L=[];try{L=JSON.parse(_lsGet.call(localStorage,'il_profiles')||'[]')||[];}catch(e){}if(!L.includes(1))L.unshift(1);return L;} // every player saved here (ids)
function ilProfileAdd(){const L=ilProfiles(),n=Math.max(...L)+1;L.push(n);try{_lsSet.call(localStorage,'il_profiles',JSON.stringify(L));}catch(e){}return n;}
function ilProfileDel(n){const P=IL_PRE(n),ks=[];try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(!IL_SHARED_KEYS.has(k)&&(P?k.startsWith(P):!/^p\d+:/.test(k)))ks.push(k);}for(const k of ks)_lsDel.call(localStorage,k);if(n>1)_lsSet.call(localStorage,'il_profiles',JSON.stringify(ilProfiles().filter(x=>x!==n)));}catch(e){}return typeof IDB!=='undefined'?IDB.wipe(n).catch(()=>{}):Promise.resolve();} // a player's run gone for good: their saves here, and what is kept for them (recordings, the surface they left)
function ilProfileUse(n){try{sessionStorage.setItem('il_profile',String(n));}catch(e){}} // (takes effect on the next page)
function csvParse(t){const rows=[];let row=[],f='',q=false;t=t.replace(/^﻿/,'');
  for(let i=0;i<t.length;i++){const c=t[i];if(q){if(c==='"'){if(t[i+1]==='"'){f+='"';i++;}else q=false;}else f+=c;}else if(c==='"')q=true;else if(c===','){row.push(f);f='';}
    else if(c==='\n'||c==='\r'){if(c==='\r'&&t[i+1]==='\n')i++;row.push(f);f='';if(row.length>1||row[0]!=='')rows.push(row);row=[];}else f+=c;}
  if(f!==''||row.length){row.push(f);rows.push(row);}const h=(rows.shift()||[]).map(k=>k.trim());return rows.map(r=>{const o={};h.forEach((k,i)=>o[k]=r[i]==null?'':r[i]);return o;});}
function contentText(f,opt){ // a content file's text: synchronous, so the code that builds on it has it at once (revalidated each load: an edit shows on the next reload); opt: it may be missing ('')
  const x=new XMLHttpRequest();x.open('GET','content/'+f,false);try{x.setRequestHeader('Cache-Control','no-cache');}catch(e){}try{x.send();}catch(e){if(opt)return'';throw e;}
  if(x.status&&x.status!==200){if(opt)return'';throw new Error('content/'+f+' could not be read ('+x.status+')');}return x.responseText;}
function csvRead(name){return csvParse(contentText(name+'.csv'));}
function jsonRead(name){try{return JSON.parse(contentText(name+'.json',true)||'{}')||{};}catch(e){console.error('content/'+name+'.json',e);return{};}} // (levels and prefabs made in Build mode)
const cellV=s=>{s=String(s==null?'':s).trim();return s===''?'':s==='true'?true:s==='false'?false:/^-?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(s)?+s:s;}; // a cell as a number / true / false / text
const cu=s=>s===''||s==null?undefined:cellV(s); // an empty cell: no value
const cvJ=s=>{s=String(s||'').trim();if(!s)return null;try{return JSON.parse(s);}catch(e){console.error('content: not JSON',s);return null;}}; // a cell holding a small JSON value (an effect)
const _tplF=new Map(),TXT={},TXV={},VAL={}; // compiled sums; the texts (content/strings.csv); each text's own named values; the shared values (its value.<name> rows)
const _tplC=(e,args)=>{let f=_tplF.get(e);if(!f){try{f=new Function('$','return ('+e.replace(/\$(\d+)/g,'$[$1]')+');');}catch(x){f=()=>'{'+e+'}';}_tplF.set(e,f);}try{const v=f(args||[]);return v==null?'':v;}catch(x){return '{'+e+'}';}};
function tpl(s,args,vars){ // a content text, as it shows. {name}: the text's own value (vars: name → what fills it, $0 / $1… the values the code hands it), else a shared value
  // (value.<name> in content/strings.csv); {0}…: the code's values in order; anything else in braces: a sum over the game's state (the tuners T, runT…)
  if(s==null)return'';s=String(s);if(s.indexOf('{')<0)return s;
  return s.replace(/\{([^{}]+)\}/g,(m,e)=>{if(/^\d+$/.test(e))return args&&args[+e]!=null?args[+e]:'';const w=vars&&vars[e]!=null?vars[e]:VAL[e];return _tplC(w!=null?w:e,args);});}
function txtVals(s){const o={};for(const l of String(s||'').split('\n')){const m=l.match(/^\s*([\w]+)\s*=\s*(.*?)\s*(?:—.*)?$/);if(m)o[m[1]]=m[2];}return o;} // a text's values column: one per line, name = what fills it — what it is
try{for(const r of csvRead('strings')){if(r.key.slice(0,6)==='value.')VAL[r.key.slice(6)]=r.text;else{TXT[r.key]=r.text;if(r.values)TXV[r.key]=txtVals(r.values);}}}catch(e){console.error(e);}
function txt(k,...a){const s=TXT[k];if(s==null){console.warn('content: no text',k);return k;}return tpl(s,a,TXV[k]);} // a piece of the game's text (content/strings.csv), its {names} filled from a ($0…) by its values column
function txtApply(root){for(const el of (root||document).querySelectorAll('[data-tx]'))el.textContent=txt(el.dataset.tx);for(const el of (root||document).querySelectorAll('[data-tt]'))el.title=txt(el.dataset.tt);for(const el of (root||document).querySelectorAll('[data-tp]'))el.placeholder=txt(el.dataset.tp);parenHints(root);} // the page's own labels
function parenHints(root){for(const b of (root||document).querySelectorAll('button')){if(b.children.length)continue;const m=/^(.*\S)\s*\(([^()]+)\)\s*$/.exec(b.textContent);if(m){b.textContent=m[1];b.dataset.more=m[2];}}} // a menu button's bracketed context ("Quit to main menu (saves this surface)"): off the button, said in the feed when it is pointed at (ilHint: each page's own feed)
let _hintEl=null;document.addEventListener('pointerover',e=>{const el=e.target.closest&&e.target.closest('[data-more]');if(el&&el!==_hintEl&&window.ilHint)window.ilHint(el.textContent,el.dataset.more);_hintEl=el;},true);
// ── Loading (every page): while a scene is still being drawn, a black screen with ∞ — a glowing bead running round it, its glow trailing behind — and a line of text under it
// (content/strings.csv load.text) with a glow passing over it now and then; it fades in and out. loading(why, on): show while any reason is on.
const _load={why:new Set(),el:null,t:0,shown:0,carry:0}; // carry: this page opened from one showing it, so it is on at once
{const st=document.createElement('style');st.textContent='*{scrollbar-width:thin;scrollbar-color:rgba(160,160,160,.35) transparent}::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:rgba(160,160,160,.35);border-radius:2px}::-webkit-scrollbar-track{background:transparent}';(document.head||document.documentElement).appendChild(st);} // every scrollbar in the game: thin and plain, as the menus' (one rule, every page)
function loadingEl(){if(_load.el)return _load.el;const st=document.createElement('style');st.textContent=`#ilLoad{position:fixed;inset:0;z-index:2147483000;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;opacity:0;transition:opacity .45s ease;pointer-events:none}
#ilLoad.on{opacity:1;pointer-events:auto;cursor:progress}#ilLoad svg{width:56px;height:24px;overflow:visible}#ilLoad .lp{fill:none;stroke:#8a8a8a;stroke-width:1.6}
#ilLoad .lr{fill:none;stroke:#fff;stroke-width:1.8;stroke-linecap:round;stroke-dasharray:12 88;filter:drop-shadow(0 0 2px #fff)}
#ilLoad .lb{fill:#fff;filter:drop-shadow(0 0 3px #fff) drop-shadow(0 0 7px rgba(255,255,255,.8))}
#ilLoad .lt{font:12px/1.4 system-ui,'Inter',sans-serif;letter-spacing:1.2px;color:transparent;background:linear-gradient(100deg,#8a8a8a 0 40%,#fff 50%,#8a8a8a 60% 100%) no-repeat;background-size:300% 100%;background-position:100% 0;-webkit-background-clip:text;background-clip:text;animation:ilSweep 7s ease-in-out infinite}
@keyframes ilSweep{0%{background-position:100% 0}22%,100%{background-position:0 0}}`;document.head.appendChild(st);
  const el=document.createElement('div');el.id='ilLoad';const P='M28,12 C22,2 6,2 6,12 C6,22 22,22 28,12 C34,2 50,2 50,12 C50,22 34,22 28,12 Z';
  el.innerHTML=`<svg viewBox="0 0 56 24"><path class="lp" d="${P}"/><path class="lr" pathLength="100" d="${P}"><animate attributeName="stroke-dashoffset" from="12" to="-88" dur="2.6s" repeatCount="indefinite"/></path><circle class="lb" r="1.9"><animateMotion dur="2.6s" repeatCount="indefinite" path="${P}"/></circle></svg><div class="lt"></div>`;
  el.querySelector('.lt').textContent=txt('load.text');document.body.appendChild(el);_load.el=el;
  try{el.querySelector('svg').setCurrentTime((Date.now()%2600)/1000);}catch(e){}el.querySelector('.lt').style.animationDelay=-(Date.now()%7000)+'ms'; /* in step with the clock: on every page, the bead and the glow are where they were on the last one (never starting over) */
  return el;}
function loading(why,on){const s=_load.why,was=s.size>0;if(on)s.add(why);else s.delete(why);const now=s.size>0;if(on&&why==='leave')try{sessionStorage.setItem('il_load',Date.now());}catch(e){} /* the next page carries it on (even when this one was already showing it for another reason) */if(now===was)return;clearTimeout(_load.t);
  const show=()=>{if(!s.size)return;if(!document.body){document.addEventListener('DOMContentLoaded',show,{once:true});return;}const el=loadingEl();if(_load.carry){_load.carry=0;el.style.transition='none';el.classList.add('on');void el.offsetWidth;el.style.transition='';}else{void el.offsetWidth;el.classList.add('on');}_load.shown=performance.now();};
  if(now){if(why==='boot'||why==='leave'||why==='page')show();else _load.t=setTimeout(show,140);} // (at once for a page coming or going — not a timer the page's own loading would hold up; a quick change never flashes it)
  else _load.t=setTimeout(()=>{if(s.size||!_load.el)return;_load.el.classList.remove('on');document.documentElement.classList.remove('il-arrive');},Math.max(250,450-(performance.now()-_load.shown)));} // once shown, at least a moment; and one step of a load straight after another keeps the same screen (never off and on again)
function pageReady(){if(window.ilReady)return;window.ilReady=true;loading('page',false);} // a page is fully there to be seen (each says when: the title with its water and the game's state, the map drawn, a surface's first frames): only then does the loading screen lift
if(window.top===window){try{const t=+sessionStorage.getItem('il_load')||0;sessionStorage.removeItem('il_load');if(Date.now()-t<15000)_load.carry=1;}catch(e){} // every page opens black, with the loading screen at once (straight on from the last page's, never fading in again)
  loading('page',true);addEventListener('load',()=>setTimeout(pageReady,15000));} // (a page that never says: up all the same, in the end)

// ═════════════════════════ THE GAME'S CURSOR (every page) ═════════════════════════
// One cursor everywhere: the system cursor never shows (any state, any menu). The ring, its bloom and its dot; brighter over anything that does
// something. Its click reaction is the surface's, the same on every page: a press shrinks it in (cursorClickShrink, over cursorClickDurMs), held on
// it flares out past rest, a release eases it back from wherever it was; a right-click punches it outward. Colour and dimming cross-fade (~55 ms).
function cursorBase(cx,x,y,cR,dimA,tintK,edgeCol,lw){
  const g=cx.createRadialGradient(x,y,0,x,y,cR*0.85);g.addColorStop(0,`rgba(0,0,0,${(0.5*dimA*tintK).toFixed(3)})`);g.addColorStop(0.75,`rgba(0,0,0,${(0.28*dimA*tintK).toFixed(3)})`);g.addColorStop(1,'rgba(0,0,0,0)');
  cx.beginPath();cx.arc(x,y,cR*0.85,0,6.2832);cx.fillStyle=g;cx.fill();
  cx.globalCompositeOperation='screen';cx.filter='blur(7px)';cx.globalAlpha=0.6*dimA; // the bloom behind the sharp ring
  cx.beginPath();cx.arc(x,y,cR,0,6.2832);cx.strokeStyle=`rgba(${edgeCol},0.9)`;cx.lineWidth=lw*2.5;cx.stroke();
  cx.filter='none';cx.globalAlpha=1;cx.globalCompositeOperation='source-over';}
function cursorRing(cx,x,y,cR,dimA,edgeCol,lw){cx.beginPath();cx.arc(x,y,cR,0,6.2832);cx.strokeStyle=`rgba(${edgeCol},${(0.80*dimA).toFixed(3)})`;cx.lineWidth=lw;cx.stroke();}
function cursorDot(cx,x,y,dimA,edgeCol){
  cx.globalCompositeOperation='screen';cx.filter='blur(3px)';cx.globalAlpha=0.7*dimA;cx.beginPath();cx.arc(x,y,1.4,0,6.2832);cx.fillStyle=`rgba(${edgeCol},0.9)`;cx.fill();
  cx.filter='none';cx.globalAlpha=1;cx.globalCompositeOperation='source-over';cx.beginPath();cx.arc(x,y,0.75,0,6.2832);cx.fillStyle=`rgba(${edgeCol},${(0.65*dimA).toFixed(3)})`;cx.fill();}
// ── The cursor's stain (every page: a surface under its particles, the Surface Map's ground, the title's water): where it has just been, laid INTO the scene (under a surface's particles; flat on the map's ground, under its shops), so a
// cursor gone faint on a busy surface is easy to find. Even toned: the path is drawn as one mask in which overlaps never add up, fading with age from the start.
const _curTrail=[];let _stainCv=null; // {x, y, t, gap (off the scene: the stain breaks)} — in the scene's own coordinates; the stain's two work canvases
let _curSm=null; // the trail follows the cursor eased (T.cursorStainSmooth), so a hand's jitters do not show
function cursorTrailRecord(x,y,now,on){const ms=T.cursorStainMs!=null?T.cursorStainMs:900,l=_curTrail[_curTrail.length-1],k=T.cursorStainSmooth!=null?T.cursorStainSmooth:0.35;
  if(ms<=0){_curTrail.length=0;return;}if(!on||!_curSm||(l&&l.gap))_curSm={x,y};else{_curSm.x+=(x-_curSm.x)*k;_curSm.y+=(y-_curSm.y)*k;}x=_curSm.x;y=_curSm.y;if(!on){if(l&&!l.gap)_curTrail.push({x,y,t:now,gap:1});}else if(!l||l.gap||Math.hypot(x-l.x,y-l.y)>1)_curTrail.push({x,y,t:now});else l.t=now;
  while(_curTrail.length&&now-_curTrail[0].t>ms)_curTrail.shift();}
function cursorStain(cx,now,w,dark,toXY){ // drawn over a finished scene, but only where it is dark: the stain's strength is scaled by (1 − the scene's brightness)², so
  // particles cover it (their brightness × T.cursorStainHide), and it comes through only where they let the ground show. cx: the scene; w: the stain's width in cx's own units; dark: a light
  // background (stain it dark: scaled by the scene's brightness² instead); toXY: trail point → cx's units (its transform is applied, so it works in device pixels)
  const ms=T.cursorStainMs!=null?T.cursorStainMs:900,A=T.cursorStainA!=null?T.cursorStainA:0.22;if(_curTrail.length<2||ms<=0||A<=0)return;
  const m=cx.getTransform(),cv=cx.canvas,wd=w*Math.hypot(m.a,m.b),P=_curTrail.map(p=>{const[x,y]=toXY?toXY(p.x,p.y):[p.x,p.y];return{x:m.a*x+m.c*y+m.e,y:m.b*x+m.d*y+m.f,gap:p.gap,f:Math.max(0,1-(now-p.t)/ms)};});
  let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const p of P){x0=Math.min(x0,p.x);y0=Math.min(y0,p.y);x1=Math.max(x1,p.x);y1=Math.max(y1,p.y);}
  x0=Math.max(0,Math.floor(x0-wd));y0=Math.max(0,Math.floor(y0-wd));x1=Math.min(cv.width,Math.ceil(x1+wd));y1=Math.min(cv.height,Math.ceil(y1+wd));const cw=x1-x0,ch=y1-y0;if(cw<1||ch<1)return;
  if(!_stainCv){_stainCv=[document.createElement('canvas'),document.createElement('canvas')];}
  for(const c of _stainCv)if(c.width<cw||c.height<ch){c.width=Math.max(cw,c.width);c.height=Math.max(ch,c.height);}
  const s=_stainCv[0].getContext('2d'),t=_stainCv[1].getContext('2d');
  s.setTransform(1,0,0,1,0,0);s.globalCompositeOperation='source-over';s.fillStyle='#000';s.fillRect(0,0,cw,ch); // the mask, as an amount (0 = none): overlaps never add up ('lighten')
  s.setTransform(1,0,0,1,-x0,-y0);s.globalCompositeOperation='lighten';s.lineCap='round';s.lineJoin='round';s.lineWidth=wd;
  const mid=(a,b)=>[(a.x+b.x)/2,(a.y+b.y)/2]; // curves through the points' midpoints (no corners)
  for(let i=1;i<P.length;i++){const a=P[i-1],b=P[i];if(a.gap||b.gap)continue;const v=Math.round(255*A*(a.f+b.f)/2),p0=i>1&&!P[i-2].gap?mid(P[i-2],a):[a.x,a.y],p1=mid(a,b);s.strokeStyle=`rgb(${v},${v},${v})`;s.beginPath();s.moveTo(p0[0],p0[1]);s.quadraticCurveTo(a.x,a.y,p1[0],p1[1]);if(i===P.length-1||P[i+1].gap)s.lineTo(b.x,b.y);s.stroke();}
  const hide=T.cursorStainHide!=null?T.cursorStainHide:4;t.setTransform(1,0,0,1,0,0);t.globalCompositeOperation='copy';t.filter=`grayscale(1) brightness(${hide})`;t.drawImage(cv,x0,y0,cw,ch,0,0,cw,ch);t.filter='none'; // how much is over the ground there (its brightness × Stain hide: even a dim particle covers it)
  if(!dark){t.globalCompositeOperation='difference';t.fillStyle='#fff';t.fillRect(0,0,cw,ch);} // → how dark it is
  s.setTransform(1,0,0,1,0,0);s.globalCompositeOperation='multiply';s.drawImage(_stainCv[1],0,0,cw,ch,0,0,cw,ch);s.drawImage(_stainCv[1],0,0,cw,ch,0,0,cw,ch); // (squared)
  cx.save();cx.setTransform(1,0,0,1,0,0);
  if(dark){s.globalCompositeOperation='difference';s.fillStyle='#fff';s.fillRect(0,0,cw,ch);cx.globalCompositeOperation='multiply';} // a light scene: the amount darkens it
  else{const c0=typeof DUCK_SUN!=='undefined'?DUCK_SUN.c:[1,1,1],mx=Math.max(1e-3,...c0),c=c0.map(v=>v/mx);s.globalCompositeOperation='multiply';s.fillStyle=`rgb(${c.map(v=>Math.round(Math.max(0,Math.min(1,v))*255)).join(',')})`;s.fillRect(0,0,cw,ch);cx.globalCompositeOperation='screen';} // (in the colour of the light at this time of day, at full strength: its hue, never dimmer at night)
  cx.drawImage(_stainCv[0],0,0,cw,ch,x0,y0,cw,ch);cx.restore();}
const _gcT=()=>(typeof T!=='undefined'&&T)?T:{};
const gcState=()=>({down:false,at:-1,rel:-1,from:0,rAt:-1,r:255,g:255,b:255,dim:0.5,last:0});
function gcHoldT(st,now,D){const el=now-st.at;if(el<D){const p=el/D;return-(1-(1-p)*(1-p));}const p=Math.min(1,(el-D)/D);return-1+2*(1-(1-p)*(1-p));} // −1 at the bottom of the punch, 0 at rest, +1 flared
function gcPress(st,now){st.down=true;st.at=now;}
function gcRelease(st,now){if(st.down){st.rel=now;st.from=gcHoldT(st,now,_gcT().cursorClickDurMs||120);}st.down=false;}
function gcRClick(st,now){st.rAt=now;}
function gcRadius(st,now){const t=_gcT(),D=t.cursorClickDurMs||120,S=t.cursorClickShrink!=null?t.cursorClickShrink:0.7;let h=0;
  if(st.down)h=gcHoldT(st,now,D);else if(st.rel>=0){const p=Math.min(1,(now-st.rel)/D);h=st.from*(1-(1-(1-p)*(1-p)));}
  const rt=st.rAt>=0?Math.min(1,(now-st.rAt)/D):1;return(t.cursorBaseR||8)*(1+S*h+S*(1-(1-(1-rt)*(1-rt))));}
function gcDraw(cx,st,x,y,act,now,col){ // the cursor at (x, y): act (over something it can act on) brightens it; col: [r, g, b] for a tool in hand
  const t=_gcT(),lw=t.cursorLineW||2,dt=st.last?Math.min(100,now-st.last):16,kf=1-Math.exp(-dt/55);st.last=now;
  const ev=act?255:Math.max(0,(255*(1-(t.cursorIdleBorderDark!=null?t.cursorIdleBorderDark:0.4)))|0),c=col||[ev,ev,ev];
  st.r+=(c[0]-st.r)*kf;st.g+=(c[1]-st.g)*kf;st.b+=(c[2]-st.b)*kf;st.dim+=(((act||col)?1:(t.cursorIdleAlphaMult!=null?t.cursorIdleAlphaMult:0.5))-st.dim)*kf;
  const e=`${st.r|0},${st.g|0},${st.b|0}`,cR=gcRadius(st,now);cx.save();cursorBase(cx,x,y,cR,st.dim,1,e,lw);cursorRing(cx,x,y,cR,st.dim,e,lw);cursorDot(cx,x,y,st.dim,e);cx.restore();}
const gcActEl=el=>!!(el&&el.closest&&el.closest('button:not(:disabled),a[href],input,select,textarea,label,[onclick],.slot,.srow,.mtg.sm,.rl-h,[data-c],[data-n],[data-t]'));
const GC={cv:null,x:-1,y:-1,el:null,st:gcState(),opt:{}};
function gameCursor(opt){GC.opt=opt||{};if(GC.cv)return; // opt.hide(el): the page draws its own there; opt.act(el), opt.col(el): its own sense of what the cursor is over
  const sy=document.createElement('style');sy.textContent='html,body,*,*::before,*::after{cursor:none!important}';document.head.appendChild(sy);
  const cv=GC.cv=document.createElement('canvas');cv.style.cssText='position:fixed;left:0;top:0;width:100vw;height:100vh;pointer-events:none;z-index:2147483647';document.body.appendChild(cv);
  addEventListener('pointermove',e=>{GC.x=e.clientX;GC.y=e.clientY;GC.el=e.target;},true);
  addEventListener('pointerdown',e=>{GC.x=e.clientX;GC.y=e.clientY;GC.el=e.target;if(e.button===2)gcRClick(GC.st,performance.now());else if(e.button===0)gcPress(GC.st,performance.now());},true);
  addEventListener('pointerup',e=>{if(e.button===0)gcRelease(GC.st,performance.now());},true);
  document.addEventListener('mouseout',e=>{if(!e.relatedTarget)GC.x=-1;});addEventListener('blur',()=>{if(!(document.activeElement&&document.activeElement.tagName==='IFRAME'))GC.x=-1;}); /* (focus going into a frame of this page, as a surface over the map, is not the pointer leaving) */
  const ask=(f,d)=>{try{return f();}catch(e){if(!GC.err){GC.err=1;console.error('game cursor:',e);}return d;}}; /* what the page says about the cursor's spot: if that ever fails, the cursor is still drawn (it was lost for good when one frame threw) */
  const tick=now=>{requestAnimationFrame(tick);const dp=window.devicePixelRatio||1,w=Math.round(innerWidth*dp),h=Math.round(innerHeight*dp);if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h;}
    const c=cv.getContext('2d');c.setTransform(dp,0,0,dp,0,0);c.clearRect(0,0,innerWidth,innerHeight);GC.shown=false;
    if(GC.x>=0&&!ask(()=>GC.opt.hide&&GC.opt.hide(GC.el),false)){GC.shown=true;ask(()=>gcDraw(c,GC.st,GC.x,GC.y,ask(()=>GC.opt.act?GC.opt.act(GC.el):gcActEl(GC.el),false),now,ask(()=>GC.opt.col?GC.opt.col(GC.el):null,null)));}};requestAnimationFrame(tick);}

// ═════════════════════════ INK AND NEW (every page) ═════════════════════════
// What is discovered is written in with the Fountain Pen. inkWrite(el, key): the element is drawn in as you would note it yourself — each letter in turn, each
// picture (an icon, a canvas, a frame) drawn across, the gold nib going with it (T.inkCharMs a letter, T.inkMaxMs at most; INK.live keeps where each is, so one
// redrawn while it is written carries on from there). inkStrokes draws a drawing (strokes of points) on a canvas the same way, line by line, shape by shape.
// What has never been opened, entered or looked at is new (ilNew / ilSee: 'sn:<id>', kept with the discoveries; 'dr:<id>': drawn in once): a button or a
// tab pulses gold until it is first used (.isnew, the one sign everywhere), a card lies face down until it is turned over (.mtg.fd).
const INK={live:{},jobs:[],nib:null,at:0};
const ilQuiet=()=>!!window.__SCENE||(typeof SCENE!=='undefined'&&!!SCENE)||(typeof BUILD!=='undefined'&&!!BUILD); // (a demo, a recording, Build mode: nothing is new there)
const ilSeenSet=()=>typeof discSeen!=='undefined'?discSeen:typeof disc!=='undefined'?disc:null; // the discoveries (the surface's own, or the map's copy of them)
const ilNew=id=>{const s=ilSeenSet();return !!s&&!ilQuiet()&&!s.has('sn:'+id);};
function ilSee(id,pre){const s=ilSeenSet(),k=(pre||'sn:')+id;if(!s||!id||ilQuiet()||s.has(k))return false;s.add(k);if(typeof saveInventory==='function'){saveInventory();if(typeof HUB!=='undefined'&&HUB)hubState();}else if(typeof neb==='function')neb({cmd:'discover',id:k});return true;} // seen (or drawn): kept by the surface
{const st=document.createElement('style');st.textContent=`.ink-c{-webkit-text-fill-color:transparent;text-shadow:none!important;background:linear-gradient(100deg,currentColor 50%,transparent 50%) 100% 0/220% 100% no-repeat;-webkit-background-clip:text;background-clip:text;animation:inkC var(--d) linear var(--w) forwards}.ink-c.ink-o{-webkit-text-fill-color:currentColor;background:none;opacity:0;animation-name:inkO}
.ink-v{clip-path:inset(-4px 100% -4px -4px);animation:inkV var(--d) linear var(--w) forwards}@keyframes inkC{to{background-position:0 0}}@keyframes inkO{to{opacity:1}}@keyframes inkV{to{clip-path:inset(-4px -4px -4px -4px)}}
.isnew{animation:isNew 1.7s ease-in-out infinite}@keyframes isNew{0%,100%{outline:1px solid rgba(255,214,110,.95);outline-offset:1px;box-shadow:0 0 0 0 rgba(255,214,110,.55)}50%{outline:1px solid rgba(255,214,110,.3);outline-offset:1px;box-shadow:0 0 10px 2px rgba(255,214,110,.6)}}
#inkNib{position:fixed;left:0;top:0;width:30px;height:30px;margin:-29px 0 0 -1px;z-index:2147483600;pointer-events:none;display:none;filter:drop-shadow(1px 2px 2px rgba(0,0,0,.55))}`;(document.head||document.documentElement).appendChild(st);}
function inkNib(x,y){let n=INK.nib;if(!n){n=INK.nib=document.createElement('div');n.id='inkNib'; // the pen's nib, where it is writing (its tip at x, y); it lifts away when nothing has moved it for a moment
    n.innerHTML='<svg viewBox="0 0 30 30"><path d="M29 1 20 5 9 16l5 5L25 10z" fill="#f4f1ea" stroke="#8d8a80" stroke-width=".8"/><path d="M9 16 1 29l13-8z" fill="#e2b33c" stroke="#8a6a12" stroke-width=".8"/><path d="M1 29l7-7" stroke="#5a430a" stroke-width=".9"/><circle cx="8.6" cy="21.4" r="1.1" fill="#5a430a"/></svg>';document.body.appendChild(n);}
  n.style.display='block';n.style.transform=`translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotate(${(Math.sin(performance.now()/90)*4).toFixed(1)}deg)`;INK.at=performance.now();}
function inkWrite(el,key,ms){ // el is written in (key: which writing it is; ms: its longest). An element inside with data-ink="<ms>" is drawn by its owner in that time (its window: el._ink = [start, ms])
  if(!el||el._inkKey===key||!el.getClientRects().length)return false;const t=_gcT(),now=performance.now(),L=INK.live[key]||(INK.live[key]={t0:now}),items=[];el._inkKey=key;
  const vis=c=>/^(canvas|img|svg|iframe|input|select|hr)$/i.test(c.tagName)||c.classList.contains('art')||c.classList.contains('rl-live');
  const walk=n=>{for(const c of [...n.childNodes]){if(c.nodeType===3){if(!c.nodeValue.trim())continue;const f=document.createDocumentFragment();
        for(const ch of c.nodeValue){if(/\s/.test(ch)){f.appendChild(document.createTextNode(ch));continue;}const s=document.createElement('span');s.className='ink-c'+(/\p{Extended_Pictographic}/u.test(ch)?' ink-o':'');s.textContent=ch;f.appendChild(s);items.push([s,1]);}c.replaceWith(f);}
      else if(c.nodeType===1&&!c.classList.contains('disc-lock')&&!/^(script|style|textarea)$/i.test(c.tagName)){if(c.dataset.ink)items.push([c,0,+c.dataset.ink]);else if(vis(c)){c.classList.add('ink-v');items.push([c,10]);}else walk(c);}}};
  walk(el);if(!items.length){el.classList.add('ink-v');items.push([el,10]);}
  const sum=items.reduce((a,i)=>a+i[1],0),per=Math.min(t.inkCharMs||14,(ms||t.inkMaxMs||4200)/Math.max(1,sum));let at=0;
  for(const i of items){const d=i[2]||i[1]*per;if(i[2])i[0]._ink=[L.t0+at,d];else{i[0].style.setProperty('--d',d.toFixed(0)+'ms');i[0].style.setProperty('--w',(at-(now-L.t0)).toFixed(0)+'ms');}i[1]=at;i[2]=d;at+=d;}
  INK.jobs.push({key,el,items,t0:L.t0,end:L.t0+at});if(INK.jobs.length===1)requestAnimationFrame(inkTick);return true;}
function inkTick(now){ // the nib goes with the newest writing; a writing that is done is plain text again
  for(const j of INK.jobs)if(now>=j.end||!j.el.isConnected){j.done=1;if(now>=j.end)delete INK.live[j.key];for(const[e]of j.items){if(e.classList.contains('ink-c')){if(e.isConnected)e.replaceWith(e.textContent);}else e.classList.remove('ink-v');}if(j.el.isConnected){j.el.normalize();if(now<j.end)j.el._inkKey=null;}}
  INK.jobs=INK.jobs.filter(j=>!j.done);const j=INK.jobs[INK.jobs.length-1],i=j&&j.items.find(i=>now-j.t0<i[1]+i[2]);
  if(i&&!i[0]._ink&&now-j.t0>=i[1]){const r=i[0].getBoundingClientRect(),u=(now-j.t0-i[1])/i[2];if(r.width)inkNib(r.left+r.width*u,i[0].classList.contains('ink-c')?r.bottom-r.height*0.2:r.top+r.height*(0.5+0.45*Math.sin(u*31)));}
  if(INK.nib&&now-INK.at>160)INK.nib.style.display='none';if(INK.jobs.length||INK.nib&&INK.nib.style.display!=='none')requestAnimationFrame(inkTick);}
function inkDisc(el,id,lock){ // a discoverable element, as applyDisc finds it: written in the first time it shows (found, or free from the start: as the scene is set up), and new until it is first used
  const s=ilSeenSet();if(!s||lock||ilQuiet()){el.classList.remove('isnew');return 0;}el.classList.toggle('isnew',!s.has('sn:'+id));
  const ms=el.closest('.bk-p,.mtg')?0:900;if(!s.has('dr:'+id)){if(inkWrite(el,id,ms)){s.add('dr:'+id);return 1;}}else if(INK.live[id])inkWrite(el,id,ms);return 0;} // (a line of a page or a card takes its time; a button is quick)
addEventListener('pointerdown',e=>{const el=e.target.closest&&e.target.closest('.isnew');if(el&&!el.classList.contains('disc-lock')){el.classList.remove('isnew');ilSee(el.dataset.disc||el.dataset.new);}},true); // first used: no longer new
function inkStrokes(cv,S,p,a){ // a drawing (S: strokes {p: its points, c: 'r,g,b' its colour (else ink), f: a wash laid in once it is closed, w: its weight}, in units of half the picture's height; a: the picture's width / height), drawn as far as p (0–1) of its length. Returns where the nib is (on screen) while it draws
  const c=cv.getContext('2d'),w=cv.width,h=cv.height,k=Math.min(w/(2*a),h/2)*0.93;let tot=0;for(const s of S){if(s.l==null){s.l=0.02;for(let i=1;i<s.p.length;i++)s.l+=Math.hypot(s.p[i][0]-s.p[i-1][0],s.p[i][1]-s.p[i-1][1]);}tot+=s.l;}
  c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,w,h);c.setTransform(k,0,0,k,w/2,h/2);c.lineCap=c.lineJoin='round';let left=p>=1?1e9:p*tot,nib=null;
  for(const s of S){if(left<=0)break;const f=Math.min(1,left/s.l);left-=s.l;let d=f*(s.l-0.02),e=s.p[0];c.beginPath();c.moveTo(e[0],e[1]);
    for(let i=1;i<s.p.length&&d>0;i++){const A=s.p[i-1],B=s.p[i],l=Math.hypot(B[0]-A[0],B[1]-A[1])||1e-6,u=Math.min(1,d/l);e=[A[0]+(B[0]-A[0])*u,A[1]+(B[1]-A[1])*u];c.lineTo(e[0],e[1]);d-=l;}
    if(f>=1&&s.f){c.fillStyle=`rgba(${s.f},0.3)`;c.fill();}c.strokeStyle=s.c?`rgba(${s.c.split(',').map(v=>Math.round(v*0.6)).join()},0.9)`:'rgba(58,44,24,0.9)';c.lineWidth=(s.w||1)*Math.max(1,h/170)/k;c.stroke();if(f<1)nib=e;}
  if(!nib)return null;const r=cv.getBoundingClientRect();return[r.left+(w/2+nib[0]*k)*r.width/w,r.top+(h/2+nib[1]*k)*r.height/h];}
