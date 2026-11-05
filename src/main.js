import { createWorld } from './world.js';
import { createColony } from './environment.js';
import { createBuildings } from './buildings.js';
import { createLiftCart } from './liftcart.js';
import { bindControls } from './controls.js';
import { createWorkflow } from './workflow.js';

const container=document.querySelector('#scene-container');
const world=createWorld(container);
createColony(world.scene);
const buildings=createBuildings(world.scene);
const liftCarts=new Map();
buildings.forEach((building,id)=>liftCarts.set(id,createLiftCart(building)));
bindControls({...world,buildings,liftCarts});
const workflow=createWorkflow(liftCarts.get('A'));
document.querySelector('#buildingSelect').addEventListener('change',e=>{
  workflow.setCart(liftCarts.get(e.target.value));
});

function frame(now=performance.now()){
  requestAnimationFrame(frame);
  world.controls.update();
  const cart=liftCarts.get(document.querySelector('#buildingSelect').value);
  const state=cart.update(now);
  const floorName=state.floor===0?'GROUND':`FLOOR ${state.floor}`;
  document.querySelector('#hudFloor').textContent=floorName;
  if(!state.moving && !workflow.isSequenceActive()){
    document.querySelector('#liftStatus').textContent=`${floorName} · READY`;
    document.querySelector('#interlockStatus').textContent='ENGAGED';
  }
  world.renderer.render(world.scene,world.camera);
}
requestAnimationFrame(frame);
window.addEventListener('resize',world.resize);
