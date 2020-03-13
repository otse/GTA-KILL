import { Texture, MeshPhongMaterial, PlaneBufferGeometry, Mesh, MeshBasicMaterial, RepeatWrapping } from "three";
import Four from "../Four";
import Util from "../Random";
import Chunk from "../Chunks/Chunk";
import Chunks from "../Chunks/Chunks";
import Points from "../Objects/Points";

namespace Mist {

	let material: MeshPhongMaterial
	let geometry: PlaneBufferGeometry
	let mesh: Mesh

	let x, y;

	export function init() {
		x = 0;
		y = 0;
		const w = 5;

		geometry = new PlaneBufferGeometry(Chunks.tileSpan * 64 * w, Chunks.tileSpan * 64 * w, 1, 1);

		let perlin = Util.loadTexture('sty/perlin_1.png')
		perlin.wrapS = RepeatWrapping;
		perlin.wrapT = RepeatWrapping;
		perlin.repeat.set(w, w);

		material = new MeshPhongMaterial({
			map: perlin,
			color: 0x93e5ff,
			transparent: true,
			opacity: .3,
			depthWrite: false
		});

		mesh = new Mesh(geometry, material);

		Four.scene.add(mesh);
	}

	function normalize(n: number): number {
		if (n > 1)
			n -= 1;
		if (n < 0)
			n += 1;
		return n;
	}

	export function update() {
		
		let w = Four.camera.position;

		let chunkSize = Chunks.tileSpan * 64;

		let tiled = Points.floor2(w.x / 64, w.y / 64);

		let p = Points.region(tiled, Chunks.tileSpan);

		mesh.position.set(p.x * chunkSize, p.y * chunkSize, 5);

		x += Four.delta / 18;
		y += Four.delta / 55;
		material.map.offset.set(x, y);

		x = normalize(x);
		y = normalize(y);
	}

}

export default Mist;