// ═════════════════════════ CONTENT (every page) ═════════════════════════
// ── Content (shared): the game's lists, prices, tuners and text are in content/*.csv — edit them there (a spreadsheet keeps the columns; text with
// commas, quotes or line breaks is "quoted", a quote inside doubled ""). The game reads them as it loads. In text, {…} is filled in as it shows:
// {0}, {1}… are the values the code hands it (a count, a name); anything else is a sum over the tuners, e.g. {Math.round(T.duckChance*100)}.
function csvParse(t){const rows=[];let row=[],f='',q=false;t=t.replace(/^﻿/,'');
  for(let i=0;i<t.length;i++){const c=t[i];if(q){if(c==='"'){if(t[i+1]==='"'){f+='"';i++;}else q=false;}else f+=c;}else if(c==='"')q=true;else if(c===','){row.push(f);f='';}
    else if(c==='\n'||c==='\r'){if(c==='\r'&&t[i+1]==='\n')i++;row.push(f);f='';if(row.length>1||row[0]!=='')rows.push(row);row=[];}else f+=c;}
  if(f!==''||row.length){row.push(f);rows.push(row);}const h=(rows.shift()||[]).map(k=>k.trim());return rows.map(r=>{const o={};h.forEach((k,i)=>o[k]=r[i]==null?'':r[i]);return o;});}
function csvRead(name){ // synchronous, so the code that builds on it has it at once (revalidated each load: an edit shows on the next reload)
  const x=new XMLHttpRequest();x.open('GET','content/'+name+'.csv',false);try{x.setRequestHeader('Cache-Control','no-cache');}catch(e){}x.send();
  if(x.status&&x.status!==200)throw new Error('content/'+name+'.csv could not be read ('+x.status+')');return csvParse(x.responseText);}
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
