import React, { useEffect, useRef } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import * as THREE from 'three'
const Test = () => {
    const canva =useRef(null);
    useEffect(()=>{
        const scene =new THREE.Scene()
        const renderer =new THREE.WebGLRenderer({ antialias: true })
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const controls =new OrbitControls(camera,renderer.domElement)
        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
          }
          animate()
    },[])

  return (
    <div ref ={canva}>
      
    </div>
  )
}

export default Test
