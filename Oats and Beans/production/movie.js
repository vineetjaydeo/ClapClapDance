import * as T from 'three';
import {character,makeFarm,puppy,kitten,ball,palette,mat} from './world.js';

const data=await fetch('./timeline.json').then(r=>r.json());
await document.fonts.load('600 64px Fredoka');
const canvas=document.querySelector('#final'),ctx=canvas.getContext('2d',{alpha:false});
const renderer=new T.WebGLRenderer({canvas:document.querySelector('#gl'),antialias:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});
renderer.setSize(1920,1080,false);renderer.setPixelRatio(1);renderer.outputColorSpace=T.SRGBColorSpace;
renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.0;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;
const scene=new T.Scene();scene.background=new T.Color(0xb7e7ed);scene.fog=new T.Fog(0xb7e7ed,23,65);
scene.add(new T.HemisphereLight(0xfff6e7,0x9daa7c,1.8));const sunLight=new T.DirectionalLight(0xffedcb,2.6);sunLight.position.set(-5,10,7);sunLight.castShadow=true;
sunLight.shadow.mapSize.set(2048,2048);Object.assign(sunLight.shadow.camera,{left:-12,right:12,top:12,bottom:-12,near:.5,far:35});sunLight.shadow.normalBias=.045;sunLight.shadow.bias=-.00025;scene.add(sunLight);
const fill=new T.DirectionalLight(0xd7f4ff,.8);fill.position.set(7,5,-4);scene.add(fill);
const camera=new T.PerspectiveCamera(42,16/9,.1,100);
const farm=makeFarm(scene);
const kids=[character(scene,{x:-1.1,z:.6,scale:1.10,shirt:palette.yellow,pants:palette.teal,phase:0}),character(scene,{x:1.15,z:.6,scale:1.10,shirt:palette.yellow,pants:palette.purple,girl:true,phase:1})];
const parents=[character(scene,{x:-3.55,z:-.30,scale:1.20,adult:true,dad:true,shirt:palette.teal,pants:0xf6e9d3,phase:2}),character(scene,{x:3.55,z:-.3,scale:1.20,adult:true,girl:true,shirt:0xfff4d7,pants:palette.coral,phase:3})];
 const cast=[...parents,...kids],dog=puppy(scene,4.9,1.25),cat=kitten(scene,-4.65,1.3);
const drops=[];for(let i=0;i<30;i++){let d=ball(scene,0x6ac0dc,0,0,0,.035,.09,.035);d.visible=false;drops.push(d);}
const sparkles=[];for(let i=0;i<20;i++){let d=ball(scene,i%3===0?0xffe193:i%3===1?0xf5b2a1:0x8fcecf,0,0,0,.05);d.visible=false;sparkles.push(d);}
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x);};
function beatAt(t){let beats=data.beats;let i=0;while(i<beats.length-2&&beats[i+1]<=t)i++;return i+(t-beats[i])/(beats[i+1]-beats[i]);}
function phraseAt(t){return data.lines.find(l=>t>=l.start&&t<l.end)||null;}
function stateAt(t){let line=phraseAt(t);if(t<7.3)return {action:'wave',cue:'LET’S DANCE ON THE FARM!',section:'FAMILY FARM DANCE',start:0};
 if(t>=55.5&&t<62.9)return {action:'dance',cue:'YOUR TURN TO DANCE!',section:'DANCE BREAK',start:55.5};
 if(t>=92.92&&t<96.68)return {action:'freeze',cue:'FREEZE!',section:'HOLD YOUR POSE',start:89.7,freeze:true};
 if(t>=116.78)return {action:'wave',cue:'GREAT DANCING!',section:'SEE YOU ON THE FARM',start:114.78};
 if(!line){line=[...data.lines].reverse().find(l=>t>=l.start);}
 return {...line,section:t<22.92?'SING & GROW':t<39.24?'PLANT & GROW':t<55.5?'DANCE TOGETHER':t<78.4?'SING & GROW':t<96.68?'FOLLOW THE MOVES':t<112.52?'EVERYBODY SING!':'THANK YOU!',freeze:false};}
