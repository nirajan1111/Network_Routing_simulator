import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import * as THREE from 'three';
function createLabeledText(label:any, position:any, scene:any) {
    const fontLoader = new FontLoader()

    fontLoader.load(
        './font/helvetiker_regular.typeface.json',
        (font) => {
            const textGeometry = new TextGeometry(label, {
                font: font,
                size: 2,
                height: 0.2,
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
            text.rotation.x = -Math.PI / 2; 
            text.position.copy(position);
            text.position.multiplyScalar(1.1); 

            scene.add(text);
        }
    );
}

export default createLabeledText;