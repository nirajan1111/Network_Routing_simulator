import * as THREE from 'three';
const CubeData=[
    {
        position: { x: -25.225602915421703, y: -41.00366824663472, z: 13.504375138205699 },
        cube: new THREE.Mesh(
          new THREE.BoxGeometry(),
          new THREE.MeshBasicMaterial({color:'#ff0000'})
        ),
          label: "A"
      },
     
       {
        position: { x: -4.82614356097255, y: -24.80491325126951, z: 43.14423040136279 },
        cube: new THREE.Mesh(
          new THREE.BoxGeometry(),
          new THREE.MeshBasicMaterial({color:'#00ff00'})
        ),
        label: "B"
  
      },//upper one
      
      {
        position: { x: -5.353454107642996, y: -48.99478946762729, z: -8.417311574382765 },
        cube: new THREE.Mesh(
          new THREE.BoxGeometry(),
          new THREE.MeshBasicMaterial({color:'#0000ff'})
        ),
        label: "C"
  
      },//lower one
      {
        position: { x: 4.4256029, y: -47.10156824, z: 15.504375 },
        cube: new THREE.Mesh(
          new THREE.BoxGeometry(),
          new THREE.MeshBasicMaterial({color:'#ff0000'})
        ),
        label: "D"
      },
]

export default CubeData;