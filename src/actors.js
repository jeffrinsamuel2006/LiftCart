import * as THREE from 'three';
const mat=c=>new THREE.MeshStandardMaterial({color:c,roughness:.78});
function limb(parent,a,b,r,color){
 const d=new THREE.Vector3().subVectors(b,a),m=new THREE.Mesh(new THREE.CylinderGeometry(r*.72,r,d.length(),10),mat(color));
 m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());m.castShadow=true;parent.add(m);return m;
}
export function makePerson(parent,{x=0,y=0,z=0,shirt='#287c78',pants='#26384c',name='Person'}={}){
 const g=new THREE.Group();g.name=name;g.position.set(x,y,z);parent.add(g);
 const skin=mat('#c88f6a'),top=mat(shirt),bottom=mat(pants),shoe=mat('#202a32');
 const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.27,.58,5,10),top);torso.position.y=1.18;torso.castShadow=true;g.add(torso);
 const head=new THREE.Mesh(new THREE.SphereGeometry(.19,16,12),skin);head.position.set(0,1.75,0);head.castShadow=true;g.add(head);
 const hair=new THREE.Mesh(new THREE.SphereGeometry(.195,16,10,0,Math.PI*2,0,Math.PI*.55),mat('#24252a'));hair.position.set(0,1.82,0);g.add(hair);
 const arms=[],legs=[];
 for(const side of [-1,1]){
  const arm=new THREE.Group();arm.position.set(side*.28,1.42,0);g.add(arm);
  limb(arm,new THREE.Vector3(0,0,0),new THREE.Vector3(side*.04,-.45,.08),.09,shirt);
  limb(arm,new THREE.Vector3(side*.04,-.45,.08),new THREE.Vector3(side*.08,-.78,.2),.065,'#c88f6a');arms.push(arm);
  const leg=new THREE.Group();leg.position.set(side*.13,.84,0);g.add(leg);
  limb(leg,new THREE.Vector3(0,0,0),new THREE.Vector3(0,-.42,0),.105,pants);
  limb(leg,new THREE.Vector3(0,-.42,0),new THREE.Vector3(0,-.78,.08),.075,'#26384c');
  const foot=new THREE.Mesh(new THREE.BoxGeometry(.18,.1,.32),shoe);foot.position.set(0,-.8,.15);leg.add(foot);legs.push(leg);
 }
 return {group:g,arms,legs,head,torso};
}
