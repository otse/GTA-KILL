import Datas from "../Objects/Datas";
import Points from "../Objects/Points";
import Sprites from "../Sprites/Sprites";
export var Gen2;
(function (Gen2) {
    // To swap tile at ply in console
    // ~ Deline__.edit([Math.floor(ply.data.x), Math.floor(ply.data.y), 0], 'sideDash')
    function getDataOfType(w, type) {
        let point = { x: w[0], y: w[1], z: w[2] };
        let chunk = Datas.getChunk(point);
        for (let data of chunk.datas) {
            if (data.type != type)
                continue;
            if (Points.different(data, point))
                continue;
            return data;
        }
    }
    Gen2.getDataOfType = getDataOfType;
    function swap(w, assign) {
        let point = { x: w[0], y: w[1] };
        let chunk = Datas.getChunk(point);
        for (let data of chunk.datas) {
            if ('Surface' != data.type)
                continue;
            if (Points.different(data, point))
                continue;
            Object.assign(data, assign);
            console.log('Deline Swap complete');
            // Rebuild idiom
            chunk.remove(data);
            chunk.add(data);
            break;
        }
    }
    Gen2.swap = swap;
    let GenPlaza;
    (function (GenPlaza) {
        function fill(w, width, height, sty = 'sty/floors/blue/256.bmp') {
            //const lanes = 1;
            let x = 0;
            for (; x < width; x++) {
                let y = 0;
                for (; y < height; y++) {
                    let pav = {
                        type: 'Surface',
                        //sheet: 'yellowyPavement',
                        //square: 'middle',
                        sty: sty,
                        x: x + w[0],
                        y: y + w[1],
                        z: w[2],
                    };
                    Datas.deliver(pav);
                }
            }
        }
        GenPlaza.fill = fill;
    })(GenPlaza = Gen2.GenPlaza || (Gen2.GenPlaza = {}));
    let GenDeline;
    (function (GenDeline) {
        function simple(w, width, height) {
            let chunked = [];
            let x = 0;
            for (; x < width; x++) {
                let y = 0;
                for (; y < height; y++) {
                    let point = { x: w[0] + x, y: w[1] + y };
                    let chunk = Datas.getChunk(point);
                    for (let data of chunk.datas) {
                        if ('Surface' != data.type)
                            continue;
                        if (Points.different(data, point))
                            continue;
                        if (data.sprite == Sprites.Roads.sideLine) {
                            data.sprite = Sprites.Roads.sideClear;
                        }
                        if (data.sprite == Sprites.Roads.convexLine)
                            data.sprite = Sprites.Roads.convex;
                        if (data.sprite == Sprites.Roads.sideStopLine) {
                            data.sprite = Sprites.Roads.sideStop;
                        }
                    }
                }
            }
        }
        GenDeline.simple = simple;
        function horz(w, width, height) {
            let chunked = [];
            let x = 0;
            for (; x < width; x++) {
                let y = 0;
                for (; y < height; y++) {
                    let point = { x: w[0] + x, y: w[1] + y };
                    let chunk = Datas.getChunk(point);
                    //if (chunked.includes(chunk))
                    //continue;
                    //chunked.push(chunk);
                    for (let data of chunk.datas) {
                        if ('Surface' != data.type)
                            continue;
                        if (Points.different(data, point))
                            continue;
                        if (data.sprite == Sprites.Roads.sideLine) {
                            data.sprite = Sprites.Roads.sideClear;
                            if (point.x == w[0] || point.x == w[0] + width - 1) {
                                data.sprite = Sprites.Roads.sideDash;
                                if (point.x == w[0] + width - 1 && point.y == w[1])
                                    data.f = true;
                                if (point.x == w[0] && point.y == w[1] + height - 1)
                                    data.f = true;
                            }
                        }
                        if (data.sprite == Sprites.Roads.convexLine)
                            data.sprite = Sprites.Roads.convex;
                        if (data.sprite == Sprites.Roads.sideStopLine) {
                            data.sprite = Sprites.Roads.sideStop;
                        }
                    }
                }
            }
        }
        GenDeline.horz = horz;
        function EditMultiple(w, width, height, square_a, square_b) {
            let chunked = [];
            let x = 0;
            for (; x < width; x++) {
                let y = 0;
                for (; y < height; y++) {
                    let point = { x: w[0] + x, y: w[1] + y };
                    let chunk = Datas.getChunk(point);
                    //if (chunked.includes(chunk))
                    //continue;
                    //chunked.push(chunk);
                    for (let data of chunk.datas) {
                        if ('Surface' != data.type)
                            continue;
                        if (Points.different(data, point))
                            continue;
                        if (data.sprite == Sprites.Roads.sideLine)
                            data.sprite = Sprites.Roads.sideClear;
                        else if (data.sprite == Sprites.Roads.sideStopLine)
                            data.sprite = Sprites.Roads.sideStop;
                    }
                }
            }
        }
        GenDeline.EditMultiple = EditMultiple;
    })(GenDeline = Gen2.GenDeline || (Gen2.GenDeline = {}));
    let GenPavements;
    (function (GenPavements) {
        function fill(w, width, height) {
            //const lanes = 1;
            let x = 0;
            for (; x < width; x++) {
                let y = 0;
                for (; y < height; y++) {
                    let pav = {
                        type: 'Surface',
                        sheet: 'yellowyPavement',
                        sprite: Sprites.Pavements.middle,
                        //sty: 'sty/floors/blue/256.bmp',
                        x: x + w[0],
                        y: y + w[1],
                        z: w[2],
                    };
                    Datas.deliver(pav);
                }
            }
        }
        GenPavements.fill = fill;
        function vert(x, y, z, segs, lanes) {
            //const lanes = 1;
            let seg = 0;
            for (; seg < segs; seg++) {
                let lane = 0;
                for (; lane < lanes; lane++) {
                    let pav = {
                        type: 'Surface',
                        sheet: 'yellowyPavement',
                        sprite: Sprites.Pavements.middle,
                        //sty: 'sty/floors/blue/256.bmp',
                        x: lane + x,
                        y: seg + y,
                        z: 0
                    };
                    Datas.deliver(pav);
                }
            }
        }
        GenPavements.vert = vert;
        function Horz(x, y, z, segs, lanes) {
            //const lanes = 1;
            let seg = 0;
            for (; seg < segs; seg++) {
                let lane = 0;
                for (; lane < lanes; lane++) {
                    let pav = {
                        type: 'Surface',
                        sheet: 'yellowyPavement',
                        sprite: Sprites.Pavements.middle,
                        //sty: 'sty/floors/blue/256.bmp',
                        x: seg + y,
                        y: lane + x,
                        z: 0
                    };
                    Datas.deliver(pav);
                }
            }
        }
        GenPavements.Horz = Horz;
    })(GenPavements = Gen2.GenPavements || (Gen2.GenPavements = {}));
})(Gen2 || (Gen2 = {}));
export default Gen2;