import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


let renderer, camera, scene;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,0.1,1000);
    camera.position.set(0,1,2)
    scene.add(camera)
    
    const loader = new GLTFLoader();
    
    loader.load( '../3d-model/alfa-romeo-giulettina/source/Giulettina.glb', function ( glb ) {
        console.log(glb);
        const root = glb.scene;
        root.scale.set(0.5,0.5,0.5)
        scene.add(root)
    
    }, undefined, function ( error ) {
    
        console.error( error );
    
    } );
    
    
    
    const light = new THREE.DirectionalLight(0xffffff,1)
    light.position.set(2,2,5)
    scene.add(light)
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.gammaOutput = true;
    document.body.appendChild( renderer.domElement );
    
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.listenToKeyEvents( window ); // optional
    
    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
    
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;
    
    controls.screenSpacePanning = false;
    
    controls.minDistance = 1;
    controls.maxDistance = 10;
    
    controls.maxPolarAngle = Math.PI / 2;

}

function animate(){
    requestAnimationFrame(animate)
    renderer.render(scene,camera)
    
}
init()
animate()