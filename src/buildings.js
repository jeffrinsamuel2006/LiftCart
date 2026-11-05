import * as THREE from 'three';

// World convention: 1 Three.js unit = 1 metre. Building shell is 13 m x 8 m;
// floor-to-floor height is 3.15 m (ground + three residential floors).
const data=[
 {id:'A',x:0,z:-8,color:'#d9d3c6',accent:'#a7b7b5',trim:'#eee9dd'},
 {id:'B',x:-22,z:-7,color:'#d6d9d4',accent:'#a8b7c4',trim:'#edf0e9'},
 {id:'C',x:22,z:-7,color:'#d9d1c8',accent:'#b7a99a',trim:'#f0e8dd'}
];
const mat=(c,r=.82,opts={})=>new THREE.MeshStandardMaterial({color:c,roughness:r,...opts});
function add(g,x,y,z,sx,sy,sz,m,name=''){const o=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;o.name=name;g.add(o);return o;}
function cylinder(g,x,y,z,r,h,m,name=''){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,16),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;o.name=name;g.add(o);return o;}
function windowAt(g,x,y,z,trim){
 add(g,x,y,z,1.72,1.48,.12,trim,'Window surround');
 const glass=mat('#7899a6',.22,{metalness:.18,transparent:true,opacity:.58});
 add(g,x,y,z-.075,1.52,1.27,.055,glass,'Reflective window glazing');
 add(g,x,y,z-.11,.055,1.34,.045,mat('#d8dedb',.42),'Window mullion');
 add(g,x,y,z-.11,1.58,.055,.045,mat('#d8dedb',.42),'Window transom');
 add(g,x,y-.81,z-.18,1.9,.12,.5,mat('#b7b5aa'),'Window sill');
}
function furniture(g,x,y,z,type){
 const wood=mat('#9b7656'),light=mat('#d9d1c2'),dark=mat('#47535a'),fabric=mat('#9aaea7'),metal=mat('#65757a',.45);
 if(type==='living'){
  add(g,x,y+.38,z,2.25,.72,.88,fabric,'Three-seat sofa');
  add(g,x,y+.79,z-.28,2.25,.12,.2,light,'Sofa back cushion');
  for(const dx of [-.78,.78])add(g,x+dx,y+.8,z+.03,.48,.12,.48,light,'Sofa cushion');
  add(g,x,y+.25,z+1.05,1.15,.12,.68,wood,'Coffee table');
  for(const dx of [-.48,.48])for(const dz of [.8,1.3])add(g,x+dx,y+.12,z+dz,.06,.24,.06,metal,'Coffee table leg');
  add(g,x,y+.08,z+1.85,1.5,.16,.55,mat('#b6b9b0'),'Area rug');
 } else if(type==='dining'){
  add(g,x,y+.78,z,1.45,.12,.9,wood,'Dining table');
  for(const dx of [-.52,.52])for(const dz of [-.55,.55])add(g,x+dx,y+.38,z+dz,.08,.72,.08,metal,'Dining table leg');
  for(const dx of [-.95,.95]){add(g,x+dx,y+.48,z,.42,.12,.42,dark,'Dining chair seat');add(g,x+dx,y+.78,z-.16,.42,.62,.08,dark,'Dining chair back');}
 } else if(type==='kitchen'){
  add(g,x,y+.48,z,2.2,.95,.62,light,'Kitchen base cabinets');
  add(g,x,y+.99,z,2.28,.12,.7,mat('#6f8584'),'Kitchen countertop');
  add(g,x-.55,y+1.09,z-.05,.5,.04,.35,metal,'Sink');
  add(g,x+.55,y+1.09,z-.05,.5,.04,.35,dark,'Cooktop');
  add(g,x,y+1.62,z-.28,2.1,.95,.16,wood,'Kitchen upper cabinets');
 } else if(type==='bedroom'){
  add(g,x,y+.32,z,1.65,.5,2.05,light,'Bed base');
  add(g,x,y+.62,z-.25,1.68,.18,1.55,mat('#e7e2d8'),'Mattress');
  for(const dx of [-.48,.48])add(g,x+dx,y+.76,z-.82,.58,.16,.42,mat('#f5f0e7'),'Pillow');
  add(g,x,y+.92,z-1.08,1.85,.9,.12,wood,'Headboard');
  add(g,x+1.25,y+.45,z-.65,.48,.9,.48,wood,'Bedside table');
 } else if(type==='plant'){
  cylinder(g,x,y+.18,z,.22,.36,mat('#b77e56'),'Planter');
  const crown=new THREE.Mesh(new THREE.SphereGeometry(.42,12,10),mat('#57815f'));crown.position.set(x,y+.72,z);crown.castShadow=true;g.add(crown);
 }
}
function make(d){
 const g=new THREE.Group();g.position.set(d.x,0,d.z);
 const floors=4,h=3.15,w=13,depth=8,top=floors*h;
 const wall=mat(d.color),accent=mat(d.accent),slab=mat('#e9e4d8'),inside=mat('#c7c5b9'),trim=mat(d.trim);
 for(let f=0;f<floors;f++)add(g,0,f*h-.12,0,w,.24,depth,slab,`Floor plate ${f}`);
 add(g,0,top+.18,0,w,.36,depth,accent,'Roof slab');
 add(g,0,top/2,-depth/2+.12,w,top,.24,wall,'Rear exterior wall');
 add(g,-w/2+.12,top/2,0,.24,top,depth,wall,'Left exterior wall');
 add(g,w/2-.12,top/2,0,.24,top,depth,wall,'Right exterior wall');
 const frontMat=mat(d.color,.8,{transparent:true,opacity:1,side:THREE.DoubleSide,depthWrite:true});
 const frontWall=add(g,0,top/2,depth/2-.12,w,top,.24,frontMat,'Front cutaway facade');
 for(let f=0;f<floors;f++){
  const y=f*h;
  // Ground floor is an open shared entrance/service level, not a residential unit.
  if(f>0){
   add(g,-1.1,y+1.45,-.9,.12,2.9,5.8,inside,`Apartment partition ${f}`);
   add(g,2.1,y+1.45,-2.4,4.8,2.9,.12,inside,`Corridor partition ${f}`);
   furniture(g,-3.8,y,-1.75,'living');
   furniture(g,.15,y,-2.15,'dining');
   furniture(g,-3.9,y,1.25,'kitchen');
   furniture(g,.15,y,1.45,'bedroom');
   furniture(g,-5.55,y,-3.1,'plant');
   for(const x of [-4.4,-2.3,0,2.3])windowAt(g,x,y+1.9,depth/2+.02,trim);
   const bx=-3.2,bz=depth/2+.78;
   add(g,bx,y+.95,bz,2.45,.13,1.45,accent,`Balcony slab ${f}`);
   add(g,bx,y+1.48,bz+.7,2.45,.08,.08,trim,'Balcony top rail');
   for(let k=-2;k<=2;k++)add(g,bx+k*.6,y+1.2,bz+.7,.055,.55,.055,trim,'Balcony baluster');
   add(g,bx-1.2,y+1.2,bz+.7,.06,.55,1.4,trim,'Balcony side rail');
   add(g,bx+1.2,y+1.2,bz+.7,.06,.55,1.4,trim,'Balcony side rail');
  }
  const lamp=new THREE.Mesh(new THREE.BoxGeometry(.55,.045,.22),new THREE.MeshStandardMaterial({color:'#fff0c9',emissive:'#f4d99b',emissiveIntensity:.45}));lamp.position.set(1.45,y+2.78,2.65);g.add(lamp);
  add(g,3.0,y+1.55,3.83,.42,.52,.08,mat('#405b65'),'Floor number plaque');
 }
 // Main entry and realistic approach steps.
 add(g,0,1.1,depth/2+.02,1.5,2.2,.14,mat('#526b73'),'Main entrance door');
 for(let i=0;i<3;i++)add(g,0,.08+i*.13,depth/2+.45+i*.32,2.7,.16,.64,slab,'Entry step');
 const shaftX=4.15,shaftZ=-.25,shaftW=2.05,shaftD=2.25,shaftH=top+.1;
 const shaft=new THREE.Group();shaft.name='Internal LiftCart shaft';shaft.position.set(shaftX,0,shaftZ);
 const rail=mat('#334c5b',.42),glass=new THREE.MeshStandardMaterial({color:'#83aebe',transparent:true,opacity:.2,roughness:.25,metalness:.2,side:THREE.DoubleSide});
 for(const x of [-shaftW/2,shaftW/2])for(const z of [-shaftD/2,shaftD/2])add(shaft,x,shaftH/2,z,.12,shaftH,.12,rail,'Shaft corner post');
 add(shaft,0,shaftH/2,-shaftD/2,shaftW,shaftH,.05,glass,'Rear shaft glazing');
 add(shaft,-shaftW/2,shaftH/2,0,.05,shaftH,shaftD,glass,'Left shaft glazing');
 add(shaft,shaftW/2,shaftH/2,0,.05,shaftH,shaftD,glass,'Right shaft glazing');
 // Persistent delivery storage: one cylinder remains inside each apartment after unloading.
 const deliveredCylinder=[];
 for(let f=0;f<floors;f++){
  const prop=new THREE.Group();prop.name=`Resident-owned delivered cylinder floor ${f}`;
  const body=mat('#b83e35',.48,{metalness:.08});
  const darkMetal=mat('#39474b',.55,.0);
  const baseY=f*h+.08;
  cylinder(prop,0,.39,0,.19,.62,body,'Delivered LPG cylinder body');
  cylinder(prop,0,.72,0,.145,.12,body,'Delivered LPG cylinder shoulder');
  cylinder(prop,0,.81,0,.055,.09,darkMetal,'Delivered LPG cylinder valve');
  cylinder(prop,0,.075,0,.22,.08,darkMetal,'Delivered LPG cylinder foot ring');
  prop.position.set(-4.95,baseY,1.35);
  prop.visible=false;
  g.add(prop);deliveredCylinder.push(prop);
 }
 const landingDoors=[];
 for(let f=0;f<floors;f++){
  const door=new THREE.Group();door.name=`Landing door floor ${f}`;const leafMat=mat('#78909a',.55,{transparent:true,opacity:.72,side:THREE.DoubleSide});
  add(door,-.27,1.18,shaftD/2+.04,.5,2.3,.08,leafMat,'Left sliding landing door');
  add(door,.27,1.18,shaftD/2+.04,.5,2.3,.08,leafMat,'Right sliding landing door');
  add(door,-.59,1.18,shaftD/2+.04,.08,2.45,.18,accent);add(door,.59,1.18,shaftD/2+.04,.08,2.45,.18,accent);add(door,0,2.43,shaftD/2+.04,1.25,.08,.18,accent);
  door.position.y=f*h;shaft.add(door);landingDoors.push(door);
  add(g,shaftX,f*h+.12,shaftZ+shaftD/2+.85,2.3,.16,1.55,slab,`Landing lobby floor ${f}`);
 }
 g.add(shaft);
 // Separation wall between the private apartment area and the shared LiftCart/stair lobby.
 // The wall has a deliberate doorway aligned with the lift landing; it is not a sealed barrier.
 const partitionMat=mat('#c5c4b9',.88),doorFrame=mat('#536b74',.48),doorGlass=new THREE.MeshStandardMaterial({color:'#a7c3cb',transparent:true,opacity:.32,roughness:.25});
 const partitionX=2.75,doorZ=shaftZ+shaftD/2+.85,doorWidth=1.45,doorHeight=2.25;
 for(let f=0;f<floors;f++){
  const y=f*h;
  // Two wall segments preserve an access opening in front of the service landing.
  const zMin=-depth/2+.12,zMax=depth/2-.12;
  const leftEnd=doorZ-doorWidth/2,rightStart=doorZ+doorWidth/2;
  add(g,partitionX,y+1.5,(zMin+leftEnd)/2,.16,3.0,leftEnd-zMin,partitionMat,`Apartment service partition left ${f}`);
  add(g,partitionX,y+1.5,(rightStart+zMax)/2,.16,3.0,zMax-rightStart,partitionMat,`Apartment service partition right ${f}`);
  add(g,partitionX,y+doorHeight+(3-doorHeight)/2,doorZ,.16,3-doorHeight,doorWidth,partitionMat,`Partition lintel ${f}`);
  // Open doorway frame and a sliding glass panel, shown open to make the route legible.
  add(g,partitionX,y+doorHeight/2,doorZ-doorWidth/2,.12,doorHeight,.1,doorFrame,`Partition doorway jamb ${f}`);
  add(g,partitionX,y+doorHeight/2,doorZ+doorWidth/2,.12,doorHeight,.1,doorFrame,`Partition doorway jamb ${f}`);
  add(g,partitionX,y+doorHeight+.05,doorZ,.12,.1,doorWidth+.12,doorFrame,`Partition doorway header ${f}`);
  const accessPanel=add(g,partitionX-.09,y+1.05,doorZ+doorWidth*.38,.045,2.05,.035,doorGlass,`Sliding access panel ${f}`);
  accessPanel.visible=false;
 }
 // Staircase positioned on the RIGHT side of the lift shaft in the service bay.
 // One straight flight per storey keeps the stair beside, rather than behind, the lift.
 const stairX=5.78,stairZ=1.55,stairWidth=.92,stairRun=4.16,stairRise=h;
 const stairMat=mat('#8d9695',.82),treadMat=mat('#d7d4ca',.9),railMat=mat('#465c66',.5);
 for(let f=0;f<floors-1;f++){
  const y=f*h,steps=16,stepRise=stairRise/steps,stepRun=stairRun/steps;
  for(let i=0;i<steps;i++){
   const yy=y+(i+1)*stepRise-.06,zz=stairZ-(i+.5)*stepRun;
   add(g,stairX,yy,zz,stairWidth,.12,stepRun+.025,treadMat,`Right-side stair tread F${f} ${i+1}`);
  }
  const railA=new THREE.Vector3(stairX-stairWidth/2-.06,y+.18,stairZ+.08);
  const railB=new THREE.Vector3(stairX-stairWidth/2-.06,y+stairRise+.18,stairZ-stairRun-.08);
  const railC=new THREE.Vector3(stairX+stairWidth/2+.06,y+.18,stairZ+.08);
  const railD=new THREE.Vector3(stairX+stairWidth/2+.06,y+stairRise+.18,stairZ-stairRun-.08);
  const addRail=(a,b,name)=>{const d=new THREE.Vector3().subVectors(b,a),m=add(g,0,0,0,.055,d.length(),.055,railMat,name);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());};
  addRail(railA,railB,`Right stair handrail inner F${f}`);
  addRail(railC,railD,`Right stair handrail outer F${f}`);
  for(let i=0;i<=8;i++){
   const t=i/8,yy=y+.18+stairRise*t,zz=stairZ-stairRun*t;
   for(const x of [stairX-stairWidth/2-.06,stairX+stairWidth/2+.06])add(g,x,yy+.43,zz,.045,.86,.045,railMat,`Right stair baluster F${f}`);
  }
 }
 // Roof parapet, downpipes, facade bands and entrance canopy give the block architectural scale.
 for(const x of [-w/2+.2,w/2-.2])add(g,x,top+.48,depth/2-.12,.16,.6,.16,accent,'Roof parapet pier');
 add(g,0,top+.42,depth/2-.12,w,.12,.18,trim,'Roof parapet cap');
 for(const x of [-6.25,6.25])add(g,x,top/2,depth/2+.04,.09,top,.09,accent,'Facade rainwater downpipe');
 add(g,0,2.45,depth/2+.55,3.2,.16,1.1,accent,'Entrance canopy');
 // Signboard.
 const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle='#102638';ctx.fillRect(0,0,512,128);ctx.fillStyle='#82e6bf';ctx.font='bold 48px Arial';ctx.fillText('BUILDING '+d.id,24,82);
 const sign=new THREE.Mesh(new THREE.PlaneGeometry(4.2,1.05),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c)}));sign.position.set(0,top+1.15,depth/2+.25);g.add(sign);
 return {group:g,data:d,zone:shaft,shaft,frontWall,frontMaterial:frontMat,landingDoors,deliveredCylinder,shaftWorld:new THREE.Vector3(d.x+shaftX,0,d.z+shaftZ),shaftLocal:{x:shaftX,z:shaftZ},setCutaway(show){frontMat.transparent=show;frontMat.opacity=show?.12:1;frontMat.depthWrite=!show;frontMat.needsUpdate=true;frontMat.color.set(show?'#a9c2c8':d.color);}};
}
export function createBuildings(scene){const map=new Map();for(const d of data){const b=make(d);scene.add(b.group);map.set(d.id,b);}return map;}
