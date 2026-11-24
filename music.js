// ═════════════════════════ MUSIC (the map page: your buoy's record player) ═════════════════════════
// The records (content/records.csv) are made as they play, by Web Audio: nothing to download. Each is a seed for its genre's arranger:
//  hybrid   (strings and a horn line over EDM drums, bass and an arpeggio when it drops)
//  edm      (the PULSE): four on the floor, off-beat bass, a plucked arpeggio, a pad that ducks under the kick; builds, drops and breaks
//  symphony (CUSTOM HULLS): strings, cellos, a horn melody, pizzicato and timpani; it swells and settles
// A record plays 48 bars, then the next one you own. Also: a souvenir copy from the GIFT SHOP (kept through its wipe), and Dim's Carnival's record prize. The record player is a starting item on the deck mount (START_ITEMS, shared.js);
// its dock slot (♪) lists your records. A record: owned as up:<id> (the gramophone's own album, records.csv album=1, comes with it)
const RECORDS=csvRead('records').map(r=>({id:r.id,n:r.name,g:r.genre,album:r.album==='1',tape:r.tape==='1',bpm:+r.bpm||120,root:+r.root||45,minor:r.scale!=='major',prog:String(r.prog||'0 5 3 4').split(/\s+/).map(Number),seed:+r.seed||1}));
const MUSIC={ctx:null,cur:null,bar:0,step:0,at:0,timer:null,out:null,rev:null,duck:null,pref:(()=>{try{return JSON.parse(localStorage.getItem('il_music_v1')||'null')||{on:true,id:null};}catch(e){return{on:true,id:null};}})()};
const recOwned=(r,has)=>r.album?has('up:record'):has('up:'+r.id)||SHOP_ITEMS.some(i=>i.fx.rec===r.id&&(souvenirs()[i.id]||0)>0); // (or a souvenir copy from the Gift Shop: yours whatever comes next)
function musicUnder(on){MUSIC.under=!!on;const c=MUSIC.ctx;if(!c||!MUSIC.lp)return;const t=c.currentTime,f=on?(T.musicUnderHz||650):20000,g=on?(T.musicUnderGain!=null?T.musicUnderGain:0.45):1; // down in a surface the record plays on above you: muffled and quieter, under the surface's own sounds
  MUSIC.lp.frequency.cancelScheduledValues(t);MUSIC.lp.frequency.setTargetAtTime(f,t,0.25);MUSIC.lvl.gain.cancelScheduledValues(t);MUSIC.lvl.gain.setTargetAtTime(g,t,0.25);}
function musicSave(){try{localStorage.setItem('il_music_v1',JSON.stringify(MUSIC.pref));}catch(e){}}
function musicRng(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function musicInit(){if(MUSIC.ctx)return MUSIC.ctx;const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;const c=MUSIC.ctx=new A();
  const comp=c.createDynamicsCompressor();comp.threshold.value=-16;comp.ratio.value=12;comp.attack.value=0.003;comp.release.value=0.15;MUSIC.out=c.createGain();MUSIC.out.gain.value=0;MUSIC.out.connect(comp);MUSIC.lp=c.createBiquadFilter();MUSIC.lp.type='lowpass';MUSIC.lp.frequency.value=20000;MUSIC.lp.Q.value=0.5;MUSIC.lvl=c.createGain();comp.connect(MUSIC.lp);MUSIC.lp.connect(MUSIC.lvl);MUSIC.lvl.connect(c.destination);musicUnder(MUSIC.under); // (heard from under the surface: musicUnder)
  const L=c.sampleRate*2.6,ir=c.createBuffer(2,L,c.sampleRate);for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);for(let i=0;i<L;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/L,3);} // a hall: decaying noise
  MUSIC.rev=c.createConvolver();MUSIC.rev.buffer=ir;const rg=c.createGain();rg.gain.value=0.35;MUSIC.rev.connect(rg);rg.connect(MUSIC.out);
  MUSIC.duck=c.createGain();MUSIC.duck.connect(MUSIC.out); // (the pad and strings: ducked under the kick when the drums are in)
  MUSIC.noise=c.createBuffer(1,c.sampleRate,c.sampleRate);{const d=MUSIC.noise.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;}return c;}
