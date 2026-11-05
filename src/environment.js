import * as THREE from 'three';
const material=(color,roughness=.9,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
function box(scene,x,y,z,sx,sy,sz,color,name=''){const o=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),material(color));o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;o.name=name;scene.add(o);return o;}
function tree(scene,x,z,size=1){
 const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.13*size,.2*size,2.1*size,10),material('#76533b'));trunk.position.set(x,1.05*size,z);trunk.castShadow=true;scene.add(trunk);
 const crown=new THREE.Mesh(new THREE.SphereGeometry(1.15*size,16,12),material('#52795a'));crown.position.set(x,2.55*size,z);crown.castShadow=true;scene.add(crown);
 const crown2=new THREE.Mesh(new THREE.SphereGeometry(.72*size,14,10),material('#668b68'));crown2.position.set(x-.48*size,2.7*size,z+.25*size);scene.add(crown2);
}
function lamp(scene,x,z){
 const pole=new THREE.Mesh(new THREE.CylinderGeometry(.055,.075,4.4,10),material('#3e5058',.5,.45));pole.position.set(x,2.2,z);pole.castShadow=true;scene.add(pole);
 const arm=box(scene,x+.35,4.25,z,.8,.07,.07,'#3e5058','Streetlight arm');
 const head=new THREE.Mesh(new THREE.BoxGeometry(.38,.14,.22),new THREE.MeshStandardMaterial({color:'#fff1c9',emissive:'#e6c987',emissiveIntensity:.55}));head.position.set(x+.68,4.18,z);scene.add(head);
}
function bench(scene,x,z){
 for(let i=0;i<4;i++)box(scene,x,.52,z-.25+i*.16,1.8,.07,.12,'#8b6b4f','Park bench slat');
 for(const dx of [-.68,.68]){box(scene,x+dx,.28,z,.08,.55,.08,'#45535a','Bench leg');box(scene,x+dx,.82,z-.35,.08,.72,.08,'#45535a','Bench back support');}
}
function car(scene,x,z,color,rot=0){
 const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rot;
 const body=new THREE.Mesh(new THREE.BoxGeometry(4.25,.72,1.82),material(color,.42,.2));body.position.y=.72;body.castShadow=true;g.add(body);
 const cabin=new THREE.Mesh(new THREE.BoxGeometry(2.25,.78,1.55),material('#aabdc2',.28,.12));cabin.position.set(-.15,1.38,0);cabin.castShadow=true;g.add(cabin);
 const glass=material('#496574',.22,.15);for(const dx of [-.72,.55]){const pane=new THREE.Mesh(new THREE.BoxGeometry(.78,.55,1.58),glass);pane.position.set(dx,1.4,0);g.add(pane);}
 const wheelMat=material('#20262b',.88);for(const dx of [-1.35,1.35])for(const dz of [-.88,.88]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.34,.34,.18,20),wheelMat);w.rotation.x=Math.PI/2;w.position.set(dx,.38,dz);g.add(w);}
 const lampMat=new THREE.MeshStandardMaterial({color:'#fff1c9',emissive:'#f1d89b',emissiveIntensity:.3});for(const dz of [-.58,.58]){const l=new THREE.Mesh(new THREE.BoxGeometry(.12,.16,.22),lampMat);l.position.set(2.12,.82,dz);g.add(l);}
 g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});scene.add(g);
}
export function createColony(scene){
 // 1 unit = 1 metre. Roads, paths, vehicles and landscaping use approximate real dimensions.
 box(scene,0,.015,0,68,.04,10,'#68747a','Internal access road');
 box(scene,0,.025,-13,68,.05,3.2,'#c5c5b8','North pedestrian path');
 box(scene,0,.025,13,68,.05,3.2,'#c5c5b8','South pedestrian path');
 for(let x=-27;x<=27;x+=9)box(scene,x,.045,6.5,.12,.025,4.4,'#e7e4d7','Pedestrian crossing marking');
 for(let x=-30;x<=30;x+=6)box(scene,x,.045,0,2.4,.025,.12,'#e8e1c7','Road lane marking');
 // Landscaped green strips and tree islands.
 for(const [x,z] of [[-20,-17],[0,-17],[20,-17],[-20,17],[0,17],[20,17]]){
  const island=new THREE.Mesh(new THREE.CylinderGeometry(2.5,2.5,.22,32),material('#5e8065'));island.position.set(x,.11,z);island.receiveShadow=true;scene.add(island);tree(scene,x,z,1.05);
  for(const a of [-1,1]){const shrub=new THREE.Mesh(new THREE.SphereGeometry(.42,12,9),material('#6e956d'));shrub.position.set(x+a*1.45,.42,z+.65);shrub.castShadow=true;scene.add(shrub);}
 }
 // Low hedges, boundary walls and gate.
 box(scene,0,.55,-25,72,1.1,.35,'#b9b9ac','Rear boundary wall');box(scene,-35.8,.55,0,.35,1.1,50,'#b9b9ac','West boundary wall');box(scene,35.8,.55,0,.35,1.1,50,'#b9b9ac','East boundary wall');
 box(scene,-5,1.1,24.5,.45,2.2,.45,'#d4d9d6','Gate pillar');box(scene,5,1.1,24.5,.45,2.2,.45,'#d4d9d6','Gate pillar');box(scene,0,.95,24.5,10,.18,.22,'#3b5968','Colony entrance gate');
 // Street furniture and parking bays.
 for(const x of [-29,-14,14,29])lamp(scene,x,4.2);
 bench(scene,-17,11);bench(scene,17,11);
 for(const x of [-27,-9,9,27]){box(scene,x,.035,8.9,5.3,.05,2.3,'#a4a69a','Parking bay');}
 car(scene,-25,8.6,'#526f83',0);car(scene,-7,8.6,'#b77b56',0);car(scene,11,8.6,'#657d68',0);car(scene,25,8.6,'#c5c8c5',0);
 // Small utility / security kiosk at the entrance edge.
 box(scene,-9,1.45,20,4.2,2.9,3.2,'#d6d1c4','Security kiosk');box(scene,-9,1.5,18.36,1.35,1.05,.08,'#7193a0','Kiosk window');box(scene,-9,2.95,18.36,4.3,.16,.18,'#8b9b95','Kiosk canopy');
}