function rounded(x,y,w,h,r,fill,stroke=null){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=3;ctx.stroke();}}
function text(txt,x,y,size,color,align='center',weight=600){ctx.font=`${weight} ${size}px Fredoka`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillStyle=color;ctx.fillText(txt,x,y);}
function star(x,y,r,color,rotation=0){ctx.save();ctx.translate(x,y);ctx.rotate(rotation);ctx.beginPath();for(let i=0;i<10;i++){let a=i*Math.PI/5-Math.PI/2;let d=i%2?r*.45:r;i?ctx.lineTo(Math.cos(a)*d,Math.sin(a)*d):ctx.moveTo(Math.cos(a)*d,Math.sin(a)*d);}ctx.closePath();ctx.fillStyle=color;ctx.fill();ctx.restore();}
function bubble(txt,x,y,t,color='#fffaf0'){const width=ctx.measureText(txt).width+70;rounded(x-width/2,y-32,width,64,32,color);text(txt,x,y,31,'#295b65');}
function drawOverlay(t,state,beat){
 // Delicate frame shading preserves a bright centre and readable corners.
 const vignette=ctx.createRadialGradient(960,430,250,960,500,1120);vignette.addColorStop(0,'#e6f8e900');vignette.addColorStop(1,'#376d7210');ctx.fillStyle=vignette;ctx.fillRect(0,0,1920,1080);
 ctx.save();ctx.shadowColor='#295b6520';ctx.shadowBlur=16;ctx.shadowOffsetY=5;rounded(54,43,300,69,34,'#fffaf0ef');ctx.restore();
 // Original little sprout mark.
 ctx.strokeStyle='#69a663';ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(90,90);ctx.lineTo(90,65);ctx.stroke();
 ctx.fillStyle='#91bd6d';ctx.beginPath();ctx.ellipse(82,68,10,6,.6,0,6.283);ctx.ellipse(99,60,10,6,-.6,0,6.283);ctx.fill();text('Clap Clap Dance',120,79,28,'#326576','left');
 ctx.font='500 25px Fredoka';let sw=ctx.measureText(state.section).width+54;rounded(1866-sw,47,sw,58,29,'#fffaf0cc');text(state.section,1866-sw/2,77,25,'#3b6a74');
 let pop=1+.017*Math.exp(-Math.pow(((beat%1)-.10)/.18,2));let cue=state.cue;
 if(t>=92.92&&t<96.68){pop=1;rounded(683,126,554,115,50,'#ffe082','#fff4c5');text('FREEZE!',960,185,78,'#375e73');star(633,181,23,'#fff5c9',.1);star(1286,178,25,'#fff5c9',-.1);}
 else if(t>=7.3&&t<116.78){ctx.save();ctx.translate(960,156);ctx.scale(pop,pop);ctx.font='600 38px Fredoka';let w=ctx.measureText(cue).width+86;rounded(-w/2,-39,w,78,39,'#fff9eced');text(cue,0,2,38,'#386977');ctx.restore();}
 const line=phraseAt(t);
 if(t<7.3){
   // A clean title replaces lyrics during the instrumental introduction.
   ctx.save();ctx.shadowColor='#b08f6220';ctx.shadowBlur=30;ctx.shadowOffsetY=7;rounded(385,838,1150,184,60,'#fff9ecf5');ctx.restore();
   let title='Oats & Beans';text(title,960,900,86,'#3f7580');text('FAMILY FARM DANCE',960,973,32,'#c17c54', 'center',500);
   star(447,918,27,'#edb64f',.1);star(1475,918,27,'#edb64f',-.1);
   if(t>4.8){let count=Math.ceil((7.3-t)/.83);rounded(904,145,112,103,50,'#fff5d7');text(String(Math.max(1,count)),960,198,69,'#df9170');}
 }else if(line){
   const y=948,h=139;let fontSize=64;ctx.font=`600 ${fontSize}px Fredoka`;let full=ctx.measureText(line.text).width;if(full>1645){fontSize=Math.floor(fontSize*1645/full);ctx.font=`600 ${fontSize}px Fredoka`;}
   let widths=line.words.map(w=>ctx.measureText(w.word).width);let gap=ctx.measureText(' ').width;let total=widths.reduce((a,b)=>a+b,0)+gap*(widths.length-1);
   let width=Math.max(940,total+132);ctx.save();ctx.shadowColor='#395d6e25';ctx.shadowBlur=20;ctx.shadowOffsetY=7;rounded((1920-width)/2,y-h/2,width,h,44,'#fffaf0f8','#ffffff');ctx.restore();
   let x=(1920-total)/2;line.words.forEach((w,i)=>{let active=t>=w.start&&t<w.end;let sung=t>=w.end;let sy=active?1+.025*Math.sin(Math.PI*clamp((t-w.start)/Math.max(.1,w.end-w.start))):1;
     if(active)rounded(x-8,y-40,widths[i]+16,82,22,'#ffe2a0');ctx.save();ctx.translate(x+widths[i]/2,y+1);ctx.scale(sy,sy);text(w.word,0,0,fontSize,active?'#b26537':sung?'#298f90':'#315e70');ctx.restore();x+=widths[i]+gap;});
   // Quiet phrase progress, one dot per word.
   let dotw=line.words.length*17;line.words.forEach((w,i)=>{ctx.beginPath();ctx.arc(960-dotw/2+i*17+8,1000,3.5,0,6.283);ctx.fillStyle=t>=w.start?'#e8b65d':'#dce8dc';ctx.fill();});
 }else if(t>=55.5&&t<62.9){rounded(605,886,710,122,48,'#fffaf0f5');text('Dance with your grown-up!',960,947,49,'#386977');}
 else if(t>=93.6&&t<96.68){rounded(688,903,544,110,44,'#fffaf0f5');text('Can you stay still?',960,959,51,'#386977');}
 else if(t>=116.78){rounded(481,857,958,170,52,'#fffaf0f5');text('You grew. You danced!',960,914,69,'#3f7580');text('See you next time!',960,982,37,'#bc7b51', 'center',500);}
 if(state.action==='clap'){
   let matching=state.words.filter(w=>w.word.toLowerCase()===state.action);let n=matching.filter(w=>t>=w.start).length;
   for(let i=0;i<4;i++){let x=780+i*120;rounded(x-28,260,56,56,28,i<n?'#ffe2a0':'#ffffffaa');text(String(i+1),x,289,34,i<n?'#ad6b38':'#85a2a0');}
 }
 // A few soft celebratory shapes live at the edges, away from faces and feet.
 if(state.action==='grow'||state.action==='dance'||t>116.78){for(let i=0;i<6;i++){let x=i<3?123+i*46:1670+(i-3)*44;let y=310+(i%3)*135+Math.sin(t*1.4+i)*18;star(x,y,12+(i%2)*4,['#f9db85','#f2ac96','#dff3bc'][i%3],t*.2+i);}}
 // A quick, gentle fade at the very end includes the music's existing tail.
 if(t>119.35){ctx.fillStyle=`rgba(255,248,231,${.88*ease((t-119.35)/.67)})`;ctx.fillRect(0,0,1920,1080);}
}

