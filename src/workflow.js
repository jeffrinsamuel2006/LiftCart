import * as THREE from 'three';

// The resident leaves the empty trolley outside the apartment. A conceptual
// autonomous-return drive then retraces the delivery route to the lift.
const FLOW = [
  ['READY', 'Worker is ready. Select a destination floor and load type.'],
  ['LOAD', 'Worker places and secures the selected delivery on the trolley.'],
  ['PUSH', 'Worker pushes the trolley from the loading area toward the lift.'],
  ['DOCK', 'Trolley enters the platform and aligns with the wheel stops.'],
  ['LATCH', 'Docking latch engages. The platform is interlocked for travel.'],
  ['ASCEND', 'The loaded platform travels to the selected apartment floor.'],
  ['ARRIVE', 'Platform stops and aligns with the selected landing.'],
  ['UNLATCH', 'Resident releases the trolley from the stationary platform.'],
  ['DELIVER', 'Resident wheels the trolley from the landing to the apartment.'],
  ['UNLOAD / PARK', 'Resident unloads the goods. The delivered cylinder remains inside the apartment; the empty trolley is parked outside the door.'],
  ['AUTO RETURN', 'Return mode activates. The empty trolley retraces its route from the doorway to the lift landing without the resident pushing it. The delivered cylinder stays in the apartment.'],
  ['AUTO DOCK', 'The trolley aligns with the platform wheel stops and the docking latch engages automatically.'],
  ['DESCEND', 'With the trolley secured and the landing clear, the empty platform returns to ground level.'],
  ['COMPLETE', 'The trolley and platform are back at ground level, ready for the next delivery.']
];
const clamp = v => Math.max(0, Math.min(1, v));
const FLOOR_H = 3.15;

