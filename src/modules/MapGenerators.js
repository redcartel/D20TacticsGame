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

export const walkObstacle = (xDim, zDim, map=null) => {
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
                    _map.addVoxel([_x,y,_z], VoxelDefinitions.dirt);
                }
            }
            else if ((x == 3 || x == 5 || x == 13 || x == 15) && ( z == 13 || z == 17 || z==7 || z == 3)) {
                if (Math.random() > .3) _map.addVoxel([_x,1,_z], VoxelDefinitions.stone);
            }
            else {
                _map.addVoxel([_x, 0, _z], VoxelDefinitions.grassDirt);
            }
        }
    }
    return _map;
}

export const dungeonAlpha = (containingObject, xDim, zDim, depth = 5, options = {}) => {
    var _map = containingObject['_map'] = new Map([xDim, depth, zDim]);
    var roomFloor = options['roomFloor'] ?? VoxelDefinitions.stone;
    var hallFloor = options['hallFloor'] ?? VoxelDefinitions.dirt;
    
    function room(x,z,y,w,h) {
        if (x < 0) x = 0;
        if (y < 0) y = 0;

        if (x + w >= xDim) w = xDim - x - 1;
        if (w < 2) {
            w = 2;
            x = xDim - 3;
        }

        if (z + h >= zDim) h = zDim - z - 1;
        if (h < 2) {
            h = 2;
            z = zDim - 3;
        }
        for (var _x = x; _x < x + w; _x++) {
            for (var _z = z; _z < z + h; _z++) {
                _map.addVoxel([_x, y, _z], roomFloor);
            }
        }
    }

    var nRooms = Math.floor((xDim * zDim / 144) * Math.random()) + 2;
    var wMax = xDim / 12 + 4;
    var hMax = zDim / 12 + 4;
    var potentialCorridors = [];

    for (var n = 0; n < nRooms; n++) {
        var _x = Math.floor(Math.random() * xDim);
        var _z = Math.floor(Math.random() * zDim);
        var _y = Math.floor(Math.random() * depth); // TODO
        var _w = Math.floor(Math.random() * wMax / 2) + Math.ceil(wMax / 2);
        var _h = Math.floor(Math.random() * hMax / 2) + Math.ceil(hMax / 2);
        room(_x, _z, _y, _w, _h);
        var r = Math.floor(Math.random() * _w);
        potentialCorridors.push([_x+r, _y, _z]);
        var r = Math.floor(Math.random() * _w);
        potentialCorridors.push([_x+r, _y, _z+_h - 1]);
        var r = Math.floor(Math.random() * _h);
        potentialCorridors.push([_x, _y, _z + r]);
        var r = Math.floor(Math.random() * _h);
        potentialCorridors.push([_x+_w-1, _y, _z+r]);
    }
    console.log(JSON.stringify(potentialCorridors));
    var tries = 0;
    var successes = 0;
    while (!(tries > nRooms * 2 && successes >= nRooms * 1.5) && tries < 100) {
        tries++;
        var coord1 = potentialCorridors[Math.floor(Math.random() * potentialCorridors.length)];
        var coord2 = potentialCorridors[Math.floor(Math.random() * potentialCorridors.length)];
        console.log('' + JSON.stringify(coord1) + ' to ' + JSON.stringify(coord2));
        var stepUp = false;
        var stepDown = false;
        if (coord2[1] > coord1[1]) stepUp = true;
        else if (coord1[1] > coord2[1]) stepDown = true;
        var path = _map.aStar(coord1, coord2, 2, true, stepUp, stepDown);
        console.log(JSON.stringify(path));
        if (!path || path.length <= 1) {
            console.log('no path');
            continue;
        }
        var processedPath = [];
        for (var backwardsI = path.length - 2; backwardsI >= 0; backwardsI--) {
            var tryCoords = path[backwardsI];
            var block = _map.blocks[tryCoords[0]][tryCoords[1]][tryCoords[2]];
            if (block && block.name == roomFloor.name) {
                console.log('hit room floor');
                continue;
            }
            else {
                processedPath.push(tryCoords);
            }
        }
        if (processedPath.length === 0) {
            console.log('path length == 0');
            continue;
        }
        for (var coords of processedPath) {
            console.log('processed ' + JSON.stringify(coords));
            _map.addVoxel(coords, hallFloor);
        }
        successes++;
    }

    _map.render();
}