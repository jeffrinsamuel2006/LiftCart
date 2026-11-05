import * as THREE from 'three';
import { createPeople } from './people.js';

const material=(color,metalness=0.15,roughness=0.55)=>new THREE.MeshStandardMaterial({color,metalness,roughness});
function box(parent,name,x,y,z,sx,sy,sz,mat){
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),mat);
  mesh.name=name; mesh.position.set(x,y,z); mesh.castShadow=true; mesh.receiveShadow=true; parent.add(mesh); return mesh;
}
function cylinder(parent,name,x,y,z,r1,r2,h,mat,segments=24,rotationZ=0){
  const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,segments),mat);
  mesh.name=name; mesh.position.set(x,y,z); mesh.rotation.z=rotationZ; mesh.castShadow=true; mesh.receiveShadow=true; parent.add(mesh); return mesh;
}
function line(parent,a,b,r,mat){
  const d=new THREE.Vector3().subVectors(b,a), mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,d.length(),10),mat);
  mesh.position.copy(a).add(b).multiplyScalar(.5); mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize()); mesh.castShadow=true; parent.add(mesh); return mesh;
}
function makeTrolley(parent){
  const trolley=new THREE.Group(); trolley.name='Detachable multipurpose trolley'; parent.add(trolley);
  // Compact trolley proportions: scaled consistently around its wheelbase.
  trolley.scale.setScalar(.72);
  const steel=material('#526c7b',.65,.38), dark=material('#1c2933',.2,.45), rubber=material('#111820',.05,.85);
  // Base frame and upright handles
  box(trolley,'Trolley base',0,.23,0,1.18,.12,1.12,steel);
  for(const x of [-.49,.49]){
    box(trolley,'Side frame',x,.82,-.43,.09,1.12,.09,steel);
    line(trolley,new THREE.Vector3(x,.3,.43),new THREE.Vector3(x,1.42,-.43),.045,steel);
    for(const z of [-.38,.4]){
      cylinder(trolley,'Wheel axle',x,.18,z,.045,.045,.14,dark,16,Math.PI/2);
      cylinder(trolley,'Rubber wheel',x,.18,z,.19,.19,.12,rubber,24,Math.PI/2);
      // Visible hub caps indicate the conceptual powered-wheel return drive.
      const hubX = x + (x > 0 ? .085 : -.085);
      cylinder(trolley,'Autonomous return drive hub',hubX,.18,z,.105,.105,.045,material('#72bda4',.55,.32),20,Math.PI/2);
    }
  }
  box(trolley,'Push handle',0,1.42,-.43,1.08,.09,.09,steel);
  box(trolley,'Front retaining rail',0,.68,.52,1.05,.09,.08,steel);
  // Load holder / cylinder support
  const cylinderHolder=new THREE.Group(); cylinderHolder.name='Dummy LPG cylinder holder'; trolley.add(cylinderHolder);
  box(cylinderHolder,'Cylinder foot ring',0,.34,.02,.72,.08,.72,material('#344c58'));
  cylinder(cylinderHolder,'Dummy LPG cylinder',0,.88,.02,.27,.27,.98,material('#c9d0c8',.15,.42),32);
  cylinder(cylinderHolder,'Cylinder shoulder',0,1.39,.02,.18,.27,.18,material('#c9d0c8'),32);
  cylinder(cylinderHolder,'Valve guard',0,1.51,.02,.105,.105,.08,material('#65747a'),20);
  box(cylinderHolder,'Cylinder strap',0,.91,.31,.58,.055,.055,material('#d2a64e',.45,.4));
  // Grocery tray alternative
  const grocery=new THREE.Group(); grocery.name='Removable grocery tray'; trolley.add(grocery);
  box(grocery,'Tray base',0,.58,.02,.94,.12,.88,material('#d5a85d',.15,.55));
  for(const x of [-.47,.47])box(grocery,'Tray side',x,.84,.02,.07,.48,.9,material('#c38d4b'));
  for(const z of [-.42,.46])box(grocery,'Tray end',0,.84,z,.94,.48,.07,material('#c38d4b'));
  // A few simple grocery packages
  box(grocery,'Grocery carton',-.19,.91,-.1,.32,.55,.32,material('#d8c39a'));
  box(grocery,'Produce box',.2,.79,.16,.32,.3,.32,material('#6b9a70'));
  grocery.visible=false;
  return {group:trolley,cylinderHolder,grocery};
}
export function createLiftCart(building){
  const assembly=new THREE.Group(); assembly.name='Compact vertical conveyor assembly';
  const shaftX=building.shaftLocal.x, shaftZ=building.shaftLocal.z, height=12.45;
  assembly.position.set(shaftX,0,shaftZ);
  building.group.add(assembly);

  const steel=material('#405c6b',.72,.34), bright=material('#8fa6b2',.72,.28);
  const dark=material('#263640',.65,.42), beltMat=material('#263b43',.35,.72);
  const rollerMat=material('#8fa6b2',.72,.3), amber=material('#e1b75b',.35,.4);
  const floorHeight=3.15;

  // Twin compact chain-belt tracks form a continuous vertical conveyor loop.
  // The small carrier cradle is linked to both tracks and keeps the trolley level.
  const trackX=[-.69,.69], trackZ=0, trackParts=[];
  for(const x of trackX){
    box(assembly,'Vertical conveyor side frame',x,height/2,trackZ,.105,height,.22,steel);
    box(assembly,'Moving chain belt',x,height/2,trackZ,.045,height-.55,.12,beltMat);
    const top=cylinder(assembly,'Upper conveyor sprocket',x,height-.25,trackZ,.23,.23,.25,bright,24,Math.PI/2);
    const bottom=cylinder(assembly,'Lower conveyor sprocket',x,.25,trackZ,.23,.23,.25,bright,24,Math.PI/2);
    trackParts.push({top,bottom});
    // Small repeated chain links on the visible front face.
    for(let y=.55;y<height-.45;y+=.34){
      const link=box(assembly,'Conveyor chain link',x,y,trackZ+.125,.075,.16,.045,amber);
      trackParts.push({link});
    }
  }
  // Cross rollers make the vertical conveyor read as a compact roller/chain system.
  const rollers=[];
  for(let y=.62;y<height-.35;y+=.58){
    const roller=cylinder(assembly,'Conveyor cross roller',0,y,.02,.075,.075,1.25,rollerMat,16,Math.PI/2);
    rollers.push(roller);
  }
  // Motor and drive shaft are compactly mounted above the conveyor loop.
  box(assembly,'Compact conveyor motor',.92,height-.18,-.08,.42,.42,.48,steel);
  cylinder(assembly,'Conveyor drive shaft',0,height-.25,0,.105,.105,1.55,dark,20,Math.PI/2);
  box(assembly,'Conveyor top guard',0,height+.02,0,1.72,.12,.42,steel);
  box(assembly,'Conveyor lower guard',0,.02,0,1.72,.12,.42,steel);

  // Moving carrier cradle: small enough for the reduced trolley, level throughout travel.
  const platform=new THREE.Group(); platform.name='Moving conveyor carrier cradle'; assembly.add(platform);
  box(platform,'Compact carrier deck',0,.16,0,1.42,.12,1.48,bright);
  for(const x of [-.62,.62]){
    box(platform,'Carrier side guide',x,.28,0,.07,.22,1.36,steel);
    box(platform,'Carrier chain coupling',x,.18,0,.16,.28,.22,amber);
  }
  for(const z of [-.63,.63])box(platform,'Carrier end stop',0,.29,z,1.22,.18,.07,steel);
  // Short roller bed on the carrier helps communicate the conveyor transfer.
  for(let z=-.42;z<=.43;z+=.28){
    cylinder(platform,'Carrier transfer roller',0,.235,z,.045,.045,1.18,rollerMat,14,Math.PI/2);
  }
  for(const x of [-.48,.48]){
    box(platform,'Trolley wheel guide',x,.34,0,.055,.12,1.08,amber);
  }
  const latch=new THREE.Group(); latch.name='Trolley docking latch'; platform.add(latch);
  box(latch,'Latch base',0,.38,-.56,.3,.08,.13,steel);
  box(latch,'Latch hook',0,.49,-.51,.09,.16,.09,amber);

  const trolley=makeTrolley(platform);
  trolley.group.position.set(0,.31,0);
  // Compact labels remain hidden unless engineering view is enabled.
  function label(text,x,y,z){
    const canvas=document.createElement('canvas');canvas.width=512;canvas.height=96;
    const ctx=canvas.getContext('2d');ctx.fillStyle='#102638';ctx.fillRect(0,0,512,96);
    ctx.fillStyle='#8cf0c8';ctx.font='bold 34px Arial';ctx.fillText(text,18,62);
    const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(canvas),transparent:true,depthTest:false}));
    sprite.position.set(x,y,z);sprite.scale.set(2.7,.5,1);assembly.add(sprite);return sprite;
  }
  const labels=[
    label('VERTICAL CHAIN TRACKS',-1.25,6.3,.3),
    label('COMPACT DRIVE MOTOR',1.35,height-.1,0),
    label('ROLLER TRANSFER BED',0,1.05,1.3),
    label('DETACHABLE MINI TROLLEY',0,2.0,-1.15)
  ];
  labels.forEach(o=>o.visible=false);

  const people=createPeople(building);
  const lamp=new THREE.Mesh(new THREE.SphereGeometry(.07,14,10),new THREE.MeshStandardMaterial({color:'#75dfb6',emissive:'#2c8b69',emissiveIntensity:.7}));
  lamp.position.set(.58,.43,.58);platform.add(lamp);
  let currentFloor=0,targetFloor=0,moving=false,moveStart=0,moveFrom=0,moveDuration=3.8;
  const landingDoors=building.landingDoors||[];
  function setLandingDoorState(floor,open){
    landingDoors.forEach((door,i)=>{
      const left=door.children.find(o=>o.name==='Left sliding landing door');
      const right=door.children.find(o=>o.name==='Right sliding landing door');
      const active=i===floor&&open;
      if(left)left.position.x=active?-.56:-.27;
      if(right)right.position.x=active?.56:.27;
    });
  }
  function setFloor(floor){
    targetFloor=Math.max(0,Math.min(3,Number(floor)||0));
    moveFrom=currentFloor;moveStart=performance.now();moving=Math.abs(targetFloor-currentFloor)>.001;
    landingDoors.forEach((_,i)=>setLandingDoorState(i,false));
    if(!moving){platform.position.y=targetFloor*floorHeight;setLandingDoorState(targetFloor,true);return;}
  }
  function update(now){
    if(moving){
      const t=Math.min(1,(now-moveStart)/(moveDuration*1000));
      const eased=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
      currentFloor=moveFrom+(targetFloor-moveFrom)*eased;
      platform.position.y=currentFloor*floorHeight;
      // Rotate the conveyor rollers and sprockets while the carrier moves.
      rollers.forEach((roller,i)=>{roller.rotation.x+=.13+(i%3)*.01;});
      trackParts.forEach((part,i)=>{
        if(part.top)part.top.rotation.z+=.11;
        if(part.bottom)part.bottom.rotation.z+=.11;
        if(part.link)part.link.position.y+=0; // links stay distributed along the visible loop
      });
      if(t>=1){currentFloor=targetFloor;moving=false;setLandingDoorState(targetFloor,true);}
    }
    return {floor:Math.round(currentFloor),floorExact:currentFloor,moving,targetFloor};
  }
  return {
    group:assembly,platform,trolley:trolley.group,cylinderHolder:trolley.cylinderHolder,people,
    grocery:trolley.grocery,labels,
    setLoad(type){trolley.cylinderHolder.visible=type==='cylinder';trolley.grocery.visible=type==='groceries';},
    showDeliveredCylinder(floor){(building.deliveredCylinder||[]).forEach((prop,i)=>{if(i===Number(floor))prop.visible=true;});},
    getDeliveredCylinder(floor){return (building.deliveredCylinder||[])[Number(floor)]||null;},
    setEngineering(show){labels.forEach(o=>o.visible=show);},
    detachTrolley(){building.group.attach(trolley.group);},
    dockTrolley(){platform.attach(trolley.group);trolley.group.position.set(0,.31,0);},
    buildingGroup:building.group,shaftLocal:{x:shaftX,z:shaftZ},
    setFloor,update,getFloor:()=>Math.round(currentFloor),getExactFloor:()=>currentFloor,isMoving:()=>moving
  };
}
