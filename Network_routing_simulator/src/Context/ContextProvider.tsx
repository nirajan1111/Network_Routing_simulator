// Create a new context
import React, { createContext, useContext, useState } from "react";
import { Path, cube } from "./../types/types";
import * as THREE from "three";
import CubeData from "./../components/Earth/cube";
// Define the type for the context value
interface ContextValue {
  graph: Path[];
  setGraph: React.Dispatch<React.SetStateAction<Path[]>>;
  pathCubesGroup: THREE.Group;
  startCube: cube | null;
  setStartCube: React.Dispatch<React.SetStateAction<cube | null>>;
  endCube: cube | null;
  setEndCube: React.Dispatch<React.SetStateAction<cube | null>>;
  earthGroup: THREE.Group;
  cubes: cube[];
  setCubes: React.Dispatch<React.SetStateAction<cube[]>>;
  pathcube: {
    position: { x: number; y: number; z: number };
    cube: THREE.Mesh;
  }[];
  isOpen: boolean;
  togglePopup: () => void;
  setPathcube: React.Dispatch<
    React.SetStateAction<
      { position: { x: number; y: number; z: number }; cube: THREE.Mesh }[]
    >
  >;
}

// Create the context
const MyContext = createContext<ContextValue | undefined>(undefined);

export const MyProvider: any = ({ children }: any) => {
  const [graph, setGraph] = useState<Path[]>([]);
  const [pathCubesGroup] = useState(new THREE.Group());
  const [startCube, setStartCube] = useState<cube | null>(null);
  const [endCube, setEndCube] = useState<cube | null>(null);
  const [earthGroup] = useState(new THREE.Group());
  const [cubes, setCubes] = useState<cube[]>(CubeData);
  const [pathcube, setPathcube] = useState<
    { position: { x: number; y: number; z: number }; cube: THREE.Mesh }[]
  >([]);
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };
  return (
    <MyContext.Provider
      value={{
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
        pathcube,
        setPathcube,
        isOpen,
        togglePopup,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

// Create a custom hook to consume the context
export const useMyContext = (): ContextValue => {
  const context = useContext(MyContext);
  if (context === undefined) {
    throw new Error("useMyContext must be used within a MyProvider");
  }
  return context;
};
