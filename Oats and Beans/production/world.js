import * as T from 'three';

export const palette={skin:0xf1b37a,hair:0x3c201d,yellow:0xffd14a,teal:0x29a9b5,purple:0xa579df,coral:0xf78374,grass:0xa6d56b,cream:0xfff3d5};
const materials=new Map(), sphere=new T.SphereGeometry(1,28,20), cube=new T.BoxGeometry(1,1,1);
export function mat(c,roughness=.66){let key=c+':'+roughness;if(!materials.has(key))materials.set(key,new T.MeshStandardMaterial({color:c,roughness}));return materials.get(key);}
export function ball(parent,c,x,y,z,sx=1,sy=sx,sz=sx){const m=new T.Mesh(sphere,mat(c));m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
export function box(parent,c,x,y,z,sx,sy,sz){const m=new T.Mesh(cube,mat(c));m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function capsule(parent,c,r,length){const m=new T.Mesh(new T.CapsuleGeometry(r,Math.max(.001,length-2*r),8,16),mat(c));m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function line(parent,c,points,r=.025){const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));const m=new T.Mesh(new T.TubeGeometry(curve,20,r,8,false),mat(c));parent.add(m);return m;}
function link(m,a,b){m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());m.scale.y=a.distanceTo(b);}
function rod(parent,c,r){return capsule(parent,c,r,1);}
function group(parent,x=0,y=0,z=0){const g=new T.Group();g.position.set(x,y,z);parent.add(g);return g;}
const V=(x,y,z)=>new T.Vector3(x,y,z);
function smooth(a,b,t){t=Math.max(0,Math.min(1,t));return a+(b-a)*t*t*(3-2*t);}

