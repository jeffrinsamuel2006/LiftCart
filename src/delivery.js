import * as THREE from 'three';
const STEPS=[
 ['READY','Worker is ready to receive the delivery'],
 ['LOAD','Worker secures the selected load on the trolley'],
 ['PUSH','Worker pushes the trolley toward the LiftCart platform'],
 ['DOCK','Trolley is positioned against the wheel stops and latch'],
 ['HANDOFF','Worker steps away; resident is shown at the selected floor'],
 ['RECEIVE','Resident collects the trolley at the destination'],
 ['UNLOAD','Resident unloads the delivery and prepares the empty trolley']
];
export function createDeliverySequence(cart){
 const worker=cart.people.worker,resident=cart.people.resident;
 const start=new THREE.Vector3(5.6,0,7.2),near=new THREE.Vector3(7.15,0,5.9),platformPos=new THREE.Vector3(0,.42,0);
 let step=0,playing=false,elapsed=0,last=0,raf=0;
 const status=document.querySelector('#sequenceStatus'),progress=document.querySelector('#sequenceProgress'),stepLabel=document.querySelector('#sequenceStep');
 const playBtn=document.querySelector('#playSequence'),nextBtn=document.querySelector('#nextStep');
 const clamp=(v)=>Math.max(0,Math.min(1,v));
 function setStep(i){
  step=Math.max(0,Math.min(STEPS.length-1,i));elapsed=0;
  stepLabel.textContent=`${step+1} / ${STEPS.length} · ${STEPS[step][0]}`;
  status.textContent=STEPS[step][1];progress.style.width=`${step/(STEPS.length-1)*100}%`;
  if(step===0){worker.group.position.copy(start);cart.trolley.position.set(-1.45,.42,0);cart.trolley.visible=true;resident.group.visible=false}
  if(step===1){worker.group.position.copy(start);cart.trolley.position.set(-1.45,.42,0);resident.group.visible=false}
  if(step===2){worker.group.position.copy(start);cart.trolley.position.set(-1.45,.42,0);resident.group.visible=false}
  if(step===3){worker.group.position.copy(near);cart.trolley.position.copy(platformPos);resident.group.visible=false}
  if(step>=4){worker.group.position.copy(start);resident.group.visible=true}
  if(step===5||step===6){resident.group.position.set(9.9,3.25,5.7)}
  updatePose(0);
 }
 function updatePose(t){
  const walking=(step===2||step===4||step===5)&&playing;
  const swing=walking?Math.sin(t*9)*.42:0;
  worker.legs.forEach((l,i)=>l.rotation.x=(i===0?1:-1)*swing);
  worker.arms.forEach((a,i)=>a.rotation.x=(i===0?-1:1)*swing);
  if(step===1){worker.arms.forEach(a=>a.rotation.x=-.65)}
  if(step===3){worker.arms.forEach(a=>a.rotation.x=-.35)}
  if(step===6){resident.arms.forEach(a=>a.rotation.x=-.45)}
 }
 function tick(now){
  if(!playing)return;
  if(!last)last=now;const dt=Math.min((now-last)/1000,.05);last=now;elapsed+=dt;
  const duration=step===0?1.2:2.5,u=clamp(elapsed/duration);
  if(step===2){worker.group.position.lerpVectors(start,near,u);cart.trolley.position.lerpVectors(new THREE.Vector3(-1.45,.42,0),platformPos,u)}
  if(step===4){worker.group.position.lerpVectors(near,start,u);resident.group.visible=true}
  if(step===5){resident.group.position.x=9.9-(.8*u)}
  updatePose(now/1000);
  if(u>=1){playing=false;playBtn.textContent='▶ Play sequence';last=0;if(step<STEPS.length-1)setStep(step+1);else status.textContent='Delivery sequence complete. The trolley is ready for the return workflow in the next phase.'}
  raf=requestAnimationFrame(tick);
 }
 function play(){if(playing){playing=false;cancelAnimationFrame(raf);playBtn.textContent='▶ Resume';last=0;return}
  if(step===STEPS.length-1){setStep(0)}
  playing=true;playBtn.textContent='Ⅱ Pause';last=0;raf=requestAnimationFrame(tick)}
 playBtn.addEventListener('click',play);
 nextBtn.addEventListener('click',()=>{playing=false;cancelAnimationFrame(raf);playBtn.textContent='▶ Play sequence';setStep(step+1)});
 document.querySelector('#resetSequence').addEventListener('click',()=>{playing=false;cancelAnimationFrame(raf);playBtn.textContent='▶ Play sequence';setStep(0)});
 setStep(0);
 return {reset:()=>setStep(0)};
}
