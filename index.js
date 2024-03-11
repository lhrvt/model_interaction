import * as THREE from './build/three.module.js'
import {GLTFLoader} from './build/GLTFLoader.js'


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
    const color = new THREE.Color(Math.random(), Math.random(), Math.random()); //RANDOMN COLOR
    selectedObject.material.color = color;
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
    root.position.set(0,0,0)
    root.rotation.y = -Math.PI / 2;
    scene.add(root);
 
 }, function(xhr){
    console.log(xhr.loaded/xhr.total * 100 + "% loaded")
}, function(error){
     console.log('An error')
 })

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(2,2,5)
scene.add(light)


const geometry = new THREE.BoxGeometry(1,1,1)
const material = new THREE.MeshBasicMaterial({

    color: 'purple'
})
const boxMesh = new THREE.Mesh(geometry, material)

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
renderer.gammaOutput= true




function animate(){
    requestAnimationFrame(animate)

    if (root){
    //const time = Date.now() * 0.001;
    //root.rotation.y = time;
    
    renderer.render(scene,camera)
    
    }
}




animate()