export function character(scene,{x,z=0,scale=1,girl=false,adult=false,dad=false,shirt=palette.yellow,pants=palette.teal,phase=0}){
 const root=group(scene,x,0,z);root.scale.setScalar(scale);const body=group(root);const skin=adult?0xe8aa77:palette.skin;
 const head=group(body,0,2.34,0);const headScale=adult?.88:1;head.scale.setScalar(headScale);
 ball(head,skin,0,0,0,.61,.63,.51); // broad soft cheeks
 ball(head,skin,-.59,-.04,0,.115,.17,.105);ball(head,skin,.59,-.04,0,.115,.17,.105);
 ball(head,0xdd8b62,-.624,-.04,.065,.047,.09,.035);ball(head,0xdd8b62,.624,-.04,.065,.047,.09,.035);
 const eyes=[];
 for(const side of [-1,1]){
   const eye=group(head,side*.237,.065,.441);eye.rotation.y=side*.1;eyes.push(eye);
   ball(eye,0xffffff,0,0,0,.174,.205,.104);
   ball(eye,0x6b3c26,0,-.008,.082,.121,.147,.047);
   ball(eye,0x251a1b,0,-.006,.121,.071,.10,.018);
   ball(eye,0xffffff,-.034,.043,.138,.034,.038,.012);ball(eye,0xffffff,.039,-.05,.14,.014,.016,.008);
   line(head,palette.hair,[[side*.39,.33,.427],[side*.26,.363,.48],[side*.14,.33,.474]],.029);
   ball(head,0xf3a090,side*.36,-.20,.414,.115,.057,.035);
 }
 ball(head,skin,0,-.1,.514,.105,.09,.087);
 const mouth=group(head,0,-.26,.494);
 const smile=new T.Shape();smile.moveTo(-.205,.016);smile.quadraticCurveTo(0,-.046,.205,.016);smile.quadraticCurveTo(.18,-.155,0,-.151);smile.quadraticCurveTo(-.18,-.155,-.205,.016);
 const smileMesh=new T.Mesh(new T.ShapeGeometry(smile),mat(0x723731));mouth.add(smileMesh);
 const teeth=new T.Shape();teeth.moveTo(-.177,.008);teeth.quadraticCurveTo(0,-.048,.177,.008);teeth.lineTo(.142,-.054);teeth.quadraticCurveTo(0,-.094,-.142,-.054);teeth.closePath();
 const teethMesh=new T.Mesh(new T.ShapeGeometry(teeth),mat(0xfff8ed));teethMesh.position.z=.005;mouth.add(teethMesh);ball(mouth,0xf18f93,0,-.127,.010,.081,.021,.009);
 // Individually arranged curls keep the silhouette round and friendly.
 ball(head,palette.hair,0,.35,-.06,.592,.38,.465);
 for(let i=0;i<18;i++){let a=i*2.39996;let r=.15+.34*Math.sqrt(i/18);let px=Math.cos(a)*r, pz=Math.sin(a)*r;
   ball(head,i%3?palette.hair:0x4b2a24,px,.50+.13*(1-i/18),pz,.16,.15,.155);}
 for(let i=0;i<7;i++)ball(head,i%2?0x4a2a23:palette.hair,-.46+i*.15,.34+.08*Math.sin(i*.85),.37,.14,.145,.125);
 if(girl){for(const s of [-1,1]){const bun=group(head,s*.57,.49,-.07);ball(bun,palette.hair,0,0,0,.255);for(let i=0;i<7;i++){let a=i*6.28/7;ball(bun,0x492720,.19*Math.cos(a),.18*Math.sin(a),.02,.108);}ball(bun,palette.coral,-s*.10,-.20,.08,.115,.06,.13);ball(bun,palette.yellow,-s*.10,-.205,.196,.058);}}
 if(dad){for(let i=0;i<12;i++){let a=Math.PI+(i/11)*Math.PI;ball(head,0x4d2c25,Math.cos(a)*.43,Math.sin(a)*.29-.18,.27,.13,.14,.15);}for(let s of [-1,1]){ball(head,0x4d2c25,s*.09,-.232,.493,.116,.045,.04);}}
 ball(body,skin,0,1.77,0,.14,.18,.15);
 ball(body,shirt,0,1.33,0,.435,.53,.277);
 ball(body,pants,0,.91,0,.39,.25,.275);
 if(girl){box(body,pants,0,1.42,.264,.44,.47,.037);for(let s of [-1,1]){box(body,pants,s*.18,1.69,.23,.082,.33,.045);ball(body,palette.yellow,s*.17,1.58,.296,.033);} // daisy on bib
   for(let i=0;i<5;i++){let a=i*6.283/5;ball(body,0xfff9e8,Math.cos(a)*.059,1.38+Math.sin(a)*.059,.303,.035,.052,.016);}ball(body,palette.yellow,0,1.38,.325,.033,.033,.014);
 }else if(!adult){line(body,0x59a777,[[0,1.15,.276],[0,1.37,.289],[.01,1.49,.276]],.016);let l=ball(body,0x6daf79,-.067,1.4,.288,.047,.089,.018);l.rotation.z=.6;let r=ball(body,0x6daf79,.065,1.45,.283,.047,.087,.018);r.rotation.z=-.6;}
 else if(dad){for(let y=1.15;y<1.75;y+=.18)ball(body,0xf8ebd2,0,y,.281,.014);box(body,0x3198a1,.20,1.49,.259,.14,.15,.025);}
 const arms=[];for(const s of [-1,1]){let shoulder=V(s*.385,1.65,0),a=rod(body,shirt,.15),b=rod(body,skin,.099),elbow=ball(body,skin,0,0,0,.104),hand=group(body);ball(hand,skin,0,0,0,.112,.12,.069);
   let fingers=[];for(let i=0;i<4;i++){const f=capsule(hand,skin,.027,.14);f.position.set((i-1.5)*.047,-.09,.005);f.rotation.z=(i-1.5)*-.06;fingers.push(f);}ball(hand,skin,-s*.10,.008,.021,.048,.076,.041);arms.push({s,shoulder,a,b,elbow,hand,fingers});}
 const legs=[];for(const s of [-1,1]){let hip=V(s*.205,.93,0),upper=rod(root,adult?pants:skin,.134),lower=rod(root,adult?pants:skin,adult?.13:.102),joint=ball(root,adult?pants:skin,0,0,0,adult?.131:.105),short=ball(body,pants,s*.205,.80,0,.19,.21,.26),shoe=group(root);ball(shoe,0xfffbf0,0,.086,.043,.18,.098,.29);ball(shoe,girl?palette.coral:adult?(dad?0xf29d46:palette.teal):0xb09fce,0,.15,.045,.165,.092,.262);ball(shoe,0xfffbf0,0,.13,.233,.153,.073,.062);for(let i=0;i<3;i++)box(shoe,0xfffbf0,0,.225-i*.013,.10+i*.04,.17,.013,.013);legs.push({s,hip,upper,lower,joint,shoe});}
 function pose(t,action,local=0,beat=0,freeze=false,marks=[]){
  let q=beat*2*Math.PI, wave=Math.sin(q),slow=Math.sin(q*.5+phase*.2),bounce=.045*(1-Math.cos(q*2));
  let bend=0,yaw=0,lean=0,armsUp=0,left=V(-.62,1.05,.10),right=V(.62,1.05,.10),liftL=0,liftR=0;
  if(action==='grow'){armsUp=.5+.5*Math.sin(q*.25-.8);left.set(-.60-.24*armsUp,1.0+1.8*armsUp,.05);right.set(.60+.24*armsUp,1.0+1.8*armsUp,.05);lean=.06*slow;}
  if(action==='wave'){left.set(-.63,1.1,.03);right.set(.83+.12*Math.sin(q),2.59,.15);lean=.07*slow;}
  if(action==='dance'||action==='copy'){left.set(-.6,1.8+.4*slow,.18);right.set(.6,1.8-.4*slow,.18);liftL=.17*Math.max(0,slow);liftR=.17*Math.max(0,-slow);lean=-.09*slow;}
  if(action==='wonder'){left.set(-.72,1.59,.30);right.set(.72,1.59,.30);head.rotation.z=.09*slow;}
  if(action==='plant'||action==='pat'){bend=.48+.045*Math.sin(q);left.set(-.26,.51+.09*Math.sin(q),.62);right.set(.26,.51+.09*Math.sin(q+1.2),.62);lean=.08;}
  if(action==='rain'){left.set(-.5,2.15-.21*(1+Math.sin(q*.5)),.53);right.set(.5,2.15-.21*(1+Math.sin(q*.5)),.53);}
  if(action==='reach'){left.set(-.77,2.72+.055*wave,.02);right.set(.77,2.72+.055*wave,.02);lean=.06*slow;}
  if(action==='sway'){lean=.20*Math.sin(q*.25);left.set(-.8,2.05,.04);right.set(.8,2.05,.04);}
  if(action==='partner'){yaw=x<0?Math.PI/2:-Math.PI/2;left.set(-.55,1.55,.5);right.set(.55,1.55,.5);}
  if(action==='stamp'){liftL=0;liftR=0;marks.forEach((mark,i)=>{let p=(t-(mark-.46))/.46;if(p>0&&p<1){let lift=.34*Math.sin(p*Math.PI);if(i%2)liftR=lift;else liftL=lift;}});left.set(-.52,1.34,.12);right.set(.52,1.34,.12);bounce=.018;}
  if(action==='clap'){let spread=.035+.45*(.5+.5*Math.cos(q));left.set(-spread,1.63,.67);right.set(spread,1.63,.67);}
  if(action==='turn'){if(local<1.48)yaw=smooth(0,Math.PI*2,local/1.48);else{bend=.46*Math.sin(Math.min(1,(local-1.48)/1.55)*Math.PI);left.set(-.3,.88,.43);right.set(.3,.88,.43);}}
  if(action==='freeze'){left.set(-.80,2.53,0);right.set(.80,2.53,0);if(freeze){bounce=0;lean=.06;}}
  if(action==='seedtree'){let g=smooth(0,1,(local-.7)/1.0);bend=.50*(1-g);left.set(-.3-.4*g,.5+2.2*g,.4*(1-g));right.set(.3+.4*g,.5+2.2*g,.4*(1-g));}
  body.position.y=bounce-bend;body.rotation.z=lean;root.rotation.y=yaw;head.rotation.y=.045*Math.sin(q*.25);if(action!=='wonder')head.rotation.z=-lean*.4;
  root.position.x=x+(action==='dance'?.10*slow:0);root.position.y=0;
  const blink=(t+phase*.45)%4.6; // lids close briefly, never an empty face
  eyes.forEach(e=>e.scale.y=1-.96*Math.exp(-Math.pow((blink-.12)/.055,2)));
  for(const arm of arms){let target=arm.s<0?left:right;let el=arm.shoulder.clone().lerp(target,.53);el.x+=arm.s*(action==='clap'?.24:.13);el.z+=action==='plant'?.10:.035;
   link(arm.a,arm.shoulder,el);link(arm.b,el,target);arm.elbow.position.copy(el);arm.hand.position.copy(target);arm.hand.rotation.y=action==='clap'?arm.s*Math.PI/2:0;arm.hand.rotation.z=action==='clap'?Math.PI:arm.s*-.10;
   arm.hand.rotation.x=action==='rain'?-.45:action==='reach'?Math.PI:0;
   arm.fingers.forEach((f,i)=>{f.rotation.x=action==='rain'?.3*Math.sin(q*2+i):0;});}
  for(const leg of legs){let lift=leg.s<0?liftL:liftR;const hip=leg.hip.clone().applyAxisAngle(V(0,0,1),lean);hip.y+=bounce-bend;
   const foot=V(leg.s*(.23+bend*.20),.16+lift,.03+lift*.35);const knee=hip.clone().lerp(foot,.51);knee.z+=.04+bend*.70+lift*.4;knee.x+=leg.s*bend*.12;
   link(leg.upper,hip,knee);link(leg.lower,knee,foot);leg.joint.position.copy(knee);leg.shoe.position.set(foot.x,lift,foot.z);leg.shoe.rotation.x=-lift*.5;}
  return root;
 }
 return {root,body,head,pose,x,adult,phase};
}

