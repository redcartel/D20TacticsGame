import { VoxelDefinitions } from './assetLoaders';
import Map from '../lib/Map';
import Light from '../lib/Light';
import VoxelDefinition from '../lib/VoxelDefinition';

export const standardLights = (map) => {
    map.addLight(new Light('std1', 'directional', null, [22.5, 0, 0], 0.8));
    map.addLight(new Light('std2', 'directional', null, [22.5, 290, 0], 0.8));
}

export const grassPlain = () => {
    var _map = new Map([20, 1, 20]);
    for (var x = 0; x < 20; x++) {
        for (var z = 0; z < 20; z++) {
            _map.addVoxel([x, 0, z], VoxelDefinitions.grassDirt);
        }
    }
    //window._map.render();
    return _map;
}

export const walkObstacle = (xDim, zDim, map = null) => {
    var _map = new Map([xDim, 5, zDim]);
    for (var _x = 0; _x < xDim; _x++) {
        for (var _z = 0; _z < zDim; _z++) {
            var x = _x % 20;
            var z = _z % 20;
            if (x == 10 || z == 10 || x == 0 || z == 0) {
                if (x == 1 || x == 2 || x == 9 || x == 11 || x == 17 || x == 18 ||
                    z == 1 || z == 2 || z == 9 || z == 11 || z == 17 || z == 18) {
                    if (Math.random() > .3) _map.addVoxel([_x, 0, _z], VoxelDefinitions.stone);
                }
            }
            else if ((x == 4 || x == 14) && ((z > 2 && z < 8) || (z > 12 && z < 18))) {
                for (var y = 1; y < 3; y++) {
                    _map.addVoxel([_x, y, _z], VoxelDefinitions.dirt);
                }
            }
            else if ((x == 3 || x == 5 || x == 13 || x == 15) && (z == 13 || z == 17 || z == 7 || z == 3)) {
                if (Math.random() > .3) _map.addVoxel([_x, 1, _z], VoxelDefinitions.stone);
            }
            else {
                _map.addVoxel([_x, 0, _z], VoxelDefinitions.grassDirt);
            }
        }
    }
    return _map;
}

export const dungeonAlpha = (containingObject, xDim, zDim, depth = 5, options = {}) => {
    // var _map = containingObject['_map'] = new Map([xDim, depth, zDim]);
    // var roomFloor = options['roomFloor'] ?? VoxelDefinitions.stone;
    // var hallFloor = options['hallFloor'] ?? VoxelDefinitions.dirt;

    // function room(x, z, y, w, h) {
    //     if (x < 0) x = 0;
    //     if (y < 0) y = 0;

    //     if (x + w >= xDim) w = xDim - x - 1;
    //     if (w < 2) {
    //         w = 2;
    //         x = xDim - 3;
    //     }

    //     if (z + h >= zDim) h = zDim - z - 1;
    //     if (h < 2) {
    //         h = 2;
    //         z = zDim - 3;
    //     }
    //     for (var _x = x; _x < x + w; _x++) {
    //         for (var _z = z; _z < z + h; _z++) {
    //             for (var _y = 0; _y <= y; y++) {
    //                 _map.addVoxel([_x, _y, _z], roomFloor);
    //             }
    //         }
    //     }
    // }

    // var nRooms = Math.floor((xDim * zDim / 144) * Math.random()) + 4;
    // var wMax = xDim / 12 + 4;
    // var hMax = zDim / 12 + 4;
    // var potentialCorridors = [];

    // for (var n = 0; n < nRooms; n++) {
    //     var _x = Math.floor(Math.random() * xDim);
    //     var _z = Math.floor(Math.random() * zDim);
    //     var _y = Math.floor(Math.random() * depth); // TODO
    //     var _w = Math.floor(Math.random() * wMax / 2) + Math.ceil(wMax / 2);
    //     var _h = Math.floor(Math.random() * hMax / 2) + Math.ceil(hMax / 2);
    //     room(_x, _z, _y, _w, _h);
    //     var r = Math.floor(Math.random() * _w);
    //     potentialCorridors.push([_x + r, _y, _z]);
    //     var r = Math.floor(Math.random() * _w);
    //     potentialCorridors.push([_x + r, _y, _z + _h - 1]);
    //     var r = Math.floor(Math.random() * _h);
    //     potentialCorridors.push([_x, _y, _z + r]);
    //     var r = Math.floor(Math.random() * _h);
    //     potentialCorridors.push([_x + _w - 1, _y, _z + r]);
    // }
    // var tries = 0;
    // var successes = 0;
    // console.log(1);
    // while (successes < nRooms * 1.5 && tries < 100) {
    //     tries++;
    //     var coord1 = potentialCorridors[Math.floor(Math.random() * potentialCorridors.length)];
    //     var coord2 = potentialCorridors[Math.floor(Math.random() * potentialCorridors.length)];
    //     console.log('' + JSON.stringify(coord1) + ' to ' + JSON.stringify(coord2));
    //     var stepUp = false;
    //     var stepDown = false;
    //     if (coord2[1] > coord1[1]) stepUp = true;
    //     else if (coord1[1] > coord2[1]) stepDown = true;
    //     var path = _map.aStar(coord1, coord2, 2, true, stepUp, stepDown);
    //     console.log(JSON.stringify(path));
    //     if (!path || path.length <= 1) {
    //         continue;
    //     }
    //     var processedPath = [];
    //     for (var backwardsI = path.length - 2; backwardsI >= 0; backwardsI--) {
    //         var tryCoords = path[backwardsI];
    //         var block = _map.blocks[tryCoords[0]][tryCoords[1]][tryCoords[2]];
    //         if (block && block.name == roomFloor.name) {
    //             continue;
    //         }
    //         else {
    //             processedPath.push(tryCoords);
    //         }
    //     }
    //     if (processedPath.length === 0) {
    //         continue;
    //     }
    //     console.log('2');
    //     for (var coords of processedPath) {
    //         for (var y = 0; y <= coords[1]; y++) {
    //             _map.addVoxel([coords[0], y, coords[2]], hallFloor);
    //         }
    //     }

    //     successes++;
    // }

    // return _map;
}

