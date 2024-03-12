import * as THREE from './build/three.module.js'
import {GLTFLoader} from './build/GLTFLoader.js'


let actual_color;
var color_change = false;

const jaune_pale = new THREE.Color(0xf5c722);
const vert = new THREE.Color(0x6be03d);
const bleu = new THREE.Color(0x6078e0);




let mixer  ;     
let placard  ;    
let frigo  ;    
let congelo  ; 
let plante  ;

function playanimation(obj){

  if (animation_chargee.includes(obj)) {
    console.log(obj + " est dans le tableau.");
    mixer.stopAllAction()
      if(obj.startsWith("CLI_placard"))
      {
        mixer.clipAction(placard).play()
      }
      if(obj.startsWith("CLI_plante"))
      {
        mixer.clipAction(plante).play()
      }
      if(obj.startsWith("CLI_frigo"))
      {
        mixer.clipAction(frigo).play()
      }
      if(obj.startsWith("CLI_congelo"))
      {
        mixer.clipAction(congelo).play()
      }
  } 
  else {
    console.log(obj + " NOPE");
}

}
const raycaster = new THREE.Raycaster();
document.addEventListener('mousedown', onMouseDown);

function onMouseDown(event) {
    const coords = new THREE.Vector2(
      (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
      -((event.clientY / renderer.domElement.clientHeight) * 2 - 1),
    );


raycaster.setFromCamera(coords, camera);

  const intersections = raycaster.intersectObjects(scene.children, true);
  if (intersections.length > 0) {
    console.log(color_change)
    const selectedObject = intersections[0].object;
    if(color_change == true){
    selectedObject.material.color.set(actual_color )
    }
    //console.log(selectedObject.name + "was clicked!");
    playanimation(selectedObject.name)
    console.log(selectedObject)
  }

}

const canvas  = document.querySelector('.webgl')
const scene = new THREE.Scene()


 const loader = new GLTFLoader()

 let root;
 let TEXT;
 const toonmat = new THREE.MeshToonMaterial({

  color: 'white-smoke'
})
const animation_chargee = []
animation_chargee.push("CLI_placard", "CLI_frigo", "CLI_congelo","CLI_plante")
 loader.load('asset/cuisinne_urp.glb', function(gltf ){
    console.log(gltf )
    
    
    mixer = new THREE.AnimationMixer( gltf.scene );

    frigo = gltf.animations[0] ; // first animation
    congelo   = gltf.animations[1] ; // second animation
    placard   = gltf.animations[2] ; 
    plante   = gltf.animations[3] ;// second animation

    
    //mixer.clipAction(placard).play()
    TEXT = gltf.scene.getObjectByName('Text_rm');
    
    TEXT.material = toonmat
    TEXT.material.wireframe = true
    root = gltf .scene;
    root.position.set(-0.2,0,2)
    root.rotation.y = -Math.PI / 2

    scene.add(root);
    
 }, function(xhr){
    console.log(xhr.loaded/xhr.total * 100 + "% loaded")
  }, function(error){
     console.log('An error')
 } 
 );
 




const light = new THREE.DirectionalLight(0xffffff, 1)

light.intensity = 1;

const ambientLight = new THREE.AmbientLight(0xfffffff);
scene.add(ambientLight);   
scene.add(light) 


const geometry = new THREE.SphereGeometry(0.4,16,16)
const material = new THREE.MeshToonMaterial({

    color: 'white'
})
const boxMesh = new THREE.Mesh(geometry, toonmat)
boxMesh.position.set(-0.7,2.5,1)
boxMesh.scale.set(0.5,0.5,0.5)
scene.add(boxMesh)




const sizes = {
    width : window.innerWidth,
    height : window.innerHeight 
}

const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1, 100);
camera.position.set(0,0.7,4);
scene.add(camera)

const renderer = new THREE.WebGLRenderer({
    canvas : canvas 
})


renderer.setSize(sizes.width , sizes.height )


renderer.setPixelRatio(window.devicePixelRatio)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 
renderer.gammaOutput= true

var clock = new THREE.Clock();
function animate(){
    requestAnimationFrame(animate)

    if (root){
    const time = Date.now() * 0.001;
    const time_light = Math.sin(0.5 * time * 5)
    boxMesh.rotation.y = time;
    light.position.set(Math.sin(time),1,1)
    light.rotation.y = time;
    root.position.set(Math.sin(time ) *0.1 - 0.2, -0.4, 2)
    //console.log(time_light)
    TEXT.scale.y= Math.cos(time );
    renderer.render(scene,camera)
    
    
    mixer.update(0.01 );
    }
}


animate()


