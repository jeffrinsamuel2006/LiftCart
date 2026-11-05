import * as THREE from 'three';
const mat=(c)=>new THREE.MeshStandardMaterial({color:c,roughness:.78});
function limb(parent,a,b,r,material){
 const d=new THREE.Vector3().subVectors(b,a),m=new THREE.Mesh(new THREE.CylinderGeometry(r*.78,r,d.length(),8),material);
 m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());m.castShadow=true;parent.add(m);return m;
}
function makePerson({shirt,pants,skin,cap=false}){
 const g=new THREE.Group(), torso=mat(shirt), leg=mat(pants), face=mat(skin), shoe=mat('#202a31');
 const body=new THREE.Mesh(new THREE.BoxGeometry(.48,.72,.25),torso);body.position.y=1.18;body.castShadow=true;g.add(body);
 const head=new THREE.Mesh(new THREE.SphereGeometry(.19,14,12),face);head.position.set(0,1.72,0);head.castShadow=true;g.add(head);
 if(cap){const hat=new THREE.Mesh(new THREE.CylinderGeometry(.2,.2,.09,16),mat('#263d52'));hat.position.set(0,1.9,0);g.add(hat)}
 const arms=[],legs=[];
 for(const s of [-1,1]){
  const arm=new THREE.Group();arm.position.set(s*.29,1.43,0);g.add(arm);
  limb(arm,new THREE.Vector3(0,0,0),new THREE.Vector3(s*.08,-.42,.02),.075,torso);
  limb(arm,new THREE.Vector3(s*.08,-.42,.02),new THREE.Vector3(s*.08,-.76,.09),.06,face);
  arms.push(arm);
  const legGroup=new THREE.Group();legGroup.position.set(s*.13,.82,0);g.add(legGroup);
  limb(legGroup,new THREE.Vector3(0,0,0),new THREE.Vector3(0,-.42,0),.095,leg);
  const foot=new THREE.Mesh(new THREE.BoxGeometry(.16,.1,.29),shoe);foot.position.set(0,-.78,.08);legGroup.add(foot);
  legs.push(legGroup);
 }
 return {group:g,arms,legs};
}
export function createPeople(building){
 const people=new THREE.Group();people.name='Delivery worker and resident figures';building.group.add(people);
 const worker=makePerson({shirt:'#e0a34f',pants:'#263d55',skin:'#b97c59',cap:true});
 worker.group.name='Delivery worker';worker.group.position.set(1.6,0,1.2);people.add(worker.group);
 const resident=makePerson({shirt:'#68a8a0',pants:'#343b50',skin:'#a96f50'});
 resident.group.name='Resident';resident.group.position.set(1.6,3.15,1.2);resident.group.rotation.y=-Math.PI/2;people.add(resident.group);
 resident.group.visible=false;
 return {group:people,worker,resident};
}
