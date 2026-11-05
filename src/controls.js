import * as THREE from 'three';
export function bindControls({scene,camera,controls,buildings,liftCarts}){
 const select=document.querySelector('#buildingSelect'),grid=new THREE.GridHelper(100,50,'#7ba6a1','#6e8792');
 grid.position.y=.035;grid.material.transparent=true;grid.material.opacity=.22;grid.visible=false;scene.add(grid);
 const presets={colony:{p:new THREE.Vector3(34,27,39),t:new THREE.Vector3(0,4,0)},building:{p:new THREE.Vector3(18,15,25),t:new THREE.Vector3(4,6,-8)},front:{p:new THREE.Vector3(0,12,38),t:new THREE.Vector3(0,6,-7)},interior:{p:new THREE.Vector3(12,10,22),t:new THREE.Vector3(4,6,-8)}};
 let selected='A';
 function cameraTo(k){camera.position.copy(presets[k].p);controls.target.copy(presets[k].t);controls.update();document.querySelectorAll('[data-camera]').forEach(b=>b.classList.toggle('active',b.dataset.camera===k))}
 function choose(id){
  selected=id;const b=buildings.get(id),x=b.data.x,z=b.data.z,n='Building '+id;
  document.querySelector('#buildingName').textContent=n;document.querySelector('#viewportBuilding').textContent=n;document.querySelector('#hudBuilding').textContent=n.toUpperCase();
  presets.building.p.set(x+18,15,z+25);presets.building.t.set(x+4.15,6,z-.25);
  presets.front.p.set(x+4.15,12,z+34);presets.front.t.set(x+4.15,6,z-.25);
  buildings.forEach((item,key)=>{item.zone.visible=key===id&&document.querySelector('#liftZoneToggle').checked;liftCarts.get(key).group.visible=key===id;liftCarts.get(key).people.group.visible=key===id;});
  buildings.forEach(item=>item.setCutaway(document.querySelector('#cutawayToggle').checked));
  cameraTo('building');
 }
 select.addEventListener('change',()=>choose(select.value));
 document.querySelectorAll('[data-camera]').forEach(b=>b.addEventListener('click',()=>cameraTo(b.dataset.camera)));
 document.querySelector('#resetView').addEventListener('click',()=>cameraTo('colony'));
 document.querySelector('#labelsToggle').addEventListener('change',e=>buildings.forEach(b=>{const sign=b.group.children.find(o=>o.isMesh&&o.geometry.type==='PlaneGeometry');if(sign)sign.visible=e.target.checked}));
 document.querySelector('#liftZoneToggle').addEventListener('change',e=>{buildings.forEach((b,id)=>b.zone.visible=id===selected&&e.target.checked);});
 document.querySelector('#gridToggle').addEventListener('change',e=>grid.visible=e.target.checked);
 document.querySelector('#cutawayToggle').addEventListener('change',e=>buildings.forEach(b=>b.setCutaway(e.target.checked)));
 document.querySelectorAll('[data-camera]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.camera==='interior')buildings.get(selected).setCutaway(true)}));
 document.querySelector('#loadSelect').addEventListener('change',e=>liftCarts.get(selected).setLoad(e.target.value));
 document.querySelector('#engineeringToggle').addEventListener('change',e=>liftCarts.get(selected).setEngineering(e.target.checked));

 const floorButtons=[...document.querySelectorAll('[data-floor]')];
 let requestedFloor=0;
 floorButtons.forEach(btn=>btn.addEventListener('click',()=>{
  requestedFloor=Number(btn.dataset.floor);
  floorButtons.forEach(b=>b.classList.toggle('active',b===btn));
  document.querySelector('#liftStatus').textContent=`FLOOR ${requestedFloor} SELECTED`;
 }));
 document.querySelector('#moveLift').addEventListener('click',()=>{
  const cart=liftCarts.get(selected);
  if(cart.isMoving())return;
  cart.setFloor(requestedFloor);
  document.querySelector('#liftStatus').textContent=`MOVING TO FLOOR ${requestedFloor}`;
  document.querySelector('#interlockStatus').textContent='LOCKED DURING TRAVEL';
 });

 choose('A');
}
