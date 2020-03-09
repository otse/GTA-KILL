import Data2 from "../Objects/Data";
import Datas from "../Objects/Datas";
import StagingArea from "./Staging area";

import Cars from "../Cars/Cars";
import Sprites from "../Sprites/Sprites";

export namespace Generators {

	type RoadMode = 'Normal' | 'Adapt';

	export var roadMode: RoadMode = 'Normal';

	export type Truple = [number, number, number];

	export enum Axis {
		Horz = 0,
		Vert = 1
	}

	export function invert(
		data: Data2,
		axis: Axis,
		w: [number, number, number]
	) {
		let x = data.x;
		let y = data.y;
		data.x = axis ? y : x;
		data.y = axis ? x : y;
		data.r = axis;
		data.x += w[0];
		data.y += w[1];
	}

	export function loop(
		min: [number, number, number],
		max: [number, number, number],
		func: (w: [number, number, number]) => any) {

		let x = 0;
		for (; x < max[0]; x++) {
			let y = 0;
			for (; y < max[1]; y++) {
				let z = 0;
				for (; z < max[2]; z++) {

					func([min[0] + x, min[1] + y, min[2] + z]);

				}
			}
		}
	}

	export namespace Flats {

		type Faces = [string, string, string, string, string];

		export const blueMetal: Faces = [
			'sty/metal/blue/340.bmp',
			'sty/metal/blue/340.bmp',
			'sty/metal/blue/340.bmp',
			'sty/metal/blue/340.bmp',
			'sty/metal/blue/340.bmp'];

		const roofFunc = (
			block: Data2,
			w: [number, number, number],
			min: [number, number, number],
			max: [number, number, number]) => {

			if (w[2] == max[2] - min[2] - 1) {
				block.faces![4] = 'sty/roofs/green/793.bmp';

				if (w[0] == min[0] && w[1] == min[1]) { // lb
					block.faces![4] = 'sty/roofs/green/784.bmp';
					block.r = 3;
				}
				else if (w[0] == min[0] + max[0] - 1 && w[1] == min[1] + max[1] - 1) { // rt
					block.faces![4] = 'sty/roofs/green/784.bmp';
					block.f = true;
					block.r = 0;
				}
				else if (w[0] == min[0] && w[1] == min[1] + max[1] - 1) { // lt
					block.faces![4] = 'sty/roofs/green/784.bmp';
					block.r = 0;
				}
				else if (w[0] == min[0] + max[0] - 1 && w[1] == min[1]) { // rb
					block.faces![4] = 'sty/roofs/green/784.bmp';
					block.r = 2;
				}

				else if (w[0] == min[0]) {
					block.faces![4] = 'sty/roofs/green/790.bmp';
					block.r = 1;
				}
				else if (w[1] == min[1] + max[1] - 1) {
					block.faces![4] = 'sty/roofs/green/790.bmp';
					block.f = true;
					block.r = 2;
				}
				else if (w[0] == min[0] + max[0] - 1) {
					block.faces![4] = 'sty/roofs/green/790.bmp';
					block.r = 3;
				}
				else if (w[1] == min[1]) {
					block.faces![4] = 'sty/roofs/green/790.bmp';
					block.r = 0;
				}
			}
		}

		export function type1(
			min: [number, number, number],
			max: [number, number, number],
		) {

			const func = (w: [number, number, number]) => {

				let bmp = 'sty/metal/blue/340.bmp';

				let block: Data2 = {
					type: 'Block',
					x: w[0],
					y: w[1],
					z: w[2]
				};

				block.faces = [];

				if (
					w[0] > min[0] &&
					w[0] < min[0] + max[0] - 1 &&
					w[1] > min[1] &&
					w[1] < min[1] + max[1] - 1 &&
					w[2] < min[2] + max[2] - 1
				)
					return;

				roofFunc(block, w, min, max);

				if (w[0] == min[0])
					block.faces[1] = bmp;
				if (w[1] == min[1] + max[1] - 1)
					block.faces[2] = bmp;
				if (w[0] == min[0] + max[0] - 1)
					block.faces[0] = bmp;
				if (w[1] == min[1])
					block.faces[3] = bmp;

				Datas.deliver(block);
			}

			Generators.loop(min, max, func);
		}

	}

