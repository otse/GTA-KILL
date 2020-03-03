import Rectangle from "./Rectangle";

import Four from "../Four";
import { default as THREE, Clock, Scene } from 'three';

// "C API" LOL
export namespace Rectangles {

	export function init() {

	}

	export function show(rectangle: Rectangle) {
		console.log('Rectangles add ' + rectangle.data.type);

		Four.scene.add(rectangle.mesh);
		Four.scene.add(rectangle.meshShadow);
	}

	export function hide(rectangle: Rectangle) {
		Four.scene.remove(rectangle.mesh);
		Four.scene.remove(rectangle.meshShadow);
	}
}

export default Rectangles;