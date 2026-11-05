import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
export function createWorld(container){
 const scene=new THREE.Scene();scene.background=new THREE.Color('#b9cbd6');scene.fog=new THREE.Fog('#b9cbd6',65,150);
 const camera=new THREE.PerspectiveCamera(42,1,.1,250);camera.position.set(34,27,39);
 const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;container.appendChild(renderer.domElement);
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.06;controls.maxPolarAngle=Math.PI*.48;controls.minDistance=12;controls.maxDistance=95;controls.target.set(0,4,0);
 scene.add(new THREE.HemisphereLight(0xe9f5ff,0x71806f,2));const sun=new THREE.DirectionalLight(0xfff1dc,3);sun.position.set(-25,45,25);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-55;sun.shadow.camera.right=55;sun.shadow.camera.top=55;sun.shadow.camera.bottom=-55;scene.add(sun);
 const ground=new THREE.Mesh(new THREE.PlaneGeometry(180,180),new THREE.MeshStandardMaterial({color:'#81988a',roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-.08;ground.receiveShadow=true;scene.add(ground);
 function resize(){const w=container.clientWidth||1,h=container.clientHeight||1;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h)}
 resize();return{scene,camera,renderer,controls,resize};
}