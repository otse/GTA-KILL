import { Data2, Object2, Block, Surface } from "@app/defs";

export namespace Objects {
	function Factory(data: Data2): Object2 | null {

		switch (data.type) {
			//case 'Ped': return new Ped(data);
			//case 'Player': return new Player(data);

			//case 'Car': return new Car(data);
			case 'Block': return new Block(data);
			case 'Surface': return new Surface(data);
			//case 'Lamp': return new Lamp(data);

			default:
				return null;
		}
	}

	export function MakeNullable(data: Data2): Object2 | null {
		if (data.object2)
			console.warn('Data has object2');

		let object = Factory(data);

		if (!object)
			console.warn('Object2 not typable');
			
		data.object2 = object;

		return object || null;
	}
}

export default Objects;