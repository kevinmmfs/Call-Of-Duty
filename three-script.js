import * as THREE from "https://cdn.skypack.dev/three@0.117.1";
import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.117.1/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js";

let camera, renderer, scene, controls;
let mixers = [];
let skeleton;
let spotLight;

let start, end;
start = Date.now();

let clock = new THREE.Clock();

const mouse = {
  x: 0,
  y: 0
}

addEventListener('mousemove', (event)=>{
    mouse.x = (event.clientX / innerWidth)*2 -1;
    mouse.y = 1 -2*(event.clientY / innerHeight);

})

init();
animate();

function init() {
    //SCENE
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x6fb6f6 , 200, 550 );
    scene.background = new THREE.Color( 0x6fb6f6 );

  
    //CAMERA
    camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
    camera.position.set(0, 60, 60);
    camera.lookAt(1, 1, 1);
  
    //Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.alpha = true;
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    let elem = document.getElementById('fundo');

    elem.appendChild(renderer.domElement);

    	
	  let loadingmanager = new THREE.LoadingManager( () => {
		const loadingScreen = document.getElementById( 'loading-screen' );
		loadingScreen.classList.add( 'fade-out' );

		// optional: remove loader from DOM via event listener
		loadingScreen.addEventListener( 'transitionend', onTransitionEnd );
		
  	} );
    loadingmanager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
      console.log( 'Loaded: ' + (itemsLoaded / itemsTotal * 100) + '%');
    
    };

    controls = addControls();
    controls.update()
    //addFBXObject('./models/rifle-animation.fbx',0.2,new THREE.Vector3(0,0,0),loadingmanager,new THREE.Vector3(0,0,0))
    addFBXObject('./models/Coyote-Walking.fbx',0.3,new THREE.Vector3(10,0,10),loadingmanager,new THREE.Vector3(0,-Math.PI/2,0))
    //addGLBObject('models/COD-soldier.glb',loadingmanager)
    addGLBObject("./models/robber.glb",loadingmanager,4,0)


    addFloor();
    addStreet()
    addLights();

  }
  
  function addLights() {
    //LIGHT
    const hemiLight = new THREE.HemisphereLight( 0xffeeb1, 0x080820,);
		hemiLight.position.set( 0, 1000, 0 );
		scene.add( hemiLight );

    spotLight = new THREE.SpotLight(0xffffff,1.2);
    spotLight.position.set(
      100,100,100
     )
    spotLight.castShadow = true;
    spotLight.penumbra = 0.5;
    spotLight.shadow.mapSize.width = 4*1024;
    spotLight.shadow.mapSize.height = 4*1024;
    spotLight.decay = 2;
    scene.add(spotLight)
  }
  
  function addControls() {
    let controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener("change", render);
    controls.minDistance = 20;
    controls.maxDistance = 80;
    controls.maxPolarAngle = 3/4*Math.PI / 2
    controls.minAzimuthAngle = [0, Math.PI / 4];
    controls.enableDamping = true;
    return controls;
  }

  function addFloor(loadingmanager){

    const textureLoader = new THREE.TextureLoader();
    const BaseColor = textureLoader.load('texture/Ground_Dirt_009_BaseColor.jpg')
    const NormalMap = textureLoader.load('texture/Ground_Dirt_009_Normal.jpg')
    const HeightMap = textureLoader.load('texture/Ground_Dirt_009_Height.png')
    const RoughnessMap = textureLoader.load('texture/Ground_Dirt_009_Roughness.jpg')

    const textures = [BaseColor,NormalMap,HeightMap,RoughnessMap];

    textures.forEach(texture => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set( 20, 20 );
    })

    const groundmaterial = new THREE.MeshStandardMaterial(
      {
        map: textures[0],
        normalMap: textures[1],
        displacementMap: textures[2],
        displacementScale: 0.05,
        roughnessMap: textures[3],
        roughness: 0.5,
        emissive: 0xffa95c,
        emissiveIntensity: 0.15

      }
    )
    const plane = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000, 500, 500 ), groundmaterial );

    plane.rotation.x = - Math.PI / 2;
    plane.rotation.z = - Math.PI / 8;
    plane.receiveShadow = true;
    scene.add( plane );
  }

  function addStreet(){
    const textureLoader = new THREE.TextureLoader();
    const BaseColor = textureLoader.load('texture/Road_001_basecolor.jpg')
    const NormalMap = textureLoader.load('texture/Road_001_normal.jpg')
    const HeightMap = textureLoader.load('texture/Road_001_height.png')
    const RoughnessMap = textureLoader.load('texture/Road_001_roughness.jpg')

    const textures = [BaseColor,NormalMap,HeightMap,RoughnessMap];

    textures.forEach(texture => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set( 1, 20 );
    })

    const groundmaterial = new THREE.MeshStandardMaterial(
      {
        map: textures[0],
        normalMap: textures[1],
        displacementMap: textures[2],
        displacementScale: 0.01,
        roughnessMap: textures[3],
        roughness: 0.5,

      }
    )
    const plane = new THREE.Mesh( new THREE.PlaneGeometry( 200, 2000, 500, 500 ), groundmaterial );

    plane.rotation.x = - Math.PI / 2;
    plane.rotation.z = - Math.PI / 8;
    plane.position.y+=0.1;
    plane.receiveShadow = true;
    scene.add( plane );

  }


  function addFBXObject(url,scale,position,manager,rotation){
    const loader = new FBXLoader(manager);
				loader.load( url, function ( object ) {

          if (object.animations.length>0){
            let mixer = new THREE.AnimationMixer( object );
            mixer.clipAction( object.animations[0]).play();
            mixers.push(mixer)
          }
          
					object.traverse( function ( child ) {

						if ( child.isMesh ) {
							child.castShadow = true;
							child.receiveShadow = true;
              if(child.material.map) child.material.map.anisotropy = 4;
						}

					} );
          object.castShadow = true;

          object.position.x = position.x;
          object.position.y = position.y;
          object.position.z = position.z;

          object.rotation.x += rotation.x
          object.rotation.y += rotation.y
          object.rotation.z += rotation.z 
  
          skeleton = new THREE.SkeletonHelper(object);
					skeleton.visible = false;
					scene.add( skeleton );
          object.scale.set(scale,scale,scale)
					scene.add( object );
				} );
  }

  function addGLBObject(url,manager,scale,rotation_y){
    var loader = new GLTFLoader(manager);
    loader.load(
      url, function(gltf) {
  
         gltf.scene.traverse( function( node ) {
            if ( node instanceof THREE.Mesh ) { 
              node.castShadow = true; 
              node.material.side = THREE.DoubleSide;
            }
          });
  
        let model = gltf.scene;

        model.scale.set(scale,scale,scale);
        model.rotation.y += rotation_y;
        //model.rotation.x += Math.PI/2;
        scene.add(model);

  
        if (gltf.animations.length>0){
          let mixer = new THREE.AnimationMixer(gltf.scene);
          mixer.clipAction(gltf.animations[1]).play();
          mixers.push(mixer)
        }
  
   
    });
  }
  
window.addEventListener("resize", onWindowResize);

function onTransitionEnd( event ) {
	event.target.remove();
	end = Date.now();
  console.log(`Execution time: ${end - start} ms`);
}

window.addEventListener('dblclick',()=>{
  const fullscreenElement = document.fullscreenEelement || document.webkitFullscreenElement;
  if(!fullscreenElement){
    document.body.requestFullscreen();
  } else {
    document.exitFullscreen();
  }

})

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));

  render();
}
function render() {
  renderer.render(scene, camera);  
}


function animate() {
    requestAnimationFrame(animate);
    var delta = clock.getDelta();
    //camera.position.set(3*mouse.x,50+3*mouse.y,50)
    /*mixers.forEach (mixer =>{
      if (mixer) mixer.update(delta);
    })*/
   
    controls.update()
    render();
  }
  
  