const mHz=m=>440*Math.pow(2,(m-69)/12);
function mVoice(t,dur,{f,type='sawtooth',g=0.1,a=0.01,r=0.1,lp=0,q=1,lpEnd=0,det=0,n=1,rev=0.2,bus,vib=0,glide=0}){const c=MUSIC.ctx,v=c.createGain(),o=bus||MUSIC.out;let x=v; // one note: n detuned oscillators → a lowpass (swept to lpEnd) → its envelope → the mix and the hall
  if(lp){const fl=c.createBiquadFilter();fl.type='lowpass';fl.frequency.setValueAtTime(lp,t);if(lpEnd)fl.frequency.exponentialRampToValueAtTime(lpEnd,t+dur);fl.Q.value=q;fl.connect(v);x=fl;}
  for(let i=0;i<n;i++){const os=c.createOscillator();os.type=type;os.frequency.setValueAtTime(glide||f,t);if(glide)os.frequency.exponentialRampToValueAtTime(f,t+Math.min(dur,0.08));os.detune.value=n>1?(i/(n-1)-0.5)*2*det:0;
    if(vib){const lf=c.createOscillator(),lg=c.createGain();lf.frequency.value=5.2;lg.gain.value=vib;lf.connect(lg);lg.connect(os.detune);lf.start(t+0.25);lf.stop(t+dur+r+0.05);}os.connect(x);os.start(t);os.stop(t+dur+r+0.05);}
  v.gain.setValueAtTime(0,t);v.gain.linearRampToValueAtTime(g/Math.sqrt(n),t+a);v.gain.setValueAtTime(g/Math.sqrt(n),t+Math.max(a,dur));v.gain.exponentialRampToValueAtTime(0.0001,t+dur+r);v.connect(o);if(rev){const s=c.createGain();s.gain.value=rev;v.connect(s);s.connect(MUSIC.rev);}}
function mNoise(t,dur,g,type,f,q=1,rev=0.1){const c=MUSIC.ctx,s=c.createBufferSource(),fl=c.createBiquadFilter(),v=c.createGain();s.buffer=MUSIC.noise;fl.type=type;fl.frequency.value=f;fl.Q.value=q;v.gain.setValueAtTime(g,t);v.gain.exponentialRampToValueAtTime(0.0001,t+dur);s.connect(fl);fl.connect(v);v.connect(MUSIC.out);if(rev){const r=c.createGain();r.gain.value=rev;v.connect(r);r.connect(MUSIC.rev);}s.start(t);s.stop(t+dur+0.02);}
function mKick(t){const c=MUSIC.ctx,o=c.createOscillator(),v=c.createGain();o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(45,t+0.12);v.gain.setValueAtTime(0.7,t);v.gain.exponentialRampToValueAtTime(0.001,t+0.4);o.connect(v);v.connect(MUSIC.out);o.start(t);o.stop(t+0.42);
  const d=MUSIC.duck.gain;d.cancelScheduledValues(t);d.setValueAtTime(0.35,t);d.linearRampToValueAtTime(1,t+0.22);}
function mTimp(t,f){mVoice(t,0.05,{f,type:'sine',g:0.35,a:0.005,r:1.2,rev:0.4});mNoise(t,0.25,0.15,'lowpass',300,1,0.3);}
function musicArrange(r){ // a record's parts, from its seed: the scale, a melody motif (two bars), an arpeggio pattern, where its sections fall
  const R=musicRng(r.seed),sc=r.minor?[0,2,3,5,7,8,10]:[0,2,4,5,7,9,11],deg=d=>{const o=Math.floor(d/7);return r.root+12*o+sc[((d%7)+7)%7];};
  const mel=[];let s=0,d=7+((R()*5)|0);while(s<32){const L=[2,4,4,6,8][(R()*5)|0];if(R()<0.82)mel.push({s,L,d});d+=[-2,-1,-1,1,1,2,0,3,-3][(R()*9)|0];d=Math.max(4,Math.min(13,d));s+=L;}
  const arp=[...Array(16)].map((_,i)=>i%4===0?0:R()<0.78?((R()*4)|0):-1),gate=0.4+R()*0.4;
  return{R,deg,mel,arp,gate,chord:b=>{const c=r.prog[Math.floor(b/(r.g==='symphony'?1:2))%r.prog.length];return[c,c+2,c+4];}};}
