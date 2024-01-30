import React from "react";


const Router = ({ id, x, y, onClick }: any) => {
    const [selected, setSelected] = React.useState(false);
    return (
      <g>
        <circle
          cx={x}
          cy={y}
          r={20}
          fill={selected ? "red" : "blue"}
          stroke="black"
          strokeWidth="2"
          onClick={(e) => {
            onClick(e, id)
            setSelected(!selected);
        }}
          style={{ cursor: "pointer" }}
        />
        <text x={x} y={y} textAnchor="middle" dy=".3em" fill="white" fontSize="14">
          {id}
        </text>
      </g>
    );
  };
  export default Router;
  