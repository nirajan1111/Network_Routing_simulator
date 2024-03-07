import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface cube{
  position: { x: number; y: number; z: number };
  cube: THREE.Mesh;
}
interface Path {
  from: cube;
  to: cube;
  weight: number;
}
const Earth: React.FC = () => {
  const moveBy =async () => {
    if (!startCube || !endCube) {
      console.log("Start and end cubes are not selected.");
      return;
    }
  
    const path = dijkstra(graph, startCube, endCube);
    console.log(path);
    if (path.length === 0) {
      console.log("No path found between start and end cubes.");
      return;
    }
    const start= path.map((p)=>{
      return p.from.position;
    })
    const end= path.map((p)=>{return p.to.position})
    const routes = traceGreatCirclePath(start[0], end[0], 50, 20);
    console.log(routes);
   
      const cube = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({ color: Math.random() * 0x000000 })
      );
      earthGroup.add(cube);
      const moveObject = async () => {
        for (let i = 0; i < pathcube.length; i++) {
          const route = pathcube[i];
          const x = route.position.x;
          const y = route.position.y;
          const z = route.position.z;
          cube.position.set(x, y, z);
          console.log("Moving to", x, y, z);
          setCount(count+1);
          renderer.render(scene, camera);
          controls.update();
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      };
      
      
   await  moveObject();
  };
  const [pathCubesGroup] = useState(new THREE.Group());
  const [startCube, setStartCube] = useState<cube | null>(null);
  const [endCube, setEndCube] = useState<cube | null>(null);
  const [earthGroup] = useState(new THREE.Group());
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  const controls = new OrbitControls(camera, renderer.domElement);
  const [count , setCount] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [cubes, setCubes] = useState<cube[]>([]);
  const [graph, setGraph] = useState<Path[]>([]);
  const [pathcube, setPathcube] = useState<{ position: { x: number; y: number; z: number }; cube: THREE.Mesh }[]>([]);
 
  function dijkstra(graph: Path[], start: cube, end: cube): { from: cube, to: cube }[] {
    const visited: { [key: string]: boolean } = {};
    const distances: { [key: string]: number } = {};
    const previous: { [key: string]: cube | null } = {};
    const queue: cube[] = [];
  
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
    const newCubes: cube[] = [];  
   

    for (let i = 0; i < path.length; i++) {
      const cube = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.1, 0.1),
        new THREE.MeshBasicMaterial({ color: Math.random() * 0xf0f7ff })
      );
      const x = path[i].x;
      const y = path[i].y;
      const z = path[i].z;
      cube.position.set(x, y, z);
      pathCubesGroup.add(cube);
      
      newCubes.push({ position: { x, y, z }, cube });
    }
    setPathcube(newCubes);
    
  };
  const calculateDistances = () => {
    console.log("Entered calculateDistances")
    const newGraph: Path[] = [];
    for (let i = 0; i < cubes.length; i++) {
      for (let j = i + 1; j < cubes.length; j++) {
        // if(Math.random()>0.5) continue
        console.log("Entered for loop")
        const cube1 = cubes[i];
        const cube2 = cubes[j];
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
    }
    setGraph(newGraph);
  };

  useEffect(() => {
  
   
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (canvasRef.current) {
      canvasRef.current.appendChild(renderer.domElement);
    }
    const cubesGroup = new THREE.Group();
    const textureLoader = new THREE.TextureLoader();
    const globeTexture = textureLoader.load('./images/globe.jpg');
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(50, 320, 320),
      new THREE.MeshBasicMaterial({ map: globeTexture })
    );
    scene.add(earth);
    const axesHelper = new THREE.AxesHelper(50);
    axesHelper.position.set(60, 0, 0);
    scene.add(axesHelper);

    // Create a group to hold the cube and rotate it along with the Earth
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
          new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff })
        );
        cube.position.set(x, y, z);
        cubesGroup.add(cube);
        newCubes.push({ position: { x, y, z }, cube });
      }
      setStartCube(newCubes[0]);
      setEndCube(newCubes[1]);
      setCubes(newCubes);
    };
    
    generateRandomCubes();
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
      scene.remove(earthGroup); // Remove earthGroup instead of individual objects
      renderer.dispose();
      controls.dispose();
    };
  }, []);
  useEffect(() => {
    // console.log(cubes); 
    // console.log(graph);
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
    calculateDistances();
  },[cubes]);
  useEffect(() => {
    // Existing code

    // Add the pathCubesGroup to the scene
    scene.add(pathCubesGroup);

    // Existing code

    return () => {
      // Existing code

      // Remove the pathCubesGroup from the scene
      scene.remove(pathCubesGroup);
    };
  }, []);
  // useEffect(() => {
    
  //   const onClick = (event: MouseEvent) => {
     
  //     if (!canvasRef.current) return;

  //     const canvasBounds = canvasRef.current.getBoundingClientRect();
  //     const mouseX = ((event.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1;
  //     const mouseY = -((event.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1;

  //     const raycaster = new THREE.Raycaster();
  //     raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);

  //     const intersects = raycaster.intersectObjects(scene.children, true);
  //     console.log(intersects);
  //     if (intersects.length > 0) {
     
  //       const clickedCube = intersects.find(intersect => intersect.object.type === 'Mesh');
  //       console.log(clickedCube);
  //       if (clickedCube) {
  //         // Update startCube or endCube based on whether startCube is set or not
  //         if (!startCube) {
  //           setStartCube({ position: clickedCube.point, cube: clickedCube.object as THREE.Mesh });
  //         } else if (!endCube) {
  //           setEndCube({ position: clickedCube.point, cube: clickedCube.object as THREE.Mesh });
  //         } else {
  //           // If both start and end cubes are selected, perform pathfinding or any other logic
  //           // For example, you can calculate the shortest path between start and end cubes here
  //           console.log('Start Cube:', startCube);
  //           console.log('End Cube:', endCube);

  //           // Reset start and end cubes
  //           setStartCube(null);
  //           setEndCube(null);
  //         }
  //       }
  //     }
  //   };

  //   // Add event listener for mouse clicks
  //   window.addEventListener('click', onClick);

  //   // Clean up event listener
  //   return () => {
  //     // window.removeEventListener('click', onClick);
  //   };
  // }, [startCube, endCube]); // Re-run effect when startCube or endCube changes


  return <>

  <div ref={canvasRef}></div>
  <button onClick={moveBy}>Click to travel</button>
  </>
};

