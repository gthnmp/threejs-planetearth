import * as THREE from 'three'
import gsap from 'gsap'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import atmosphereVertex from './shaders/atmosphereVertex.glsl';
import atmosphereFragment from './shaders/atmosphereFragment.glsl';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import earthTexture from './assets/earth.jpg'

const renderer = new THREE.WebGLRenderer({ antialias : true })
renderer.setSize(window.innerWidth, window.innerHeight)
Object.assign(renderer.domElement.style, {
  position : 'fixed',
  top: 0,
  left: 0,
})
document.body.appendChild(renderer.domElement)
const planet = new THREE.Group();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 40;

const earth = new THREE.Mesh(
  new THREE.SphereGeometry( 15, 64, 32 ), 
  new THREE.ShaderMaterial({ 
    vertexShader,
    fragmentShader,
    uniforms : {
      earthTexture : {
        value : new THREE.TextureLoader().load(earthTexture)
      }
    }
  }))
planet.add( earth )

const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry( 15, 64, 32 ), 
  new THREE.ShaderMaterial({ 
    vertexShader : atmosphereVertex,
    fragmentShader : atmosphereFragment,
    blending: THREE.AdditiveBlending,
    side : THREE.BackSide
  })
)
atmosphere.scale.set(1.2, 1.2, 1.2)
planet.add(atmosphere)

const star = new THREE.Points(
  new THREE.BufferGeometry(),
  new THREE.PointsMaterial({ color : 0xFFFFFF})
)
const starPositions = [];
for (let i = 0; i < 1000; i++){
  const x = (Math.random() - 0.5) * 2000
  const y = (Math.random() - 0.5) * 2000
  const z = -(Math.random() * 1000)
  starPositions.push(x, y, z);
}

star.geometry.setAttribute(
  'position', 
  new THREE.Float32BufferAttribute(starPositions, 3)
)
scene.add(star)

const mouse = {
  x: undefined,
  y: undefined,
}

console.log(planet)
scene.add(planet)
function animate(){
  requestAnimationFrame(animate)
  earth.rotation.y += .009;
  gsap.to(planet.rotation,{
    y : mouse.x * 0.9,
    x : -mouse.y * 0.9,
    duration : 2
  })
  renderer.render(scene, camera)
}
animate()

window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});