export function makeFarm(scene){
 const farm=group(scene);const ground=new T.Mesh(new T.PlaneGeometry(200,200),mat(0xb1d775));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;ground.position.y=-.04;farm.add(ground);
 // A generous sand-coloured clearing keeps feet and choreography easy to read.
 const stage=new T.Mesh(new T.CircleGeometry(7.8,80),mat(0xf5dfa7));stage.rotation.x=-Math.PI/2;stage.position.set(0,-.023,.7);stage.scale.set(1,.72,1);stage.receiveShadow=true;farm.add(stage);
 for(let i=0;i<6;i++){ball(farm,i%2?0x8dc976:0x96ce79,-17+i*7,.5,-16-(i%2)*4,7,2.1,5);}
 const barn=group(farm,-6.5,0,-6.5);box(barn,0xe78171,0,1.55,0,3.2,3.1,2.4);box(barn,0xfcad85,0,2.94,0,3.1,.18,2.45);
 const roof1=box(barn,0x477c85,-.84,3.37,0,2.12,.18,3.0);roof1.rotation.z=.52;const roof2=box(barn,0x477c85,.84,3.37,0,2.12,.18,3.0);roof2.rotation.z=-.52;
 box(barn,0xf9edcf,0,1.15,1.235,1.62,2.24,.10);box(barn,0xd45f55,0,1.13,1.302,1.40,2.0,.04);box(barn,0xfff1d5,0,1.13,1.343,.065,2.0,.035);
 for(const s of [-1,1]){let b=box(barn,0xfff1d5,s*.33,1.1,1.34,.07,2.23,.04);b.rotation.z=s*.31;}box(barn,0xffeaba,0,2.61,1.24,.62,.48,.1);box(barn,0x669ca5,0,2.61,1.31,.43,.3,.05);
 for(let x=-12;x<=12;x+=1.5){if(x>-8&&x<-4)continue;box(farm,0xfff4d9,x,.60,-4.6,.16,1.2,.16);ball(farm,0xfff4d9,x,1.20,-4.6,.115,.12,.115);}
 box(farm,0xfff4d9,2,.44,-4.65,21,.12,.1);box(farm,0xfff4d9,2,.87,-4.65,21,.12,.1);
 function tree(x,z,size=1){const tr=group(farm,x,0,z);tr.scale.setScalar(size);const trunk=capsule(tr,0xb68b5a,.23,2.2);trunk.position.y=1.1;ball(tr,0x62aa68,0,2.7,0,1.0,1.3,.95);ball(tr,0x75bb6b,-.64,2.49,0,.68,.85,.72);ball(tr,0x8ac577,.58,2.58,.1,.75,.88,.74);for(let i=0;i<5;i++){let a=i*2.4;ball(tr,0xf6b14e,.65*Math.cos(a),2.25+(i%3)*.33,.67,.13);}return tr;}
 tree(7.6,-5.8,1.28);tree(-11,-7,.8);tree(11,-12,1.3);
 // Small crop beds: wheat-like oats and barley, broad-leaf bean plants.
 const crops=[];
 for(let side of [-1,1])for(let row=0;row<3;row++)for(let i=0;i<6;i++){
   let x=side*(5.2+i*.47),z=1.1-row*1.05;const p=group(farm,x,0,z);ball(p,0xb59360,0,.01,0,.27,.07,.35);
   const plant=group(p);const stem=capsule(plant,0x679449,.022,.68);stem.position.y=.34;
   if(side<0){for(let j=0;j<5;j++)for(let s of [-1,1]){let e=ball(plant,0xf0bf53,s*.07,.46+j*.067,0,.064,.09,.041);e.rotation.z=-s*.52;}}
   else {for(let j=0;j<4;j++){let s=j%2?-1:1;let l=ball(plant,0x5aab61,s*.12,.22+j*.12,0,.17,.075,.06);l.rotation.z=s*.3;}ball(plant,0x81b646,.13,.37,.06,.048,.18,.05);}
   crops.push(plant);
 }
 const clouds=[];for(let i=0;i<7;i++){const c=group(scene,-16+i*5.5,7.2+(i%3)*.6,-18-(i%2)*4);for(let j=0;j<5;j++)ball(c,0xfffcf2,(j-2)*.5,Math.sin(j)*.1,0,.60,.38+(j%2)*.17,.40);clouds.push(c);}
 const sun=group(scene,10,7.2,-22);ball(sun,0xffd36b,0,0,0,1.05);for(let s of [-1,1])ball(sun,0x88653e,s*.27,.08,1.035,.06,.10,.03);line(sun,0x88653e,[[-.22,-.25,1.025],[0,-.34,1.025],[.22,-.25,1.025]],.028);
 const sprouts=[];for(let x of [-2.0,0,2.0]){const g=group(farm,x,0,2);ball(g,0xb38c5f,0,.015,0,.35,.045,.24);let spr=group(g);const stem=capsule(spr,0x5f9e59,.03,.4);stem.position.y=.2;for(let s of [-1,1]){let l=ball(spr,0x72b66e,s*.13,.31,0,.18,.079,.09);l.rotation.z=s*.45;}sprouts.push(spr);}
 const rainbow=group(scene,0,1,-10);for(let i=0;i<5;i++){let radius=5.5-i*.23;const curve=new T.EllipseCurve(0,0,radius,radius,0,Math.PI,false,0);const points=curve.getPoints(64).map(p=>V(p.x,p.y,0));const tube=new T.TubeGeometry(new T.CatmullRomCurve3(points),64,.12,10,false);const mesh=new T.Mesh(tube,mat([0xf29d93,0xf5c26b,0xf5df89,0x85cba2,0x8caadb][i]));rainbow.add(mesh);}rainbow.visible=false;
 return {farm,crops,clouds,sun,sprouts,rainbow};
}

