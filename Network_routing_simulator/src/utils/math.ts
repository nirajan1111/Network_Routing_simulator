
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
    console.log(a, b);
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
    console.log(deltaTheta,a,b);
  
    for (let i = 0; i < numberOfPoints; i++) {
        const theta = theta1 + i * (theta2 - theta1) / (numberOfPoints - 1);
        const phi = phi1 + i * (phi2 - phi1) / (numberOfPoints - 1);
        const point = sphericalToCartesian(radius, theta, phi);
        points.push(point);
    }
    return points;
  }
  

  export { greatCircleDistance, traceGreatCirclePath };