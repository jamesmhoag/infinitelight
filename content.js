// ═════════════════════════ CONTENT (every page) ═════════════════════════
// ── Content (shared): the game's lists, prices, tuners and text are in content/*.csv — edit them there (a spreadsheet keeps the columns; text with
// commas, quotes or line breaks is "quoted", a quote inside doubled ""). The game reads them as it loads. In text, {…} is filled in as it shows:
// {0}, {1}… are the values the code hands it (a count, a name); anything else is a sum over the tuners, e.g. {Math.round(T.duckChance*100)}.
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