export function puppy(scene,x=4.35,z=1.3){const root=group(scene,x,0,z);const b=group(root);ball(b,0xc68d4d,0,.39,0,.27,.38,.48);const head=group(b,0,.81,.29);ball(head,0xe8b66f,0,0,0,.34,.31,.31);for(let s of [-1,1]){const ear=ball(head,0xbb803f,s*.31,-.11,-.01,.13,.31,.14);ear.rotation.z=s*.17;ball(head,0xffffff,s*.12,.033,.274,.075,.09,.027);ball(head,0x29221f,s*.12,.025,.294,.047,.065,.017);}ball(head,0xf3cd8b,0,-.13,.26,.22,.12,.10);ball(head,0x342725,0,-.055,.352,.064,.047,.04);ball(head,0xf48f96,0,-.22,.304,.060,.10,.033);for(let s of [-1,1]){ball(root,0xf0c07f,s*.16,.10,.24,.13,.11,.20);ball(root,0xf0c07f,s*.23,.10,-.28,.15,.11,.20);}const tail=group(b,0,.5,-.39);const tm=capsule(tail,0xd7a565,.07,.40);tm.position.y=.19;tail.rotation.x=-.8;return {root,animate(t,freeze){if(freeze)return;b.position.y=.025*Math.sin(t*10);tail.rotation.z=.7*Math.sin(t*12);head.rotation.z=.10*Math.sin(t*3);}};}

export function kitten(scene,x=-4.6,z=1.2){const root=group(scene,x,0,z);ball(root,0xa4a6a8,0,.35,0,.22,.34,.29);const h=group(root,0,.76,.07);ball(h,0xb7b8b9,0,0,0,.27,.25,.24);for(const s of [-1,1]){const ear=new T.Mesh(new T.ConeGeometry(.125,.24,3),mat(0x94959b));ear.position.set(s*.19,.24,0);ear.rotation.z=-s*.2;h.add(ear);ball(h,0xbcd68b,s*.1,.03,.209,.068,.084,.027);ball(h,0x30343a,s*.1,.03,.234,.022,.057,.01);ball(root,0xf5f0e1,s*.13,.08,.16,.09,.08,.14);}ball(h,0xf9ebe4,0,-.10,.215,.14,.07,.05);ball(h,0xe8949c,0,-.065,.268,.038,.027,.022);line(root,0x989b9c,[[.19,.15,-.1],[.48,.3,-.2],[.51,.60,-.15]],.065);return {root,animate(t,freeze){if(!freeze)h.rotation.z=.10*Math.sin(t*2);}};}
