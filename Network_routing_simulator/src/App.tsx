import "./App.css";
import { useEffect, useState } from "react";
import NetworkGraph from "./components/NetworkGraph";

interface Router {
  id: number;
  x: number;
  y: number;
}

interface Path {
  from: Router;
  to: Router;
  weight: number;
}

const App = () => {
  const [routers] = useState<Router[]>([
    { id: 0, x: 50, y: 50 },
    { id: 1, x: 150, y: 100 },
    { id: 2, x: 250, y: 50 },
    { id: 3, x: 350, y: 100 },
    { id: 4, x: 450, y: 50 },
    { id: 5, x: 50, y: 200 },
    { id: 6, x: 150, y: 250 },
    { id: 7, x: 250, y: 200 },
    { id: 8, x: 350, y: 250 },
    { id: 9, x: 450, y: 200 },
  ]);

  const originalPaths: Path[] = [
    { from: routers[0], to: routers[1], weight: 4 },
    { from: routers[1], to: routers[2], weight: 1 },
    { from: routers[2], to: routers[3], weight: 2 },
    { from: routers[0], to: routers[3], weight: 1 },
    { from: routers[3], to: routers[4], weight: 1 },
    { from: routers[0], to: routers[5], weight: 1 },
    { from: routers[5], to: routers[6], weight: 2 },
    { from: routers[7], to: routers[6], weight: 1 },
    { from: routers[8], to: routers[7], weight: 1 },
    { from: routers[8], to: routers[9], weight: 2 },
    { from: routers[1], to: routers[7], weight: 2 },
  ];

  const undirectedPaths: Path[] = [
    ...originalPaths,
    ...originalPaths.map((path) => ({
      from: path.to,
      to: path.from,
      weight: path.weight,
    })),
  ];

  const [paths] = useState<Path[]>(undirectedPaths);
  const [currentPaths, setCurrentPaths] = useState<Path[]>([]);

  const [start, setStart] = useState<Router | null>(null);
  const [end, setEnd] = useState<Router | null>(null);

  const moveObjectAlongPath = async () => {

    if (currentPaths.length === 0) {
      console.log("No path found between start and end routers");
      return;
    }
    console.log("currentPaths", currentPaths);

    const steps = 6;
    const image = document.querySelector('.image');
    image?.setAttribute('visibility', 'visible');
    console.log(image);

    for (let i = 0; i < currentPaths.length; i++) {
      const stepX = (currentPaths[i].to.x - currentPaths[i].from.x) / steps;
      const stepY = (currentPaths[i].to.y - currentPaths[i].from.y) / steps;

      for (let stepCount = 0; stepCount < steps; stepCount++) {
        const newX = currentPaths[i].from.x + stepX * stepCount;
        const newY = currentPaths[i].from.y + stepY * stepCount;

        image?.setAttribute('x', `${newX}`);
        image?.setAttribute('y', `${newY}`);

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    image?.setAttribute('visibility', 'hidden');
  };

  const shortestPath = (startRouter: Router, endRouter: Router) => {
    const distances: Record<number, number> = {};
    const previous: Record<number, Path | null> = {};
    const visited: Record<number, boolean> = {};
    const queue: Router[] = [];

    routers.forEach((router) => {
      distances[router.id] = Infinity;
      previous[router.id] = null;
    });

    distances[startRouter.id] = 0;
    queue.push(startRouter);

    while (queue.length > 0) {
      queue.sort((a, b) => distances[a.id] - distances[b.id]);
      const currentRouter = queue.shift()!;

      if (currentRouter.id === endRouter.id) {
        const path: Path[] = [];
        let current = endRouter.id;

        while (previous[current]) {
          path.unshift(previous[current]!);
          current = previous[current]!.from.id;
        }

        setCurrentPaths(path);
        console.log("Shortest path found:", path);
        return;
      }

      if (!visited[currentRouter.id]) {
        visited[currentRouter.id] = true;

        const neighbors = paths.filter((path) => path.from.id === currentRouter.id);

        for (const neighborPath of neighbors) {
          const neighborRouter = neighborPath.to;
          const newDistance = distances[currentRouter.id] + neighborPath.weight;

          if (newDistance < distances[neighborRouter.id]) {
            distances[neighborRouter.id] = newDistance;
            previous[neighborRouter.id] = neighborPath;
            queue.push(neighborRouter);
          }
        }
      }
    }
    setCurrentPaths([]);
    console.log("No path found between start and end routers");
  };

  useEffect(() => {
    if (start && end) {
      shortestPath(start, end);
    }
  }, [start, end, routers]);

  const Simulate = () => {
    if (!start || !end) {
      console.log("Please select both start and end routers.");
      return;
    }
    moveObjectAlongPath();
  };

  return (
    <div>
      <h1>Router Simulator</h1>
      <NetworkGraph
        routers={routers}
        paths={paths}
        start={start!}
        setstart={setStart}
        end={end!}
        setend={setEnd}
      />
      <button onClick={Simulate}>Simulate</button>
    </div>
  );
};

export default App;
