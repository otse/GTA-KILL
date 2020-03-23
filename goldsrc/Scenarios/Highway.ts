import Scenario from "./Scenario";
import Generators from "../Generators/Generators";
import PaintJobs from "../Cars/Paints";
import Data2 from "../Objects/Data";
import Datas from "../Objects/Datas";
import { Scenarios } from "./Scenarios";
import { carNames } from "../Cars/Script codes";
import WordBox from "../YM/Cutscene/Word box";
import TalkingHead from "../YM/Cutscene/Talking Heads";
import KILL from "../KILL";
import Cars from "../Cars/Cars";
import Points from "../Objects/Points";

export namespace HighWayWithEveryCar {

	export function init() {
		console.log('Highway with every car init');

		const load = function () {

			Generators.Fill.fill([-500, -500, -3], [1000, 1000, 0], { sty: 'sty/special/water/1.bmp' }, { WHEEL: false });

			Generators.Roads.highway(1, [10, -7000, 0], 8000, 4, 'qualityRoads');

			let x = .5;
			let y = 0;
			let j = 0;

			for (let name of carNames) {

				let car: Data2 = {
					type: 'Car',
					car: name,
					x: 10 + x,
					y: y + 7,
					z: 0
				}

				y--;
				j++;
				if (j > 15) {
					j = 0;
					// Begin spawning at new lane
					y = 0;
					x += 1;
				}

				Datas.deliver(car);
			}

			console.log('loaded bridge scenario');
		};

		let stage = 0;

		let talkingHead: TalkingHead;
		let wordBox: WordBox;

		let viewingCar;

		const update = function () {

			let currentCar = '';

			if (stage == 0) {
				talkingHead = new TalkingHead('johny_zoo');

				wordBox = new WordBox();
				wordBox.setText(`The highway has every car.\nI will tell you which.`, 1000);

				setTimeout(() => stage++, 5000);

				stage++;
			}

			else if (stage == 2) {
				let chunk = Datas.getChunk(KILL.ply.data);

				const carArray = Cars.getArray();

				let closest = 200;
				let closestCar = null;
				for (let car of carArray) {
					let dist = Points.dist(car.data, KILL.ply.data);
					if (dist < closest) {
						closest = dist;
						closestCar = car;
					}
				}

				if (closestCar != viewingCar) {
					viewingCar = closestCar;
					let d = closestCar.data;
					wordBox.setText(`${d.car},\n${PaintJobs.Enum[d.paint]} ${d.paint}`);
				}
			}

			talkingHead.update();
			wordBox.update();
		}

		let highwayWithEveryCar: Scenario = {
			name: 'Highway with every car',
			load: load,
			update: update
		}

		Scenarios.load(highwayWithEveryCar);
	};

}

export default HighWayWithEveryCar;