function musicSection(r,b){const k=Math.floor(b/8)%8;return r.g==='symphony'?['calm','swell','full','calm','swell','full','full','calm'][k]:['intro','build','drop','drop','break','build','drop','drop'][k];}
function musicStep(t){const r=MUSIC.cur,A=MUSIC.arr,b=MUSIC.bar,s=MUSIC.step,sec=musicSection(r,b),sd=60/r.bpm/4,ch=A.chord(b),sym=r.g==='symphony',edm=r.g==='edm',hyb=r.g==='hybrid';
  const drums=!sym&&(sec==='build'||sec==='drop'),drop=sec==='drop'||sec==='full';if(!drums)MUSIC.duck.gain.setValueAtTime(1,t);
  const chordStart=s===0&&(sym||b%2===0),bars=sym?1:2,chordLen=sd*16*bars;
  if(chordStart){const pad=edm?{type:'sawtooth',n:3,det:14,lp:sec==='break'?700:1400,a:0.3,r:0.6,g:0.05,rev:0.35}:{type:'sawtooth',n:3,det:9,lp:sym&&sec==='calm'?900:1700,a:sym?0.6:0.4,r:1.2,g:sym&&sec==='calm'?0.05:0.07,rev:0.5,vib:6};
    for(const d of ch)mVoice(t,chordLen-0.1,Object.assign({f:mHz(A.deg(d)+12),bus:MUSIC.duck},pad));
    if(sym||hyb)mVoice(t,chordLen-0.1,{f:mHz(A.deg(ch[0])-12),type:'sawtooth',n:2,det:6,lp:500,a:0.3,r:0.8,g:sec==='calm'?0.07:0.1,rev:0.3,bus:MUSIC.duck});} // the cellos
  if(drums){if(s%4===0&&(sec==='drop'||s<8||b%8>=4))mKick(t);if(sec==='drop'&&(s===4||s===12))mNoise(t,0.18,0.3,'bandpass',1800,0.8,0.25);
    if(s%4===2)mNoise(t,0.05,0.18,'highpass',8000);else if(sec==='drop'&&s%2===1)mNoise(t,0.03,0.06,'highpass',9000);
    if(sec==='build'&&b%8===7)mNoise(t,sd*1.1,0.05+0.012*s,'bandpass',800+s*400,2,0.3);} // a riser into the drop
  if((edm||hyb)&&(sec==='drop'||sec==='build')&&s%4===2)mVoice(t,sd*1.6,{f:mHz(A.deg(ch[0])-12),type:'sawtooth',lp:900,lpEnd:200,q:6,g:0.16,a:0.005,r:0.05,rev:0}); // the off-beat bass
  if((edm&&(sec==='drop'||sec==='break'))||(hyb&&sec==='drop')){const i=A.arp[s];if(i>=0){const d=i===3?ch[0]+7:ch[i];mVoice(t,sd*A.gate,{f:mHz(A.deg(d)+12),type:edm?'square':'triangle',lp:3200,lpEnd:900,q:4,g:edm?0.05:0.06,a:0.004,r:0.08,rev:0.3});}}
  if(sym||hyb&&sec!=='intro'){const ss=(b%2)*16+s;for(const m of A.mel)if(m.s===ss&&!(sym&&sec==='calm'&&b%4>1)){ /* the horn line (symphony: resting half the calm) */const hi=sec==='full'||sec==='drop';mVoice(t,m.L*sd*0.95,{f:mHz(A.deg(m.d)+(hi?12:0)),type:'triangle',n:2,det:5,lp:hi?2600:1800,a:0.06,r:0.35,g:0.11,rev:0.45,vib:12});}}
  if(edm&&sec==='break'&&s===0&&b%2===0)for(const m of A.mel.filter(m=>m.s<16))mVoice(t+m.s*sd,m.L*sd*0.9,{f:mHz(A.deg(m.d)+12),type:'sawtooth',n:2,det:10,lp:2200,a:0.02,r:0.3,g:0.05,rev:0.4}); // a lead line in the break
  if(sym&&sec!=='calm'&&s%4===0&&b%4!==3)mVoice(t,sd*0.5,{f:mHz(A.deg(ch[(s/4)%3])+12),type:'triangle',g:0.06,a:0.003,r:0.25,rev:0.4}); // pizzicato
  if((sym||hyb)&&(sec==='full'||sec==='drop')&&s===0&&b%2===0)mTimp(t,mHz(A.deg(ch[0])-24));
  if(++MUSIC.step>=16){MUSIC.step=0;if(++MUSIC.bar>=48&&MUSIC.next)MUSIC.next();}}
