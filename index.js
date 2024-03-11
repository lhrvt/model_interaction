import * as THREE from './build/three.module.js'
import {GLTFLoader} from './build/GLTFLoader.js'

const Btn_Vert = document.getElementById('btn_vert');
const Btn_Jaune = document.getElementById('btn_jaune');
const Btn_Bleu = document.getElementById('btn_bleu');
let actual_color;

Btn_Jaune.addEventListener('click', function(event) {
  actual_color = 'yellow'
  boxMesh.material.color.set(actual_color)
});
Btn_Vert.addEventListener('click', function(event) {
  actual_color = 'green'
  boxMesh.material.color.set(actual_color)
});
Btn_Bleu.addEventListener('click', function(event) {
  actual_color = 'blue'
  boxMesh.material.color.set(actual_color)
});

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
    const selectedObject = intersections[0].object;
    
    selectedObject.material.color.set(actual_color)
    console.log(selectedObject.name + "was clicked!");
  }

}

const canvas  = document.querySelector('.webgl')
const scene = new THREE.Scene()

 const loader = new GLTFLoader()
 let root;

 loader.load('asset/cuisinne_urp.glb', function(glb){
    console.log(glb)
    root = glb.scene;
    root.position.set(-0.2,0,2)
    root.rotation.y = -Math.PI / 2;
    scene.add(root);
 
 }, function(xhr){
    console.log(xhr.loaded/xhr.total * 100 + "% loaded")
}, function(error){
     console.log('An error')
 })

const light = new THREE.DirectionalLight(0xffffff, 1)

light.intensity = 1;

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);   
scene.add(light) 


const geometry = new THREE.SphereGeometry(0.4,16,16)
const material = new THREE.MeshToonMaterial({

    color: 'purple'
})
const boxMesh = new THREE.Mesh(geometry, material)
boxMesh.position.set(-0.7,2.5,1)
boxMesh.scale.set(0.5,0.5,0.5)
scene.add(boxMesh)




const sizes = {
    width : window.innerWidth,
    height : window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1, 100);
camera.position.set(0,1,4);
scene.add(camera)


const renderer = new THREE.WebGLRenderer({
    canvas : canvas
})


renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 
renderer.gammaOutput= true


function animate(){
    requestAnimationFrame(animate)

    if (root){
    const time = Date.now() * 0.001;
    const time_light = time * 50;
    boxMesh.rotation.y = time;
    light.position.set(Math.sin(time),1,1)
    light.rotation.y = time;
    //console.log(light.position)
    
    renderer.render(scene,camera)
    
    }
}





animate()


