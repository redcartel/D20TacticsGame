import { VoxelDefinitions } from './assetLoaders';
import Map from '../lib/Map';
import Light from '../lib/Light';
import VoxelDefinition from '../lib/VoxelDefinition';
import VoxelMap from '../lib/VoxelMap';
import Decal from '../lib/Decal';

export const standardLights = (map) => {
    map.addLight(new Light('std1', 'directional', null, [22.5, 0, 0], 0.8));
    map.addLight(new Light('std2', 'directional', null, [22.5, 290, 0], 0.8));
}

export const grassPlain = () => {
    var _map = new Map([20, 1, 20]);
    for (var x = 0; x < 20; x++) {
        for (var z = 0; z < 20; z++) {
            _map.addVoxel([x, 0, z], VoxelDefinitions.grassDirt);
            if (z == 10 && x % 2 == 0) {
                placeWall([x, 0, z], 3, 1);
            }
        }
    }
    return _map;
}

var walls = {};

function placeWall(pos, height, side) {
    var [x, y, z] = pos;
    var [px, py, pz] = pos;
    y = y / 2;
    height = height / 2;
    y = y + height / 2;
    var r = 0;
    if (side == 1) {
        z = z + .5;
    }
    else if (side == 2) {
        x = x + .5;
        r = 90;
    }
    else if (side == 3) {
        z = z - .5;
        r = 180;
    }
    else if (side == 4) {
        x = x - .5;
        r = 270;
    }
    var wallDecal = new Decal(Math.random() + '', null, false);
    wallDecal.place([x, y, z], [0, r, 0], [1, height, 0]);
    walls[[px, py, pz, side]] = wallDecal;
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
                    if (Math.random() > .3) {
                        _map.addVoxel([_x, 0, _z], VoxelDefinitions.stone);
                    }
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

        // for (var i = 1; i < 4; i++) {
        //     _map.addVoxel([4, 4, 9], null);
        //     _map.addVoxel([5, 4, 9], null);
        //     _map.addVoxel([6, 4, 9], null);
        //     _map.addVoxel([7, 4, 9], null);
        //     _map.addVoxel([8, 4, 9], null);
        //     _map.addVoxel([9, 4, 9], null);
        // }

    }
    return _map;
}

function randomDoorLocation(room, xDim, zDim) {
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
    return res;
}

function doorOnSide(map, room, facing) {
    var r;
    if (facing == 1 || facing == 3) r = Math.floor(Math.random() * room.w);
    else r = Math.floor(Math.random() * room.h);
    if (facing == 1) {
        return [room.x + r, room.y, room.z + room.h];
    }
    else if (facing == 2) {
        return [room.x];
    }
}

function fillRoom(map, room, voxelDef, raised = true) {
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
    console.log('fillCorridor');
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

export function voxDungeon(dimensions, lights = false) {
    var [xDim, yDim, zDim] = dimensions;
    var xSlice = Math.max(Math.floor(xDim / 10), 1);
    var zSlice = Math.max(Math.floor(Math.floor(zDim / 10), 2));
    var xMax = Math.min(8, xDim);
    var zMax = Math.min(8, zDim);
    var xMin = Math.min(3, xDim);
    var zMin = Math.min(3, zDim);
    var rooms = [];
    var roomConnected = [];
    for (var rowNum = 0; rowNum < xSlice; rowNum++) {
        var row = [];
        var connectRow = [];
        for (var colNum = 0; colNum < zSlice; colNum++) {
            var w = Math.floor(Math.random() * (xMax - xMin) + xMin);
            var h = Math.floor(Math.random() * (zMax - zMin) + zMin);
            row.append({
                x: 10 * colNum + Math.floor(Math.random() * (8 - w)) + 1,
                z: 10 * rowNum + Math.floor(Math.random() * (8 - w)) + 1,
                w: w,
                h: h,
                y: Math.floor(Math.random() * yDim)
            });
            fillRoom(map, row[row.length - 1], VoxelDefinitions.stone);
            connectRow.append(false);
        }
        rooms.append(row);
        roomConnected.append(connectRow);
    }
    while (1) {
        var any = false;
        for (var rowNum = 0; rowNum < xSlice; rowNum++) {
            //for (var colNum = 0; colNum < )
        }
    }
}

export function fourRooms() {
    var map = new Map([20, 1, 20]);
    for (var x = 0; x < 20; x++) {
        for (var z = 0; z < 20; z++) {
            if (x == 10 && (z == 5 || z == 15)) {
                map.addVoxel([x, 0, z], VoxelDefinitions.dirt);
                placeWall([x, 0, z], 3, 1);
                placeWall([x, 0, z], 3, 3);
            }
            else if (z == 10 && (x == 5 || x == 15)) {
                map.addVoxel([x, 0, z], VoxelDefinitions.dirt);
                placeWall([x, 0, z], 3, 2);
                placeWall([x, 0, z], 3, 4);
            }
            else if (z == 10 || x == 10) {
                //
            }
            else {
                map.addVoxel([x, 0, z], VoxelDefinitions.stone);
                if (x == 0) {
                    placeWall([x, 0, z], 3, 4);
                }
                if (x == 19) {
                    placeWall([x, 0, z], 3, 2);
                }
                if (z == 0) {
                    placeWall([x, 0, z], 3, 3);
                }
                if (z == 19) {
                    placeWall([x, 0, z], 3, 1);
                }
                if (x == 9) {
                    if (z != 5 && z != 15) {
                        placeWall([x, 0, z], 3, 2);
                    }
                }
                if (x == 11) {
                    if (z != 5 && z != 15) {
                        placeWall([x, 0, z], 3, 4);
                    }
                }
                if (z == 9) {
                    if (x != 5 && x != 15) {
                        placeWall([x, 0, z], 3, 1);
                    }
                }
                if (z == 11) {
                    if (x != 5 && x != 15) {
                        placeWall([x, 0, z], 3, 3);
                    }
                }
            }
        }
    }
    for (x of [0,1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19]) {
        for (z of [0,1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19]) {
            if (Math.random() < .3) {
                var _ = new Light(`${Math.random()}`, 'point', [x,1.5,z],null, 1.5, 10, null, [255,128,0]);
            }
        }
    }

    return map;
}