function musicTick(){const c=MUSIC.ctx;if(!c||!MUSIC.cur)return;while(MUSIC.at<c.currentTime+0.15){musicStep(MUSIC.at);MUSIC.at+=60/MUSIC.cur.bpm/4;}}
function musicPlay(id){const r=RECORDS.find(x=>x.id===id),c=musicInit();if(!r||!c)return;if(c.state==='suspended')c.resume().catch(()=>{});
  MUSIC.cur=r;MUSIC.arr=musicArrange(r);MUSIC.bar=0;MUSIC.step=0;MUSIC.at=c.currentTime+0.1;MUSIC.pref={on:true,id};musicSave();const g=MUSIC.out.gain,v=(typeof T!=='undefined'&&T.musicVol!=null?T.musicVol:0.8);g.cancelScheduledValues(c.currentTime);g.setValueAtTime(g.value,c.currentTime);g.linearRampToValueAtTime(v,c.currentTime+1.2);
  if(!MUSIC.timer)MUSIC.timer=setInterval(musicTick,25);}
function musicStop(){MUSIC.pref.on=false;musicSave();if(!MUSIC.ctx)return;const c=MUSIC.ctx,g=MUSIC.out.gain;g.cancelScheduledValues(c.currentTime);g.setValueAtTime(g.value,c.currentTime);g.linearRampToValueAtTime(0,c.currentTime+0.8);setTimeout(()=>{if(!MUSIC.pref.on){MUSIC.cur=null;clearInterval(MUSIC.timer);MUSIC.timer=null;}},900);}

// ═════════════════════════ THE MAP'S SOUNDS (on Sound and its volume; makers in shared.js: SFX_MAKE) ═════════════════════════
// Round your buoy: the sea's swell and the hiss of its crests, wind in gusts, rain (and drops on the deck; snow hushes everything), a foghorn in fog, thunder with the
// lightning, a gull on a calm day; the hexes near you hum — Bright a high glass tone, Dark a low drone, and near a Rift a tone that glitches in and out. Below deck: the
// water lapping and knocking at the hull, the candle's flame and its crackle. In a surface it all sits under it, muffled. And what you do: moving, firing across, diving
// in, coming up, the hatch, a shop's bell, a catalogue opened (sfx)
const AMB={bus:null,mf:null,fx:null,ch:{},next:{},rift:null};
function ambInit(){const c=musicInit();if(!c)return null;if(AMB.bus)return c;AMB.bus=c.createGain();AMB.bus.gain.value=0;AMB.mf=c.createBiquadFilter();AMB.mf.type='lowpass';AMB.mf.frequency.value=20000;AMB.mf.connect(AMB.bus);AMB.bus.connect(c.destination);AMB.fx=c.createGain();AMB.fx.connect(c.destination);
  const loop=(kind,type,f,q)=>{const s=c.createBufferSource(),fl=c.createBiquadFilter(),g=c.createGain();s.buffer=sfxNoise(c,kind);s.loop=true;fl.type=type;fl.frequency.value=f;fl.Q.value=q||0.7;g.gain.value=0;s.connect(fl);fl.connect(g);g.connect(AMB.mf);s.start(0,Math.random()*3);return{g,fl};};
  const hum=(fs,type,lp)=>{const g=c.createGain(),fl=c.createBiquadFilter();fl.type='lowpass';fl.frequency.value=lp||8000;g.gain.value=0;const os=fs.map(f=>{const o=c.createOscillator();o.type=type||'sine';o.frequency.value=f;o.connect(fl);o.start();return o;});fl.connect(g);g.connect(AMB.mf);return{g,fl,os};};
  Object.assign(AMB.ch,{sea:loop('brown','lowpass',420),surf:loop('white','bandpass',2200,0.5),wind:loop('white','bandpass',600,1.4),rain:loop('white','highpass',5000),lap:loop('brown','lowpass',220),flame:loop('brown','bandpass',180,0.8),
    bright:hum([880,1320.5,1761.2]),dark:hum([55,55.35,82.4],'triangle',300),rift:hum([110,166.4],'sawtooth',1400)});return c;}
