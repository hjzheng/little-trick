import { useRef, useEffect } from 'react'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ViewportGizmo } from "three-viewport-gizmo";
import { createNoise3D } from 'simplex-noise';
import './App.css';

import * as dat from 'dat.gui';

const params = {
  terrainSize: 100,
  terrainSegments: 50,
  terrainHeight: 5,
}

const noise3D = createNoise3D();

function App() {
  const threeContainer = useRef<HTMLDivElement>(null);
  const dataGuiContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!threeContainer.current || !dataGuiContainer.current) return
    let gui = new dat.GUI({ autoPlace: false });
    dataGuiContainer.current?.appendChild(gui.domElement);
    gui
      .add(params, "terrainSize")
      .min(0)
      .max(1000)
      .step(10)
      .name("size");
    gui.add(params, "terrainSegments").min(10).max(100).step(1).name("segments");
    gui.add(params, "terrainHeight").min(0).max(30).name("height");
    gui.open();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 20);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight)     // 设置渲染器尺寸
    threeContainer.current?.appendChild(renderer.domElement)   // 将渲染器添加到页面

    const controls = new OrbitControls(camera, renderer.domElement)
    const gizmo = new ViewportGizmo(camera, renderer);
    gizmo.attachControls(controls);

    const ambiantlight = new THREE.AmbientLight(0x555555);
    scene.add(ambiantlight);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 30, 0);
    scene.add(light);

    const light2 = new THREE.DirectionalLight(0xffffff, 1);
    light2.position.set(30, 30, 0);
    scene.add(light2);

    
    const terrainGeometry = new THREE.PlaneGeometry(params.terrainSize, params.terrainSize, params.terrainSegments, params.terrainSegments);

    const spreadSpeed = 0.5;
    let spreadOffset = 0;
    function generateTerrain() {
      // 修改 坐标
      const vertices = terrainGeometry.attributes.position.array;
      for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i];
        const y = vertices[i + 1];
        const z = vertices[i + 2];
        const noiseValue = noise3D(x / params.terrainSize * 2, y / params.terrainSize * 2, (z + spreadOffset) / params.terrainSize * 2);
        vertices[i + 2] = noiseValue * params.terrainHeight;
      }
      terrainGeometry.attributes.position.needsUpdate = true;
      spreadOffset += spreadSpeed;
    }

    generateTerrain();
    

    const terrainMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00, wireframe: true });
    const terrainMesh = new THREE.Mesh(terrainGeometry, terrainMaterial);
    terrainMesh.rotation.x = -Math.PI / 2;
    
    scene.add(terrainMesh);
    renderer.render(scene, camera);

    function updateTerrain() {
      generateTerrain();
    }

    let animationFrameId: number;
    // 动画循环
    function animation() {

      animationFrameId = requestAnimationFrame(animation);
      updateTerrain();
      renderer.render(scene, camera);
      gizmo.render();
    }

    animation();

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      gizmo.update();
    } // 窗口大小改变时，重新渲染

    window.addEventListener('resize', onWindowResize);

    return () => {
      window.removeEventListener('resize', onWindowResize);
      threeContainer.current?.removeChild(renderer.domElement);
      renderer.dispose();
      gui.domElement.remove();
      gui.destroy();
    }  // 清除渲染器            
  }, [])

  return (
    <div className='App'>
      <div ref={dataGuiContainer} style={{ position: 'absolute', top: '10px', left: '10px' }}></div>
      <div ref={threeContainer} style={{ width: '100vw', height: '100vh' }}></div>
    </div>
  )
}

export default App