export default Earth;



interface Point {
  x: number;
  y: number;
  z: number;
}

function cartesianToSpherical(x: number, y: number, z: number): [number, number, number] {
  const r = Math.sqrt(x**2 + y**2 + z**2);
  const theta = Math.acos(z / r);
  const phi = Math.atan2(y, x);
  return [r, theta, phi];
}

function sphericalToCartesian(r: number, theta: number, phi: number): Point {
  const x = r * Math.sin(theta) * Math.cos(phi);
  const y = r * Math.sin(theta) * Math.sin(phi);
  const z = r * Math.cos(theta);
  return { x, y, z };
}

function greatCircleDistance(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, radius: number): number {
  const [a, theta1, phi1] = cartesianToSpherical(x1, y1, z1);
  const [b, theta2, phi2] = cartesianToSpherical(x2, y2, z2);

  const deltaPhi = Math.abs(phi1 - phi2);

  const centralAngle = 2 * Math.asin(Math.sqrt(Math.sin((theta1 - theta2) / 2)**2 + Math.cos(theta1) * Math.cos(theta2) * Math.sin(deltaPhi / 2)**2));

  const distance = radius * centralAngle;
  return distance;
}

function traceGreatCirclePath(start: Point, end: Point, radius: number, numberOfPoints: number): Point[] {
  const points: Point[] = [];
  const deltaTheta = Math.PI / (numberOfPoints - 1);

  const [a, theta1, phi1] = cartesianToSpherical(start.x, start.y, start.z);
  const [b, theta2, phi2] = cartesianToSpherical(end.x, end.y, end.z);

  for (let i = 0; i < numberOfPoints; i++) {
      const theta = theta1 + i * (theta2 - theta1) / (numberOfPoints - 1);
      const phi = phi1 + i * (phi2 - phi1) / (numberOfPoints - 1);
      const point = sphericalToCartesian(radius, theta, phi);
      points.push(point);
  }
  // console.log(points)
  return points;
}