	export namespace Roads {

		export type Strings = 'badRoads' | 'greenRoads' | 'mixedRoads' | 'greyRoads' | 'greyRoadsMixed';

		export function oneway(
			axis: 0 | 1,
			w: [number, number, number], segs: number, sheet: Strings
		) {
			let staging = new StagingArea;

			let seg = 0;
			for (; seg < segs; seg++) {

				let road: Data2 = {
					type: 'Surface',
					sheet: sheet,
					sprite: Sprites.ROADS.SINGLE,
					x: w[0],
					y: seg + w[1],
					z: w[2],
					r: 3
				};

				road.adapt_sheet = roadMode == 'Adapt';

				if (!seg || seg == segs - 1) {
					road.sprite = Sprites.ROADS.SINGLE_OPEN;

					if (!seg)
						road.r! += 1;

					else if (seg == segs - 1)
						road.r! -= 1;
				}

				staging.addData(road);
			}

			if (axis == 0)
				staging.ccw(1);

			staging.deliverReplace();
		}

		export function twolane(
			axis: 0 | 1,
			w: [number, number, number], segs: number, sheet: Strings
		) {
			let staging = new StagingArea;

			const lanes = 2;

			let seg = 0;
			for (; seg < segs; seg++) {

				let lane = 0;
				for (; lane < lanes; lane++) {

					let road: Data2 = {
						type: 'Surface',
						sheet: sheet,
						sprite: Sprites.ROADS.SIDE_LINE,
						x: seg + w[0],
						y: lane + w[1],
						z: 0,
						r: !lane ? 2 : 0
					};

					if (!seg || seg == segs - 1) {
						road.sprite = Sprites.ROADS.CONVEX_LINE;

						road.adapt_sheet = roadMode == 'Adapt';

						if (!seg && lane ||
							seg == segs - 1 && !lane)
							road.r! += 1;
					}

					else if (lane == lanes - 1 && seg == 1 ||
						!lane && seg == segs - 2) {
						road.sprite = Sprites.ROADS.SIDE_STOP_LINE; // sideStopLine
						road.f = true;
					}

					staging.addData(road);
				}
			}

			if (axis == 1)
				staging.ccw(1);

			staging.deliverReplace();
		}

		export function highway(
			axis: 0 | 1,
			w: [number, number, number], segs: number, lanes: number,
			sheet: Strings
		) {
			let staging = new StagingArea;

			let seg = 0;
			for (; seg < segs; seg++) {

				let lane = 0;
				for (; lane < lanes; lane++) {

					let road: Data2 = {
						type: 'Surface',
						sheet: sheet,
						sprite: Sprites.ROADS.SIDE_LINE,
						x: lane + w[0],
						y: seg + w[1],
						z: 0,
						r: !lane ? 3 : 1
					};

					if (lane > 0 && lane < lanes - 1)
						road.sprite = Sprites.ROADS.MIDDLE_TRACKS;

					else if (!seg || seg == segs - 1) {
						road.sprite = Sprites.ROADS.CONVEX_LINE;

						if (!seg && !lane ||
							seg == segs - 1 && lane)
							road.r! += 1;
					}

					/*else if (lane == lanes - 1 && seg == 1 ||
						!lane && seg == segs - 2) {
						road.square = 'sideStopLine';
					}*/

					staging.addData(road);
				}
			}

			if (axis == 0)
				staging.ccw(1);

			staging.deliverReplace();
		}

	}

	export namespace Parking {

