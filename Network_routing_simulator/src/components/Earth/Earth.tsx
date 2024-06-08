import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { greatCircleDistance, traceGreatCirclePath } from "./../../utils/math";
import PopupAlert from "../../core/components/popup";
import createLabeledText from "./../../utils/creatingLabeltext";
import { cube, Path } from "./../../types/types";
import { useMyContext } from "./../../Context/ContextProvider";
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
const renderer = new THREE.WebGLRenderer({ antialias: true });
import { Vector3, BufferGeometry, BufferAttribute, PointsMaterial, Points, Color } from 'three';

const Earth: React.FC = () => {
  const [moving ,setMoving]=useState(false)
  const [content, setcontent] = useState("");
  const [startend,setStartend]=useState("")
  const {
    graph,
    setGraph,
    pathCubesGroup,
    startCube,
    setStartCube,
    endCube,
    setEndCube,
    earthGroup,
    cubes,
    setCubes,
   
    isOpen,
    togglePopup,
  }: any = useMyContext();


  //Functions
  const setPath = () => {
    const input1 = prompt("Enter the start cube");
    const input2 = prompt("Enter the end cube");
    const newGraph: Path[] = [];
    const cube1 = cubes.find((cube:any) => cube.label === input1);
    const cube2 = cubes.find((cube:any) => cube.label === input2);
    if (!cube1 || !cube2) {
      setcontent("Cube selected are not available");
      togglePopup();
    } else {
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
      setGraph((prevGraph: Path[]) => [...prevGraph, ...newGraph]);
    }
  };
  const setsrcanddesc = () => {
    const input1 = prompt("Enter the start cube");
    const input2 = prompt("Enter the end cube");
    const cube1 = cubes.find((cube:any) => cube.label === input1);
    const cube2 = cubes.find((cube:any) => cube.label === input2);
    if (!cube1 || !cube2) {
      console.log("Cube selected are not available");
      setcontent("Cube selected are not available");
      togglePopup();
    } else {
      setStartCube(cube1);
      setEndCube(cube2);
    }
  };

  const createStars = () => {
    const vertices: number[] = [];
    const colors: Color[] = [];
  
    for (let i = 0; i < 500; i++) {
      const vertex = new Vector3();
      vertex.x = 800 * Math.random() - 300;
      vertex.y = 800 * Math.random() - 300;
      vertex.z = 800 * Math.random() - 300;
      vertices.push(vertex.x, vertex.y, vertex.z);
      colors.push(new Color(1, 1, 1));
    }
  
    const around = new BufferGeometry();
    around.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
    around.setAttribute('color', new BufferAttribute(new Float32Array(), 3));
  
    const aroundMaterial = new PointsMaterial({
      size: 2,
      sizeAttenuation: true,
      color: 0x4d76cf,
      transparent: true,
      opacity: 1,
      // Assuming this.options.textures.gradient is available
      // map: textureLoader.load(this.options.textures.gradient),
    });
  
    const aroundPoints = new Points(around, aroundMaterial);
    aroundPoints.name = 'Stars';
    earthGroup.add(aroundPoints);
  };
  
  useEffect(() => {

    createStars();
  
  }, []);

  const onClicked = (event: any) => {
    const cubetexture =textureLoader.load('./texture/Door001.png')

    console.log("Double clicked");
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(earth);


    if (intersects.length > 0) {
      const intersectionPoint = intersects[0].point;
      const cube = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({ map: cubetexture})
      );
      cube.position.copy(intersectionPoint);
      const label: any = prompt("Enter the label for the cube");
      createLabeledText(label, intersectionPoint, scene,undefined);

      earthGroup.add(cube);
      const obj: cube = {
        position: {
          x: intersectionPoint.x,
          y: intersectionPoint.y,
          z: intersectionPoint.z,
        },
        cube,
        label: label.toString(),
      };
      setCubes((prevCubes:any) => [...prevCubes, obj]);
    }
  };
  useEffect(() => {
    window.addEventListener("dblclick", onClicked);

    return () => {
      window.removeEventListener("dblclick", onClicked);
    };
  }, []);

 



  const moveBy = async () => {
    if (!startCube || !endCube) {
        console.log("Start and end cubes are not selected.");
        setcontent("Start and end cubes are not selected.");
        togglePopup();
        return;
    }

    const path = dijkstra(graph, startCube, endCube);
    console.log("obtained dikstra path", path);
    if (path.length === 0) {
        console.log("No path found between start and end cubes.");
        setcontent("No path found between start and end cubes.");
        togglePopup();
        return;
    }
    setMoving(true)
    console.log("Moving to the path");
    const fontLoader = new FontLoader();
    const font:Font = await new Promise((resolve, reject) => {
        fontLoader.load(
            './font/helvetiker_regular.typeface.json',
            resolve,
            undefined, 
            reject 
        );
    });
    if (!font) {
        console.error("Font could not be loaded.");
        return;
    }
    const moveGroup = new THREE.Group();
    earthGroup.add(moveGroup);
    let result = '';
    for (let i = 0; i < 4; i++) {
        result += Math.random() < 0.5 ? '0' : '1';
    }
    console.log("Random string", result);
    const textGeometry = new TextGeometry(result, {
      font: font,
      size: 1.5,
      height: 0.5,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5
  });
  textGeometry.computeBoundingBox();
  textGeometry.center();
  const textMaterial = new THREE.MeshMatcapMaterial({ color: '#FFA896' });
  const text = new THREE.Mesh(textGeometry, textMaterial);
  text.rotation.x = 0.90477868423386;
  text.rotation.y = -0.408407044966673;
  moveGroup.add(text);
    for (let i = 0; i < path.length; i++) {
        const start = path[i].from.position;
        const end = path[i].to.position;
        const route = traceGreatCirclePath(start, end, 50, 10);
        setStartend(path[i].from.label+path[i].to.label)
        const moveObject = async () => {
            for (let j = 0; j < route.length; j++) {
                const x = route[j].x*1.01;
                const y = route[j].y*1.01;
                const z = route[j].z*1.01;
                text.position.set(x, y, z);
                await new Promise((resolve) => setTimeout(resolve, 500));
            }
        };
        await moveObject();
        setStartend("")
    }
    setMoving(false)
};



  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const controls = new OrbitControls(camera, renderer.domElement);
  const canvasRef = useRef<HTMLDivElement>(null);
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const textureLoader = new THREE.TextureLoader();
  const globeTexture = textureLoader.load("./images/globe.jpg");
  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(50, 320, 320),
    new THREE.MeshBasicMaterial({ map: globeTexture })
  );

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  function dijkstra(
    graph: Path[],
    start: cube,
    end: cube
  ): { from: cube; to: cube }[] {
    const visited: { [key: string]: boolean } = {};
    const distances: { [key: string]: number } = {};
    const previous: { [key: string]: cube | null } = {};
    const queue: cube[] = [];
    console.log("Dikstra going one");
    for (const vertex of graph) {
      distances[JSON.stringify(vertex.from.position)] = Infinity;
      previous[JSON.stringify(vertex.from.position)] = null;
    }
    distances[JSON.stringify(start.position)] = 0;

    queue.push(start);

    while (queue.length) {
      // console.log(JSON.stringify(queue[0].position))
      queue.sort(
        (a, b) =>
          distances[JSON.stringify(a.position)] -
          distances[JSON.stringify(b.position)]
      );
      const current = queue.shift()!;

      if (current === end) {
        const path: { from: cube; to: cube }[] = [];
        let temp: cube | null = current;
        while (temp && previous[JSON.stringify(temp.position)]) {
          path.push({
            from: previous[JSON.stringify(temp.position)]!,
            to: temp,
          });
          temp = previous[JSON.stringify(temp.position)];
        }
        return path.reverse();
      }

      visited[JSON.stringify(current.position)] = true;

      for (const edge of graph.filter((edge) => edge.from === current)) {
        const neighbor = edge.to;
        if (!visited[JSON.stringify(neighbor.position)]) {
          const tentativeDistance =
            distances[JSON.stringify(current.position)] + edge.weight;
          if (
            tentativeDistance < distances[JSON.stringify(neighbor.position)]
          ) {
            distances[JSON.stringify(neighbor.position)] = tentativeDistance;
            previous[JSON.stringify(neighbor.position)] = current;
            queue.push(neighbor);
          }
        }
      }
    }
    return [];
  }


  useEffect(() => {
    const ambientlight = new THREE.AmbientLight(0xffffff, 0.2);
    ambientlight.position.set(60, 0, 0);
    scene.add(ambientlight);

    const pointerlight = new THREE.PointLight(0xffffff, 0.9);
    pointerlight.position.set(60, 0, 0);
    scene.add(pointerlight);

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

    // const generateRandomCubes = () => {
    //   const newCubes: {
    //     position: { x: number; y: number; z: number };
    //     cube: THREE.Mesh;
    //   }[] = [];
    //   for (let i = 0; i < 10; i++) {
    //     const theta = Math.random() * Math.PI * 2; 
    //     const phi = Math.acos(Math.random() * 2 - 1);
    //     const radius = 50; 
    //     const x = radius * Math.sin(phi) * Math.cos(theta);
    //     const y = radius * Math.sin(phi) * Math.sin(theta);
    //     const z = radius * Math.cos(phi);
    //     const cube = new THREE.Mesh(
    //       new THREE.BoxGeometry(1, 1, 1),
    //       new THREE.MeshBasicMaterial({
    //         map: textureLoader.load("./images/Metal032_1K-JPG_Color.jpg"),
    //       })
    //     );
    //     cube.position.set(x, y, z);
    //     cubesGroup.add(cube);
    //     newCubes.push({ position: { x, y, z }, cube });
    //   }
    // };
    // if (cubes.length === 0) {
    //   generateRandomCubes();
    // } else {
    //   for (let i = 0; i < cubes.length; i++) {
    //     cubes[i].cube.position.set(
    //       cubes[i].position.x,
    //       cubes[i].position.y,
    //       cubes[i].position.z
    //     );
    //     cubesGroup.add(cubes[i].cube);
    //     createLabeledText(cubes[i].label, cubes[i].position, scene, undefined);
    //   }
    // }
    camera.position.z = 75;
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.minDistance = 55; 
  controls.maxDistance = 200;

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
    console.log("Graph changed", graph);
   
    pathCubesGroup.clear();
      for (const edge of graph) {
        const path = traceGreatCirclePath(
          edge.from.position,
          edge.to.position,
          50,
          10
        );
        const curvePoints = path.map(point => new THREE.Vector3(point.x, point.y, point.z));
        const curve = new THREE.CatmullRomCurve3(curvePoints);
    
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
    
        const material = new THREE.LineBasicMaterial({ color: 0x00ff00,linewidth: 4  });
    
        const curveLine = new THREE.Line(geometry, material);
        pathCubesGroup.add(curveLine);
       
      }  
  }, [graph]);
  
  useEffect(() => {
    scene.add(pathCubesGroup);
    return () => {
    scene.remove(pathCubesGroup);
    };
  }, []);
  useEffect(() => {
    console.log(startend, moving);
    if (startend && moving) {
      console.log("Its moving");
      const updatedGraph = [...graph]; 
      for (let i = 0; i < updatedGraph.length; i++) {
        if (updatedGraph[i].from.label + updatedGraph[i].to.label === startend) {
          updatedGraph[i].weight += 10; 
        }
      }
      setGraph(updatedGraph);
    } else {
      const updatedGraph: Path[] = graph.map((edge: Path) => ({
        ...edge,
        weight: greatCircleDistance(
          edge?.from.position.x,
          edge?.from.position.y,
          edge?.from.position.z,
          edge?.to.position.x,
          edge?.to.position.y,
          edge?.to.position.z,
          50
        )
      }));
      setGraph(updatedGraph); 
    }
  }, [moving, startend]);
  

  return (
    <div className="container flex bg-black">
      <img src="/images/loading.gif" alt="Loading..." className="absolute -z-10"/>
      <div className="canvas-container">
        <div ref={canvasRef}></div>
      </div>
      <div
        className="absolute top-16 right-0 flex flex-col"
        style={{ width: "20%" }}
      >
        <button className="bg-red-100 hover:bg-red-200 my-2" onClick={moveBy}>
          travel
        </button>
        <button className="bg-red-100 hover:bg-red-200 my-2" onClick={setPath}>
          set path
        </button>
        <button
          className="bg-red-100 my-2 hover:bg-red-200"
          onClick={setsrcanddesc}
        >
          set init and final
        </button>
        <div className="bg-red-100 text-center flex flex-row flex-wrap">
          {cubes.map((cube: any) => (
            <div className="m-2" key={cube.label}>{cube.label}</div>
          ))}
        </div>
        <div className="bg-red-100 text-center">
          {graph.map((path: any) => (
            <div key={path.from.label + path.to.label}>
              {path.from.label} to {path.to.label} : {path.weight.toFixed(6)}
            </div>
          ))}
        </div>
      </div>
      {isOpen && <PopupAlert content={content} />}
    </div>
  );
};
export default Earth;
