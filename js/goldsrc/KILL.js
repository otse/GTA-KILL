import City from "./Chunks/City";
import Ply from "./Pawns/Ply";
import Phong2 from "./Shaders/Phong2";
import Rectangles from "./Objects/Rectangles";
import Surfaces from "./Objects/Shapes/Surfaces";
import Blocks from "./Objects/Shapes/Blocks";
import BoxCutter from "./Objects/Shapes/Box cutter";
import Sprites from "./Sprites/Sprites";
import Sheets from "./Sprites/Sheets";
import Zoom from "./Unsorted/Zoom";
import { Shift } from "./Unsorted/Shift";
import HighWayWithEveryCar from "./Scenarios/Highway";
import BridgeScenario from "./Scenarios/Bridge";
import Scenarios from "./Scenarios/Scenarios";
import Fonts from "./YM/Fonts";
import Water from "./Unsorted/Water";
import Mist from "./Unsorted/Mist";
import Cars from "./Cars/Cars";
import YM from "./YM/You me";
export var KILL;
(function (KILL) {
    var started = false;
    let RESOURCES;
    (function (RESOURCES) {
        RESOURCES[RESOURCES["UNDEFINED_OR_INIT"] = 0] = "UNDEFINED_OR_INIT";
        RESOURCES[RESOURCES["FONT_WHITE"] = 1] = "FONT_WHITE";
        RESOURCES[RESOURCES["FONT_YELLOW"] = 2] = "FONT_YELLOW";
        RESOURCES[RESOURCES["FONT_MISSION"] = 3] = "FONT_MISSION";
        RESOURCES[RESOURCES["SPRITES"] = 4] = "SPRITES";
        RESOURCES[RESOURCES["COUNT"] = 5] = "COUNT";
    })(RESOURCES = KILL.RESOURCES || (KILL.RESOURCES = {}));
    ;
    let resources_loaded = 0b0;
    function resourced(word) {
        resources_loaded |= 0b1 << RESOURCES[word];
        try_start();
    }
    KILL.resourced = resourced;
    function try_start() {
        let count = 0;
        let i = 0;
        for (; i < RESOURCES.COUNT; i++)
            (resources_loaded & 0b1 << i) ? count++ : void (0);
        if (count == RESOURCES.COUNT)
            start();
    }
    function critical(mask) {
        // Couldn't load
        console.error('resource', mask);
    }
    KILL.critical = critical;
    function init() {
        console.log('kill init');
        resourced('UNDEFINED_OR_INIT');
        Phong2.rig();
        Rectangles.init();
        Surfaces.init();
        Blocks.init();
        BoxCutter.init();
        Cars.init();
        Sprites.init();
        Sheets.init();
        YM.init();
        Fonts.init();
        Water.init();
        Mist.init();
        Shift.init();
        KILL.city = new City;
        window.KILL = KILL;
    }
    KILL.init = init;
    function start() {
        if (started)
            return;
        console.log('kill starting');
        started = true;
        if (window.location.href.indexOf("#highway") != -1)
            HighWayWithEveryCar.init();
        else
            BridgeScenario.init();
        let data = {
            type: 'Ply',
            //remap: 16,
            x: 10.5,
            y: 1,
            z: 0
        };
        //data.remap = [40, 46, 47, 49, 50, 51][Math.floor(Math.random() * 6)];
        KILL.ply = new Ply(data);
        KILL.city.chunkList.get2(0, 0);
        KILL.city.chunkList.get2(0, 1);
    }
    KILL.start = start;
    function update() {
        if (!started)
            return;
        if (KILL.ply)
            KILL.ply.update();
        Water.update();
        Mist.update();
        Zoom.update();
        Scenarios.update();
        KILL.city.update(KILL.ply.data);
    }
    KILL.update = update;
})(KILL || (KILL = {}));
export default KILL;