export function createWorkflow(initialCart) {
  const $ = id => document.querySelector(id);
  const status = $('#sequenceStatus'), progress = $('#sequenceProgress'), stepLabel = $('#sequenceStep');
  const playBtn = $('#playSequence'), nextBtn = $('#nextStep'), resetBtn = $('#resetSequence');
  let cart = initialCart, worker = cart.people.worker, resident = cart.people.resident;
  let step = 0, playing = false, elapsed = 0, last = 0, raf = 0, destination = 1, entered = false, deliveryLoaded = true;
  let loadType = $('#loadSelect').value;
  const local = (x,y,z) => new THREE.Vector3(x,y,z);
  const shaft = () => cart.shaftLocal;
  const groundLoad = () => local(shaft().x - 2.0, .42, shaft().z + 2.0);
  const platformWorldLocal = floor => local(shaft().x, floor * FLOOR_H + .42, shaft().z);
  const landingLocal = floor => local(shaft().x, floor * FLOOR_H + .42, shaft().z + 1.35);
  // The return point is immediately outside the resident's apartment door.
  const homeLocal = floor => local(shaft().x - 1.65, floor * FLOOR_H + .42, shaft().z + 3.15);
  const workerHome = () => local(shaft().x - 2.4, 0, shaft().z + 2.2);
  const workerNear = () => local(shaft().x - .9, 0, shaft().z + 1.0);
  const residentHome = floor => local(shaft().x - 2.5, floor * FLOOR_H, shaft().z + 3.8);
  const residentLanding = floor => local(shaft().x + 1.0, floor * FLOOR_H, shaft().z + 1.9);
  const platformAt = floor => local(shaft().x, floor * FLOOR_H + .42, shaft().z);

  function setCart(next) {
    playing = false; cancelAnimationFrame(raf); cart = next; deliveryLoaded = true;
    worker = cart.people.worker; resident = cart.people.resident;
    loadType = $('#loadSelect').value; cart.setFloor(0); cart.setLoad(loadType); showStep(0);
  }
  function setStatus(text) { status.textContent = text; }
  function spinTrolleyWheels(amount) {
    cart.trolley.traverse(obj => {
      if (obj.name === 'Rubber wheel') obj.rotation.x += amount;
    });
  }
  function showStep(i) {
    step = Math.max(0, Math.min(FLOW.length - 1, i)); elapsed = 0; entered = false;
    stepLabel.textContent = `${step + 1} / ${FLOW.length} · ${FLOW[step][0]}`;
    setStatus(FLOW[step][1]); progress.style.width = `${step / (FLOW.length - 1) * 100}%`;
    cart.setLoad(deliveryLoaded ? loadType : 'empty');
    resident.group.visible = false;
    if (step <= 2) {
      cart.setFloor(0); cart.detachTrolley(); cart.trolley.position.copy(groundLoad());
      worker.group.position.copy(workerHome());
    }
    if (step === 3) {
      cart.detachTrolley(); cart.trolley.position.copy(platformWorldLocal(0));
      worker.group.position.copy(workerNear());
    }
    if (step >= 4 && step <= 7) {
      cart.dockTrolley(); cart.trolley.position.set(0,.42,0);
      worker.group.position.copy(workerHome());
    }
    if (step === 7) {
      resident.group.visible = true; resident.group.position.copy(residentLanding(destination));
    }
    if (step === 8) {
      cart.detachTrolley(); cart.trolley.position.copy(landingLocal(destination));
      resident.group.visible = true; resident.group.position.copy(residentLanding(destination));
    }
    if (step === 9 || step === 10) {
      cart.detachTrolley(); cart.trolley.position.copy(homeLocal(destination));
      resident.group.visible = true; resident.group.position.copy(residentHome(destination));
    }
    if (step === 11) {
      cart.detachTrolley(); cart.trolley.position.copy(landingLocal(destination));
      resident.group.visible = false;
    }
    if (step === 12 || step === 13) {
      cart.dockTrolley(); cart.trolley.position.set(0,.42,0); resident.group.visible = false;
    }
    if (step === 13) { cart.setFloor(0); worker.group.position.copy(workerHome()); }
    updatePose(0);
  }
  function updatePose(t) {
    const walking = playing && [2, 8].includes(step);
    const swing = walking ? Math.sin(t * 8) * .34 : 0;
    worker.legs.forEach((l,i) => l.rotation.x = (i===0?1:-1) * (step===2?swing:0));
    worker.arms.forEach((a,i) => a.rotation.x = (i===0?-1:1) * (step===1?-.55:step===3||step===4?-.25:swing));
    resident.legs.forEach((l,i) => l.rotation.x = (i===0?1:-1) * (step===8?swing:0));
    resident.arms.forEach(a => a.rotation.x = (step===8||step===9)?-.35:0);
  }
  function enterStep() {
    if (entered) return; entered = true;
    if (step === 5) cart.setFloor(destination);
    if (step === 12) cart.setFloor(0);
    if (step === 4 || step === 11) $('#interlockStatus').textContent = 'LATCHED · TRAVEL ENABLED';
    if (step === 7) $('#interlockStatus').textContent = 'UNLATCHED · PLATFORM STOPPED';
    if (step === 10) {
      $('#interlockStatus').textContent = 'RETURN MODE · PATH CLEAR';
      setStatus('AUTONOMOUS RETURN ACTIVE · Empty trolley is retracing the delivery path.');
    }
    if (step === 9) {
      // Goods are transferred permanently into the resident's apartment.
      // The apartment prop is independent of the trolley and survives reset/replay.
      if (loadType === 'cylinder') cart.showDeliveredCylinder(destination);
      deliveryLoaded = false; cart.setLoad('empty');
      $('#interlockStatus').textContent = 'TROLLEY PARKED · RETURN READY';
    }
    if (step === 12) $('#interlockStatus').textContent = 'LATCHED · RETURN ENABLED';
  }
  const durations = [1, 2.0, 2.8, 1.3, 1.2, 0, 1.0, 1.0, 3.0, 1.7, 3.4, 1.5, 0, 1.2];
  function tick(now) {
    if (!playing) return;
    if (!last) last = now;
    elapsed += Math.min((now-last)/1000, .05); last = now;
    enterStep();
    let u = durations[step] === 0 ? 1 : clamp(elapsed / durations[step]);
    if (step === 2) {
      cart.trolley.position.lerpVectors(groundLoad(), platformWorldLocal(0), u);
      worker.group.position.lerpVectors(workerHome(), workerNear(), u);
      spinTrolleyWheels(.12);
    }
    if (step === 3 && u >= 1) { cart.dockTrolley(); cart.trolley.position.set(0,.42,0); }
    if (step === 5 || step === 12) {
      const target = step === 5 ? destination : 0;
      const state = cart.update(now);
      $('#liftStatus').textContent = state.moving ? `TRAVELLING TO FLOOR ${target}` : `FLOOR ${state.floor} · ALIGNED`;
      $('#interlockStatus').textContent = 'LOCKED DURING TRAVEL';
      if (!state.moving && Math.abs(state.floorExact-target) < .02) u = 1; else u = 0;
    }
    if (step === 7 && u >= 1) { cart.detachTrolley(); cart.trolley.position.copy(landingLocal(destination)); }
    if (step === 8) {
      cart.trolley.position.lerpVectors(landingLocal(destination), homeLocal(destination), u);
      resident.group.position.lerpVectors(residentLanding(destination), residentHome(destination), u);
      spinTrolleyWheels(.12);
    }
    // The resident only parks the trolley at the doorway. The return drive
    // independently retraces the same path, then automatically boards the lift.
    if (step === 10) {
      cart.trolley.position.lerpVectors(homeLocal(destination), landingLocal(destination), u);
      spinTrolleyWheels(.18);
      if (u >= 1) $('#interlockStatus').textContent = 'RETURN COMPLETE · LANDING REACHED';
    }
    if (step === 11) {
      cart.trolley.position.lerpVectors(landingLocal(destination), platformAt(destination), u);
      spinTrolleyWheels(.14);
      if (u >= 1) { cart.dockTrolley(); cart.trolley.position.set(0,.42,0); }
    }
    updatePose(now/1000);
    if (u >= 1) {
      last = 0;
      if (step < FLOW.length-1) {
        showStep(step+1);
        playBtn.textContent = 'Ⅱ Pause';
      } else {
        playing = false;
        playBtn.textContent = '↺ Replay delivery';
        setStatus(FLOW[step][1]);
        $('#liftStatus').textContent = 'GROUND FLOOR · READY';
        $('#interlockStatus').textContent = 'ENGAGED';
      }
    }
    if(playing) raf = requestAnimationFrame(tick);
  }
  function start() {
    if (playing) { playing=false; cancelAnimationFrame(raf); playBtn.textContent='▶ Resume'; last=0; return; }
    if (step===0) {
      destination = Number(document.querySelector('[data-floor].active')?.dataset.floor ?? 1);
      if (destination===0) { setStatus('Select floor 1, 2 or 3 before starting a delivery.'); return; }
      loadType = $('#loadSelect').value; deliveryLoaded = true; cart.setLoad(loadType);
    }
    if (step===13) showStep(0);
    playing=true; playBtn.textContent='Ⅱ Pause'; last=0; raf=requestAnimationFrame(tick);
  }
  playBtn.addEventListener('click', start);
  nextBtn.addEventListener('click', () => { if(!playing) start(); });
  resetBtn.addEventListener('click', () => {
    playing=false; cancelAnimationFrame(raf); playBtn.textContent='▶ Start delivery';
    loadType=$('#loadSelect').value; deliveryLoaded=true; cart.setLoad(loadType); cart.setFloor(0); showStep(0);
    $('#liftStatus').textContent='GROUND FLOOR · READY'; $('#interlockStatus').textContent='ENGAGED';
  });
  $('#loadSelect').addEventListener('change', e => { loadType=e.target.value; if(step<2) cart.setLoad(loadType); });
  showStep(0);
  return { setCart, isSequenceActive:()=>playing || (step>0 && step<13), reset(){playing=false;cancelAnimationFrame(raf);deliveryLoaded=true;cart.setFloor(0);showStep(0);} };
}