const ambSet=(k,v,tc)=>{const ch=AMB.ch[k];if(ch)ch.g.gain.setTargetAtTime(Math.max(0,v),MUSIC.ctx.currentTime,tc||0.4);};
function ambTick(o){const c=MUSIC.ctx;if(!c||c.state!=='running'||!ambInit())return;const now=c.currentTime,V=o.on?(T.masterVol!=null?T.masterVol:0.7)*(T.ambVol!=null?T.ambVol:0.7):0,out=o.where!=='cabin',map=o.where==='map'; // o: where you are (map, level, cabin), the weather, how near Bright, Dark and a Rift are (0…1)
  AMB.bus.gain.setTargetAtTime(V*(o.where==='level'?0.35:1),now,0.4);AMB.mf.frequency.setTargetAtTime(o.where==='level'?450:o.snow?1800:o.where==='cabin'?5000:16000,now,0.5);
  const sw=0.5+0.5*Math.sin(now*0.52)*Math.sin(now*0.21+1),gu=0.5+0.5*Math.sin(now*0.7)*Math.sin(now*0.29+2),w=o.wind||0,r=o.rain||0,at=(k,ms,p)=>{if(now>(AMB.next[k]||0)){AMB.next[k]=now+ms*(0.5+Math.random());return Math.random()<p;}return false;},fx=(k,v)=>sfxPlay(c,AMB.bus,k,v); // (swell and gusts: slow, never quite repeating)
  ambSet('sea',out?0.22+0.22*sw+0.1*w:0);ambSet('surf',out?0.05*sw*sw*(1+w):0);ambSet('wind',out?0.09*w*(0.35+0.65*gu):0,0.25);AMB.ch.wind.fl.frequency.setTargetAtTime(350+900*gu*Math.min(1,w),now,0.3);
  ambSet('rain',(out?0.07:0.03)*r*(o.snow?0.25:1));if(out&&r&&!o.snow){for(let i=0;i<Math.ceil(r*2);i++)if(Math.random()<0.5)fx('drop',0.6);}
  if(out&&o.fog&&at('horn',28,0.8))fx('horn',0.8);if(map&&!w&&!r&&!o.fog&&at('gull',40,0.35))fx('gull',0.7);
  ambSet('lap',out?0:0.22*(0.55+0.45*Math.sin(now*1.25)));if(!out&&at('knock',4,0.6))fx('knock',0.7);ambSet('flame',out?0:0.05);if(!out&&Math.random()<0.18)fx('crackle',0.5);
  const tn=T.ambTones!=null?T.ambTones:1,rf=map?o.rift||0:0,gl=rf>0&&Math.random()<0.35*rf; // the hexes' tones (only on the map; near a Rift they stutter, and it glitches)
  ambSet('bright',map?0.01*tn*(o.bright||0)*(gl?0.2:1):0,gl?0.01:0.5);ambSet('dark',map?0.035*tn*(o.dark||0)*(gl?0.3:1):0,gl?0.01:0.5);
  if(rf>0){const on=Math.random()<0.55;ambSet('rift',on?0.025*tn*rf:0,0.008);if(on)AMB.ch.rift.os.forEach((x,i)=>x.frequency.setValueAtTime([110,98,123.5,82.4,146.8][(Math.random()*5)|0]*(i?1.51:1)*(Math.random()<0.2?2:1),now));AMB.ch.rift.fl.frequency.setValueAtTime(400+Math.random()*2400,now);}else ambSet('rift',0,0.2);}
function sfx(k,v){if(typeof SCENE!=='undefined'&&SCENE||!T.soundOn)return;const c=ambInit();if(!c)return;AMB.fx.gain.value=(T.masterVol!=null?T.masterVol:0.7)*(T.sfxVol!=null?T.sfxVol:0.8);sfxPlay(c,AMB.fx,k,v);} // a sound of something you did
