// NetworkGraph.js
import React from "react";
import Router from "../Router";
interface Router {
  id: number;
  x: number;
  y: number;
}
const NetworkGraph: React.FC<{
  routers: any[];
  paths: any[];
  start: Router;
  setstart: any;
  end: Router;
  setend: any;
}> = ({ routers, paths, start, setstart, end, setend }) => {
  const imageRef = React.useRef<SVGImageElement | null>(null);

  const handlerouterset = ( routerId: number) => {
    if (start) {
      setend(routers.find((router) => router.id === routerId));
      console.log("start", start);
    } else {
      setstart(routers.find((router) => router.id === routerId));
      console.log("end", end);
    }
  };

  return (
    <svg width={500} height={500} xmlns="http://www.w3.org/2000/svg">
      {paths.map((path, index) => (
        <g key={index}>
          <line
            x1={path.from.x}
            y1={path.from.y}
            x2={path.to.x}
            y2={path.to.y}
            stroke="black"
            strokeWidth="2"
          />
          <text
            x={(path.from.x + path.to.x) / 2}
            y={(path.from.y + path.to.y) / 2}
            textAnchor="middle"
            dy=".3em"
            fill="black"
            fontSize="16"
          >
            {path.weight}
          </text>
        </g>
      ))}
      {routers.map((router) => (
        <Router
          key={router.id}
          {...router}
          onClick={() => handlerouterset( router.id)}
        />
      ))}
      <image
        ref={imageRef}
        className="image"
        href="https://images.unsplash.com/photo-1682685796852-aa311b46f50d?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        x={36}
        y={35}
        width={30}
        height={30}
        visibility={"hidden"}
      />
    </svg>
  );
};

export default NetworkGraph;
