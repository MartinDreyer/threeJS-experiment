import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

let renderer, camera, scene, transformControl, dirLight, clock, spotLight, controls;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.lookAt(0, 10, 0)
    scene.add(camera)

    clock = new THREE.Clock()

    const loader = new GLTFLoader();

    loader.load('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Sponza/glTF/Sponza.gltf', function (glb) {
        console.log(glb);
        const root = glb.scene;
        root.scale.set(0.5, 0.5, 0.5)
        root.children[0].children.forEach(element => {
            element.receiveShadow = true
            element.castShadow = true

        });

        console.log(root.children)
        scene.add(root)

    }, undefined, function (error) {

        console.error(error);

    });

    spotLight = new THREE.SpotLight(0xffffff, 3);
    spotLight.position.set(0, 1, -2);
    spotLight.castShadow = true;
    spotLight.shadow.camera.top = 2;
    spotLight.shadow.camera.bottom = - 2;
    spotLight.shadow.camera.left = - 2;
    spotLight.shadow.camera.right = 2;
    spotLight.shadow.camera.near = 0.1;
    spotLight.shadow.camera.far = 40;
    spotLight.lookAt(new THREE.Vector3(0, 2, 0));
    spotLight.shadow.bias = 0.005
    scene.add(spotLight);


    // const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    // const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    // const cube = new THREE.Mesh( geometry, material );
    // cube.position.set(0,5,0)
    // scene.add( cube );
    // const light = new THREE.DirectionalLight(0xffffff,3)
    // light.position.set(2,2,5)
    // scene.add(light)

    // const light2 = new THREE.DirectionalLight(0xffffff,20)
    // light2.position.set(0,20,0)
    // light2.castShadow = true;
    // light2.receiveShadow = true;

    // light2.lookAt(0,0,0)
    // scene.add(light2)


    dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(-20, 20, -20);
    dirLight.lookAt(0, 0, 0)
    dirLight.castShadow = false;
    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.bottom = - 2;
    dirLight.shadow.camera.left = - 2;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 40;
    scene.add(dirLight);

    const dirLight2 = dirLight.clone()
    dirLight2.position.set(20, 20, 20)
    dirLight2.intensity = 0.8
    scene.add(dirLight2);

    const light = new THREE.AmbientLight(0x404040, 1.5); // soft white light
    scene.add(light);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.gammaOutput = true;
    transformControl = new TransformControls(camera, renderer.domElement);
    // transformControl.attach( cube );
    transformControl.attach(spotLight);
    scene.add(transformControl);
    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.listenToKeyEvents(window); // optional

    controls.target = new THREE.Vector3(0, 0.6, 0)
    camera.position.set(1.3, 0.6, -0.15)


    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

    controls.enableDamping = false; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;

    controls.screenSpacePanning = false;

    controls.minDistance = 1;
    controls.maxDistance = 20;

    // controls.maxPolarAngle = Math.PI / 2;

    transformControl.addEventListener('dragging-changed', function (event) {

        controls.enabled = !event.value;

    });

}

window.onresize = function () {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

};

let reverse = false


function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)

    controls.update()


    if (spotLight.position.x >= 3) {
        reverse = true
    } else if (spotLight.position.x <= -3) {
        reverse = false
    }


    let delta = clock.getDelta();
    let elapsedTime = clock.elapsedTime
    // spotLight.position.x += 0.5 * (reverse ? -1 : 1) * delta
    spotLight.position.x = Math.cos(elapsedTime * 0.5 + Math.PI/2) * 3
    spotLight.position.z = Math.sin(elapsedTime * 0.9  + Math.PI/2) * 0.7 - 0.25

}
init()
animate()