function randomDoorLocation(room, xDim, zDim) {
    console.log(JSON.stringify(room));
    var y = room.y;
    var zSide1 = room.z + room.h + 1;
    if (zSide1 >= zDim) zSide1 = null;
    var xSide2 = room.x + room.w + 1;
    if (xSide2 >= xDim) xSide2 = null;
    var zSide3 = room.z - 1;
    if (zSide3 < 0) zSide3 = null;
    var xSide4 = room.x - 1;
    if (xSide4 < 0) xSide4 = null;
    var tries = 0;
    var res;
    while (tries < 20) {
        tries++;
        var r = Math.floor(Math.random() * (2 * room.w + 2 * room.h));

        if (r < room.w) {
            if (zSide1 == null) continue;
            res = [r + room.x, y, zSide1];
        }
        else if (r < room.w + room.h) {
            r -= room.w;
            if (xSide2 == null) continue;
            res = [xSide2, y, r + room.z];
        }
        else if (r < room.w + room.h + room.w) {
            r = r - room.w - room.h;
            if (zSide3 == null) continue;
            res = [r + room.x, y, zSide3];
        }
        else {
            r = r - room.w - room.h - room.w;
            if (xSide4 == null) continue;
            res = [xSide4, y, r + room.z];
        }
    }
    console.log(JSON.stringify(res));
    return res;
}

function fillRoom(map, room, voxelDef, raised = true) {
    console.log('fill room ' + JSON.stringify(room));
    for (var x = room.x; x < room.x + room.w; x++) {
        for (var z = room.z; z < room.z + room.h; z++) {
            if (!raised) {
                map.addVoxel([x, room.y, z], voxelDef);
            }
            else {
                for (var y = 0; y <= room.y; y++) {
                    map.addVoxel([x, y, z], voxelDef);
                }
            }
        }
    }
}

function fillCorridor(map, corridor, voxelDef, raised) {
    for (var coords of corridor) {
        if (raised) {
            for (var y = 0; y <= coords[1]; y++) {
                map.addVoxel([coords[0], y, coords[2]], voxelDef);
            }
        }
        else {
            map.addVoxel(coords, voxelDef);
        }
    }
}

export function dungeon1(xDim, yDim, zDim, lights = false) {
    console.log('dungeon1');
    var map = new Map([xDim, yDim, zDim]);
    var rooms = [];
    var corridors = [];
    var nRooms = Math.ceil(Math.random() * (xDim * zDim / 144)) + 3;
    var xMin = Math.ceil(xDim / 6);
    var zMin = Math.ceil(zDim / 6);
    var xMax = Math.ceil(xDim / 4);
    var zMax = Math.ceil(zDim / 4)
    console.log('1');
    for (var i = 0; i < nRooms; i++) {
        var y = Math.floor(Math.random() * yDim);
        var w = Math.floor(Math.random() * (xMax - xMin)) + xMin;
        var h = Math.floor(Math.random() * (zMax - zMin)) + xMin;
        var x = Math.floor(Math.random() * (xDim - w));
        var z = Math.floor(Math.random() * (zDim - h));
        rooms.push({
            x: x,
            y: y,
            z: z,
            h: h,
            w: w
        });
    }
    for (var i = 0; i < rooms.length - 1; i++) {
        var room1 = rooms[i];
        for (var j = 0; j < 2; j++) {
            var room2 = rooms[i + 1]; 
            var hallStart = randomDoorLocation(room1, xDim, zDim);
            var hallStop = randomDoorLocation(room2, xDim, zDim);
            var stepUp = false;
            var stepDown = false;
            if (hallStop[1] > hallStart[1]) stepUp = true;
            else if (hallStart[1] > hallStop[1]) stepDown = true;
            console.log('astar');
            var path = map.aStar(hallStart, hallStop, 2, true, stepUp, stepDown);
            corridors.push(path);
        }
    }
    console.log('4');
    for (var corridor of corridors) {
        fillCorridor(map, corridor, VoxelDefinitions.dirt, true);
    }
    console.log('5');
    for (var room of rooms) {

        fillRoom(map, room, VoxelDefinitions.stone, true);
    }
    return map;
}