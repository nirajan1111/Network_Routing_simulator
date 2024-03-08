interface cube{
    position: { x: number; y: number; z: number };
    cube: THREE.Mesh;
    label: string;
  }
  interface Path {
    from: cube;
    to: cube;
    weight: number;
  }

  export type {cube,Path}