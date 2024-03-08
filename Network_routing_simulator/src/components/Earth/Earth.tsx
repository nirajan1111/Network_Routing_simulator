import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { greatCircleDistance, traceGreatCirclePath } from './../../utils/math';
interface cube{
  position: { x: number; y: number; z: number };
  cube: THREE.Mesh;
  label: string;}
interface Path {
  from: cube;
  to: cube;
  weight: number;
}
const Earth: React.FC = () => {

  const  onClick=(event:any) =>{
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(earth);

    if (intersects.length > 0) {
        const intersectionPoint = intersects[0].point;
        const cube = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff })
        );
        cube.position.copy(intersectionPoint);
        earthGroup.add(cube);
        setCubes([...cubes, { position: { x: intersectionPoint.x, y: intersectionPoint.y, z: intersectionPoint.z }, cube }]);
    }
   
  } 
  window.addEventListener('click', onClick);

  const moveBy =async () => {
    const startCube =cubes[1];
    const endCube=cubes[2];
    if (!startCube || !endCube) {
      console.log("Start and end cubes are not selected.");
      return;
    }
  
    const path = dijkstra(graph, startCube, endCube);
    console.log("obtained dikstra path",path);
    if (path.length === 0) {
      console.log("No path found between start and end cubes.");
      return;
    }
    for(let i=0;i<path.length;i++){
      const start=path[i].from.position
      const end =path[i].to.position
      const route = traceGreatCirclePath(start, end, 50, 20);
      console.log(route)
      const cube = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({ color: Math.random() * 0x000000 })
      );
     
      earthGroup.add(cube);
      const moveObject = async () => {
        
        for (let j = 0; j < route.length; j++) {
          const x = route[j].x;
          const y = route[j].y;
          const z = route[j].z;
          cube.position.set(x, y, z);
          console.log("Moving to", x, y, z);
          
          // renderer.render(scene, camera);
          // controls.update();
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      };
      
      
   await  moveObject();
    }
  };
  const [pathCubesGroup] = useState(new THREE.Group());
  // const [startCube, setStartCube] = useState<cube | null>();
  // const [endCube, setEndCube] = useState<cube | null>(null);
  const [temp, setTemp] = useState(0);
  const [earthGroup] = useState(new THREE.Group());
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  const controls = new OrbitControls(camera, renderer.domElement);
  const [count , setCount] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);
  const raycaster= new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  const textureLoader = new THREE.TextureLoader();
  const globeTexture = textureLoader.load('./images/globe.jpg');
  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(50, 320, 320),
    new THREE.MeshBasicMaterial({ map: globeTexture })
  );
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

  const [cubes, setCubes] = useState<cube[]>([
    {
      position: { x: -25.225602915421703, y: -41.00366824663472, z: 13.504375138205699 },
      cube: new THREE.Mesh(
        new THREE.BoxGeometry(),
        new THREE.MeshBasicMaterial({color:'#ff0000'})
      ),

    },
   
     {
      position: { x: -4.82614356097255, y: -24.80491325126951, z: 43.14423040136279 },
      cube: new THREE.Mesh(
        new THREE.BoxGeometry(),
        new THREE.MeshBasicMaterial({color:'#00ff00'})
      )
    },//upper one
    
    {
      position: { x: -5.353454107642996, y: -48.99478946762729, z: -8.417311574382765 },
      cube: new THREE.Mesh(
        new THREE.BoxGeometry(),
        new THREE.MeshBasicMaterial({color:'#0000ff'})
      )
    },//lower one
    {
      position: { x: -4.4256029, y: -47.10156824, z: 15.504375 },
      cube: new THREE.Mesh(
        new THREE.BoxGeometry(),
        new THREE.MeshBasicMaterial({color:'#ff0000'})
      )
    },
  ]);
  const [graph, setGraph] = useState<Path[]>([]);
  const [pathcube, setPathcube] = useState<{ position: { x: number; y: number; z: number }; cube: THREE.Mesh }[]>([]);
 
  function dijkstra(graph: Path[], start: cube, end: cube): { from: cube, to: cube }[] {
    const visited: { [key: string]: boolean } = {};
    const distances: { [key: string]: number } = {};
    const previous: { [key: string]: cube | null } = {};
    const queue: cube[] = [];
    console.log("Dikstra going one")
    for (const vertex of graph) {
        distances[JSON.stringify(vertex.from.position)] = Infinity;
        previous[JSON.stringify(vertex.from.position)] = null;
    }
    distances[JSON.stringify(start.position)] = 0;
  
    queue.push(start);
  
    while (queue.length) {
        queue.sort((a, b) => distances[JSON.stringify(a.position)] - distances[JSON.stringify(b.position)]);
        const current = queue.shift()!;
  
        if (current === end) {
            const path: { from: cube, to: cube }[] = [];
            let temp: cube | null = current;
            while (temp && previous[JSON.stringify(temp.position)]) {
                path.push({ from: previous[JSON.stringify(temp.position)]!, to: temp });
                temp = previous[JSON.stringify(temp.position)];
            }
            return path.reverse();
        }
  
        visited[JSON.stringify(current.position)] = true;
  
        for (const edge of graph.filter(edge => edge.from === current)) {
            const neighbor = edge.to;
            if (!visited[JSON.stringify(neighbor.position)]) {
                const tentativeDistance = distances[JSON.stringify(current.position)] + edge.weight;
                if (tentativeDistance < distances[JSON.stringify(neighbor.position)]) {
                    distances[JSON.stringify(neighbor.position)] = tentativeDistance;
                    previous[JSON.stringify(neighbor.position)] = current;
                    queue.push(neighbor);
                }
            }
        }
    }
  
    return [];
}
  const generateGreatCirclePath = (start: { x: number; y: number; z: number }, end: { x: number; y: number; z: number }, radius: number) => {
    console.log("Entered")
    const path = traceGreatCirclePath(start, end, radius, 20);
    const newCubes: any = [];  
  
    for (let i = 0; i < path.length; i++) {
      // const cube = new THREE.Mesh(
      //   new THREE.BoxGeometry(0.1, 0.1, 0.1),
      //   new THREE.MeshBasicMaterial({ color: Math.random() * 0xf0f7ff })
      // );
      const x = path[i].x;
      const y = path[i].y;
      const z = path[i].z;
      // cube.position.set(x, y, z);
      // pathCubesGroup.add(cube);
      
      // newCubes.push({ position: { x, y, z }, cube });
    }
    // setPathcube(newCubes);
  };
  const calculateDistances = () => {
    console.log("Entered calculateDistances")
    const newGraph: Path[] = [];
    // for (let i = 0; i < cubes.length; i++) {
    //   for (let j = i + 1; j < cubes.length; j++) {
    //     // if(Math.random()>0.5) continue
    //     console.log("Entered for loop")
    //     const cube1 = cubes[i];
    //     const cube2 = cubes[j];
    //     const distance = greatCircleDistance(
    //       cube1.position.x,
    //       cube1.position.y,
    //       cube1.position.z,
    //       cube2.position.x,
    //       cube2.position.y,
    //       cube2.position.z,
    //       50
    //     );
    //     newGraph.push({ from: cube1, to: cube2, weight: distance });
    //     newGraph.push({ from: cube2, to: cube1, weight: distance });
    //   }
    // }
    //Manual testing stuff
{
  const cube1 = cubes[0];
  const cube2 = cubes[1];
  const distance = greatCircleDistance(
    cube1.position.x,
    cube1.position.y,
    cube1.position.z,
    cube2.position.x,
    cube2.position.y,
    cube2.position.z,
    50
  );
  newGraph.push({ from: cube1, to: cube2, weight: distance });
  newGraph.push({ from: cube2, to: cube1, weight: distance });
}    
      {  const cube1 = cubes[0];
        const cube2 = cubes[2];
        const distance = greatCircleDistance(
          cube1.position.x,
          cube1.position.y,
          cube1.position.z,
          cube2.position.x,
          cube2.position.y,
          cube2.position.z,
          50
        );
        newGraph.push({ from: cube1, to: cube2, weight: distance });
        newGraph.push({ from: cube2, to: cube1, weight: distance });}
        {  const cube1 = cubes[1];
          const cube2 = cubes[3];
          const distance = greatCircleDistance(
            cube1.position.x,
            cube1.position.y,
            cube1.position.z,
            cube2.position.x,
            cube2.position.y,
            cube2.position.z,
            50
          );
          newGraph.push({ from: cube1, to: cube2, weight: distance });
          newGraph.push({ from: cube2, to: cube1, weight: distance });}
          {  const cube1 = cubes[2];
            const cube2 = cubes[3];
            const distance = greatCircleDistance(
              cube1.position.x,
              cube1.position.y,
              cube1.position.z,
              cube2.position.x,
              cube2.position.y,
              cube2.position.z,
              50
            );
            newGraph.push({ from: cube1, to: cube2, weight: distance });
            newGraph.push({ from: cube2, to: cube1, weight: distance });}
    setGraph(newGraph);
  };

  useEffect(() => {
  
   
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (canvasRef.current) {
      canvasRef.current.appendChild(renderer.domElement);
    }
    const cubesGroup = new THREE.Group();
   
    scene.add(earth);
    const axesHelper = new THREE.AxesHelper(50);
    axesHelper.position.set(60, 0, 0);
    scene.add(axesHelper);
    earthGroup.add(earth);
    scene.add(earthGroup);

    scene.add(cubesGroup);

    const generateRandomCubes = () => {
      const newCubes: { position: { x: number; y: number; z: number }; cube: THREE.Mesh }[] = [];
      for (let i = 0; i < 10; i++) {
        const theta = Math.random() * Math.PI * 2; // Random angle
        const phi = Math.acos(Math.random() * 2 - 1); // Random inclination angle
        const radius = 50; // Earth's radius
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        const cube = new THREE.Mesh(
          new THREE.BoxGeometry(1, 1, 1),
          new THREE.MeshBasicMaterial({
            map: textureLoader.load('./images/Metal032_1K-JPG_Color.jpg')
          })
        );
        cube.position.set(x, y, z);
        cubesGroup.add(cube);
        newCubes.push({ position: { x, y, z }, cube });
      }
      
      setCubes(newCubes);
    };
    if(cubes.length===0){
      generateRandomCubes();
    }else{
      console.log(cubes)
     for(let i=0;i<cubes.length;i++){
      cubes[i].cube.position.set(cubes[i].position.x,cubes[i].position.y,cubes[i].position.z)
      cubesGroup.add(cubes[i].cube)
     }
    }
    camera.position.z = 100;

    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    const clock = new THREE.Clock()

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      scene.remove(earthGroup);
      renderer.dispose();
      controls.dispose();
    };
  }, []);
  useEffect(() => {
    // console.log(cubes); 
    console.log(graph);
    if(cubes.length<2) return;
    for(let i=0;i<cubes.length;i++){
      for(let j=0;j<cubes.length;j++){
        if(i!=j){
          const start = cubes[i].position;
          const end = cubes[j].position;
          generateGreatCirclePath(start, end, 50);
        }
      
      }
    }
  },[cubes,graph]);
  useEffect(() => {

  },[]);





  useEffect(() => {
    calculateDistances();
  },[cubes]);
  useEffect(() => {
    scene.add(pathCubesGroup);
    return () => {
      scene.remove(pathCubesGroup);
    };
  }, []);
  
  return <>

  <div ref={canvasRef}></div>
  <button className='absolute top-2 left-2 z-10' onClick={moveBy}>Click to travel</button>
  </>
};

export default Earth;