		export function onewayRight(
			w: [number, number, number], segs: number, lanes: number, sheet: Roads.Strings) {

			let staging = new StagingArea;

			if (lanes < 2)
				console.warn('onewayRightVert less than 2 lanes');

			let seg = 0;
			for (; seg < segs; seg++) {

				let lane = 0;
				for (; lane < lanes; lane++) {

					let road: Data2 = {
						type: 'Surface',
						sheet: sheet,
						sprite: Sprites.ROADS.SIDE_CLEAR,
						x: lane + w[0],
						y: seg + w[1],
						z: w[2],
						r: !lane ? 3 : 1
					};

					let parkedCar: Data2 = {
						type: 'Car',
						carName: Cars.GetRandomName(),
						x: road.x,
						y: road.y,
						z: road.z
					};

					let parkHere = false;

					if (!seg || seg == segs - 1) {
						if (!lane) {
							road.sprite = Sprites.ROADS.SINGLE_OPEN;

							road.adapt_sheet = roadMode == 'Adapt';

							if (!seg)
								road.r! += 1;

							else if (seg == segs - 1)
								road.r! -= 1;
						}
						else {
							//road.square = 'sideLine';
							//road.r = !seg ? 0 : 2;
							continue; // Skip
						}
					}

					else if (seg == 1 || seg == segs - 2) {
						if (!lane) {
							road.sprite = Sprites.ROADS.CUSTOM_NOTCH;

							road.r = 1;

							if (seg == 1)
								road.f = true;
						}
						else if (lane == lanes - 1) {
							road.sprite = Sprites.ROADS.CORNER;
							road.r = seg == 1 ? 0 : 3;

							if (seg != 1) {
								parkedCar.r = Math.PI / 4;
								parkedCar.x = road.x + .5;
								parkedCar.y = road.y - .11;

								parkHere = true;
							}
						}
						else {
							road.r = seg == 1 ? 2 : 0;
						}
					}

					else if (lane) {
						if (lane == lanes - 1) {
							road.sprite = Sprites.ROADS.PARKING_SPOT;

							parkedCar.r = Math.PI / 4;
							parkedCar.x = road.x + .5;
							parkedCar.y = road.y - .11;
							parkHere = true;
						}
						else
							road.sprite = Sprites.ROADS.CLEAR;
					}

					if (parkHere && Math.random() < .75)
						staging.addData(parkedCar);

					staging.addData(road);
				}
			}

			staging.deliverReplace();
		}

		export function leftBigHorz(
			w: [number, number, number], segs: number, lanes: number, sheet: Roads.Strings) {

			let staging = new StagingArea;

			lanes = 4;

			let seg = 0;
			for (; seg < segs; seg++) {

				let lane = 0;
				for (; lane < lanes; lane++) {

					let road: Data2 = {
						type: 'Surface',
						sheet: sheet,
						sprite: Sprites.ROADS.SIDE_LINE,
						x: seg + w[0],
						y: lane + w[1],
						z: w[2],
						r: 1
					};

					let parkedCar: Data2 = {
						type: 'Car',
						carName: Cars.GetRandomName(),
						x: road.x,
						y: road.y,
						z: road.z
					};

					let parkHere = false;

					if (!seg) {
						road.adapt_sheet = roadMode == 'Adapt';

						if (lane == 1) {
							road.sprite = Sprites.ROADS.CONVEX_LINE;
							road.r! += 1;
						}
						else if (lane == 2) {
							road.sprite = Sprites.ROADS.CONVEX_LINE;
						}
						else {
							continue;
						}
					}
					else if (seg == 1) {
						if (lane == 1) {
							road.sprite = Sprites.ROADS.SIDE_LINE;
							road.r! += 1;
						}
						else if (lane == 2) {
							road.sprite = Sprites.ROADS.SIDE_LINE;
							road.r! -= 1;
						}
						else {
							continue;
						}
					}
					else if (seg == 2) {
						if (lane == 0) {
							road.sprite = Sprites.ROADS.CORNER;

							parkHere = true;
							parkedCar.r = Math.PI / 4;
							parkedCar.x = road.x + 0.5 + 0.6;
							parkedCar.y = road.y + 0.5;

						}
						else if (lane == 1) {
							road.sprite = Sprites.ROADS.CONVEX_LINE;
							road.r! += 2;
						}
						else if (lane == 2) {
							road.sprite = Sprites.ROADS.CONVEX_LINE;
							road.r! -= 1;

						}
						else if (lane == 3) {
							road.sprite = Sprites.ROADS.CORNER;
							road.r! += 1;

							parkHere = true;
							parkedCar.r = Math.PI - Math.PI / 4;
							parkedCar.x = road.x + 0.5 + 0.6;
							parkedCar.y = road.y + 0.5;
						}
					}
					else if (seg == segs - 1) {
						if (lane == 0) {
							road.sprite = Sprites.ROADS.CORNER;
							road.r! -= 1;
						}
						else if (lane == 3) {
							road.sprite = Sprites.ROADS.CORNER;
							road.r! += 2;
						}
						else {
							road.sprite = Sprites.ROADS.SIDE_CLEAR;
						}

					}
					else if (lane == 1 || lane == 2) {
						road.sprite = Sprites.ROADS.CLEAR;
					}
					else if (lane != 1) {
						road.sprite = Sprites.ROADS.PARKING_SPOT;

						parkHere = true;

						// Bottom
						if (!lane) {
							road.r! += 1;
							road.f = true;

							parkedCar.r = Math.PI / 4;
							parkedCar.x = road.x + 0.5 + 0.6;
							parkedCar.y = road.y + 0.5;
						}
						// Top
						else {
							road.r! -= 1;

							parkedCar.r = Math.PI - Math.PI / 4;
							parkedCar.x = road.x + 0.5 + 0.6;
							parkedCar.y = road.y + 0.5;
						}

					}

					if (parkHere && Math.random() > .5)
						staging.addData(parkedCar);

					staging.addData(road);
				}
			}

			staging.deliverReplace();
		}

	}

