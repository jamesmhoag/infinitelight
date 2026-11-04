// ═════════════════════════ CONTENT (every page) ═════════════════════════
// ── Content (shared): the game's lists, prices, tuners and text are in content/*.csv — edit them there (a spreadsheet keeps the columns; text with
// commas, quotes or line breaks is "quoted", a quote inside doubled ""). The game reads them as it loads. In text, {…} is filled in as it shows:
// {0}, {1}… are the values the code hands it (a count, a name); anything else is a sum over the tuners, e.g. {Math.round(T.duckChance*100)}.
// ── Players (every page): each player saved in this browser has their own save. Player 1's keys are as they always were; player n's are
// 'p<n>:'-prefixed (localStorage, and the IndexedDB session), so every page reads and writes the chosen player's without knowing it. The player
// is chosen on the title screen (Continue asks which, when there is more than one) and kept for this tab (sessionStorage), or ?profile=n.
const IL_SHARED_KEYS=new Set(['il_profiles','il_dockmin','il_map_modes','il_pondmode','nebula-config','il_test']); // (the same for every player: the setup, not the save)
const IL_PROFILE=(()=>{let p=null;try{p=new URLSearchParams(location.search).get('profile');if(p)sessionStorage.setItem('il_profile',p);else p=sessionStorage.getItem('il_profile');}catch(e){}return Math.max(1,parseInt(p)||1);})();
const IL_PRE=n=>n>1?'p'+n+':':'',_lsGet=Storage.prototype.getItem,_lsSet=Storage.prototype.setItem;
const profileGet=(n,k)=>{try{return _lsGet.call(localStorage,IL_SHARED_KEYS.has(k)?k:IL_PRE(n)+k);}catch(e){return null;}}; // another player's saved value
if(IL_PROFILE>1){const S=Storage.prototype,w=f=>function(k,...a){return f.call(this,this===window.localStorage&&!IL_SHARED_KEYS.has(k)?IL_PRE(IL_PROFILE)+k:k,...a);};S.getItem=w(S.getItem);S.setItem=w(S.setItem);S.removeItem=w(S.removeItem);}
function ilProfiles(){let L=[];try{L=JSON.parse(_lsGet.call(localStorage,'il_profiles')||'[]')||[];}catch(e){}if(!L.includes(1))L.unshift(1);return L;} // every player saved here (ids)
function ilProfileAdd(){const L=ilProfiles(),n=Math.max(...L)+1;L.push(n);try{_lsSet.call(localStorage,'il_profiles',JSON.stringify(L));}catch(e){}return n;}
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
function txtApply(root){for(const el of (root||document).querySelectorAll('[data-tx]'))el.textContent=txt(el.dataset.tx);for(const el of (root||document).querySelectorAll('[data-tt]'))el.title=txt(el.dataset.tt);for(const el of (root||document).querySelectorAll('[data-tp]'))el.placeholder=txt(el.dataset.tp);} // the page's own labels
// ── Loading (every page): while a scene is still being drawn, a black screen with ∞ — a glowing bead running round it, its glow trailing behind — and a line of text under it
// (content/strings.csv load.text) with a glow passing over it now and then; it fades in and out. loading(why, on): show while any reason is on.
const _load={why:new Set(),el:null,t:0,shown:0};
function loadingEl(){if(_load.el)return _load.el;const st=document.createElement('style');st.textContent=`#ilLoad{position:fixed;inset:0;z-index:2147483000;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;opacity:0;transition:opacity .45s ease;pointer-events:none}
#ilLoad.on{opacity:1;pointer-events:auto;cursor:progress}#ilLoad svg{width:56px;height:24px;overflow:visible}#ilLoad .lp{fill:none;stroke:#8a8a8a;stroke-width:1.6}
#ilLoad .lr{fill:none;stroke:#fff;stroke-width:1.8;stroke-linecap:round;stroke-dasharray:12 88;filter:drop-shadow(0 0 2px #fff)}
#ilLoad .lb{fill:#fff;filter:drop-shadow(0 0 3px #fff) drop-shadow(0 0 7px rgba(255,255,255,.8))}
#ilLoad .lt{font:12px/1.4 system-ui,'Inter',sans-serif;letter-spacing:1.2px;color:transparent;background:linear-gradient(100deg,#8a8a8a 0 40%,#fff 50%,#8a8a8a 60% 100%) no-repeat;background-size:300% 100%;background-position:100% 0;-webkit-background-clip:text;background-clip:text;animation:ilSweep 7s ease-in-out infinite}
@keyframes ilSweep{0%{background-position:100% 0}22%,100%{background-position:0 0}}`;document.head.appendChild(st);
  const el=document.createElement('div');el.id='ilLoad';const P='M28,12 C22,2 6,2 6,12 C6,22 22,22 28,12 C34,2 50,2 50,12 C50,22 34,22 28,12 Z';
  el.innerHTML=`<svg viewBox="0 0 56 24"><path class="lp" d="${P}"/><path class="lr" pathLength="100" d="${P}"><animate attributeName="stroke-dashoffset" from="12" to="-88" dur="2.6s" repeatCount="indefinite"/></path><circle class="lb" r="1.9"><animateMotion dur="2.6s" repeatCount="indefinite" path="${P}"/></circle></svg><div class="lt"></div>`;
  el.querySelector('.lt').textContent=txt('load.text');document.body.appendChild(el);_load.el=el;return el;}
function loading(why,on){const s=_load.why,was=s.size>0;if(on)s.add(why);else s.delete(why);const now=s.size>0;if(now===was)return;clearTimeout(_load.t);
  const show=()=>{if(!s.size)return;if(!document.body){document.addEventListener('DOMContentLoaded',show,{once:true});return;}const el=loadingEl();void el.offsetWidth;el.classList.add('on');_load.shown=performance.now();};
  if(now)_load.t=setTimeout(show,why==='boot'?0:140); // (a quick change never flashes it)
  else _load.t=setTimeout(()=>{if(s.size||!_load.el)return;_load.el.classList.remove('on');},Math.max(0,450-(performance.now()-_load.shown)));} // once shown, at least a moment

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
  document.addEventListener('mouseout',e=>{if(!e.relatedTarget)GC.x=-1;});addEventListener('blur',()=>{GC.x=-1;});
  const tick=now=>{const dp=window.devicePixelRatio||1,w=Math.round(innerWidth*dp),h=Math.round(innerHeight*dp);if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h;}
    const c=cv.getContext('2d');c.setTransform(dp,0,0,dp,0,0);c.clearRect(0,0,innerWidth,innerHeight);GC.shown=false;
    if(GC.x>=0&&!(GC.opt.hide&&GC.opt.hide(GC.el))){GC.shown=true;gcDraw(c,GC.st,GC.x,GC.y,GC.opt.act?GC.opt.act(GC.el):gcActEl(GC.el),now,GC.opt.col?GC.opt.col(GC.el):null);}
    requestAnimationFrame(tick);};requestAnimationFrame(tick);}