window.renderFrame=function(t){
 const state=stateAt(t),beat=beatAt(t),frozen=!!state.freeze;
 ctx.reset();
 let frameTime=frozen?92.96:t,frameBeat=frozen?beatAt(92.96):beat;
 let action=state.action,local=frameTime-state.start;
 cast.forEach((c,i)=>{let a=action;let b=frameBeat;
   if(action==='clap'){
     const marks=state.words.filter(w=>w.word==='clap').map(w=>w.start+.08);let nearest=marks.reduce((a,b)=>Math.abs(b-t)<Math.abs(a-t)?b:a,marks[0]);b=.5+(t-nearest)/.69;
   }
   c.pose(frameTime,a,local,b,frozen,action==='stamp'?state.words.filter(w=>w.word==='stamp').map(w=>w.start+.09):[]);
   if(action==='partner'||action==='copy'){// turn each parent and child gently toward their partner
     c.root.rotation.y=(c.adult?(c.x<0?1:-1):(c.x<0?-1:1))*(action==='partner'?.68:.32);
   }
 });dog.animate(frameTime,frozen);cat.animate(frameTime,frozen);
 farm.clouds.forEach((c,i)=>c.position.x=-16+i*5.5+Math.sin(frameTime*.03+i)*.3);
 farm.crops.forEach((p,i)=>p.rotation.z=.055*Math.sin(frameTime*2+i));
 farm.sprouts.forEach((p,i)=>{let growth=t<23?0:t<30.5?.025:t<38.5?.05+.95*ease((t-30.5)/8):1;p.scale.setScalar(growth);p.rotation.z=.07*Math.sin(frameTime*2+i);});
 farm.rainbow.visible=t>96.68;
 drops.forEach((d,i)=>{d.visible=t>=32.40&&t<34.25;d.position.set(-2.7+(i%10)*.6,3.0-((t*1.6+i*.113)%1)*1.35,1.30+Math.floor(i/10)*.22);});
 sparkles.forEach((d,i)=>{d.visible=(t>35&&t<38.6)||(t>96.68&&t<112);let p=(frameTime*.25+i*.049)%1;d.position.set(-5+(i*1.73)%10,1.0+p*3.6,-1);d.scale.setScalar(.028+.022*Math.sin(p*Math.PI));});
 // Full-body shots are held through instructional moves. Small camera changes
 // occur at musical sections so the space stays understandable to a child.
 cast.forEach(c=>{c.root.visible=true;});dog.root.visible=true;cat.root.visible=true;
 let camX=0,camY=4.8,camZ=12.3,targetY=1.65;
 if(t>=22.92&&t<38.48){camX=.5;camZ=12.15;camY=5.0;targetY=1.5;}
 else if(t>=39.24&&t<55.5){camX=-.6;camZ=12.3;}
 else if(t>=55.5&&t<62.9){camX=Math.sin((t-55.5)*.35)*.6;camZ=12.15;}
 else if(t>=78.4&&t<96.68){camZ=12.4;camY=4.8;}
 else if(t>=96.68){camX=.2;camZ=12.3;}
 const closeKids=(t>=10.98&&t<14.94)||(t>=22.92&&t<30.36)||(t>=39.24&&t<43.02)||(t>=66.52&&t<70.54)||(t>=78.4&&t<81.66)||(t>=100.20&&t<104.42);
 if(closeKids){parents.forEach(c=>c.root.visible=false);camX=0;camY=4.0;camZ=9.0;targetY=1.50;dog.root.visible=false;cat.root.visible=false;}
 if(t>=47&&t<55.5){const left=t<51.04;cast.forEach(c=>{c.root.visible=left?c.x<0:c.x>0;if(c.root.visible)c.root.position.x=c.x+(left?2.325:-2.35);});camX=0;camY=4.25;camZ=10.1;targetY=1.65;dog.root.visible=false;cat.root.visible=false;}
 camera.position.set(camX,camY,camZ);camera.lookAt(0,targetY,0);
 renderer.render(scene,camera);ctx.drawImage(renderer.domElement,0,0);drawOverlay(t,state,beat);
 return {time:t,action:state.action,lyric:phraseAt(t)?.text||'',drawCalls:renderer.info.render.calls};
};
window.captureFrame=(t,quality=.97)=>{window.renderFrame(t);return canvas.toDataURL('image/jpeg',quality).split(',')[1];};
window.movieReady=true;window.renderFrame(0);
const audio=document.querySelector('#music'),play=document.querySelector('#play');
if(new URLSearchParams(location.search).has('render'))play.style.display='none';
play.onclick=()=>{audio.play();play.style.display='none';function loop(){window.renderFrame(audio.currentTime);if(!audio.paused)requestAnimationFrame(loop);}loop();};
audio.onended=()=>{play.style.display='grid';play.firstElementChild.textContent='↻ Dance again!';};