	export namespace Fill {

		interface Extras {
			RANDOM_ROTATION?: boolean;
		}

		export function fill(
			w: [number, number, number],
			width, height, object: object, extras: Extras = {}
			) {

			let staging = new StagingArea;
	
			//const lanes = 1;
	
			let x = 0;
			for (; x < width; x++) {
	
				let y = 0;
				for (; y < height; y++) {
	
					let pav: Data2 = {
						type: 'Surface',
						//sheet: 'yellowyPavement',
						//square: 'middle',
						x: x + w[0],
						y: y + w[1],
						z: w[2],
					};
					
					Object.assign(pav, object);

					if (extras.RANDOM_ROTATION)
						pav.r = Math.floor(Math.random() * 4);
	
					staging.addData(pav);
				}
			}
			
			staging.deliverReplace();
		}
	
	}

	export namespace Pavements {

		export function fill(
			w: [number, number, number],
			width, height) {
	
			//const lanes = 1;
	
			let x = 0;
			for (; x < width; x++) {
	
				let y = 0;
				for (; y < height; y++) {
	
					let pav: Data2 = {
						type: 'Surface',
						sheet: 'yellowyPavement',
						sprite: Sprites.PAVEMENTS.MIDDLE,
						//sty: 'sty/floors/blue/256.bmp',
						x: x + w[0],
						y: y + w[1],
						z: w[2],
					};
	
					Datas.deliver(pav);
				}
			}
			
		}
	
		export function vert(x, y, z, segs, lanes) {
	
			//const lanes = 1;
	
			let seg = 0;
			for (; seg < segs; seg++) {
	
				let lane = 0;
				for (; lane < lanes; lane++) {
	
					let pav: Data2 = {
						type: 'Surface',
						sheet: 'yellowyPavement',
						sprite: Sprites.PAVEMENTS.MIDDLE,
						//sty: 'sty/floors/blue/256.bmp',
						x: lane + x,
						y: seg + y,
						z: 0
					};
	
					Datas.deliver(pav);
	
				}
			}
		}
	
		export function Horz(x, y, z, segs, lanes) {
	
			//const lanes = 1;
	
			let seg = 0;
			for (; seg < segs; seg++) {
	
				let lane = 0;
				for (; lane < lanes; lane++) {
	
					let pav: Data2 = {
						type: 'Surface',
						sheet: 'yellowyPavement',
						sprite: Sprites.PAVEMENTS.MIDDLE,
						//sty: 'sty/floors/blue/256.bmp',
						x: seg + y,
						y: lane + x,
						z: 0
					};
					
					Datas.deliver(pav);
	
				}
			}
		}
		
	}

}

export default Generators;