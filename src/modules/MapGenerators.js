import { VoxelDefinitions } from './assetLoaders';
import Map from '../lib/Map';
import Light from '../lib/Light';

export const standardLights = () => {
    if (!window._map) return;
    window._map.addLight(new Light('std1', 'directional', null, [22.5, 0, 0], 0.8));
    window._map.addLight(new Light('std2', 'directional', null, [22.5, 290, 0], 0.8));
}

export const grassPlain = () => {
    if (window._map) window._map.clearGameObjects();
    var _map = new Map([20, 1, 20]);
    for (var x = 0; x < 20; x++) {
        for (var z = 0; z < 20; z++) {
            _map.addVoxel([x, 0, z], VoxelDefinitions.grassDirt);
        }
    }
    //window._map.render();
    return _map;
}

export const walkObstacle = (xDim, zDim) => {
    if (window._map) window._map.clearGameObjects();
    window._map = new Map([xDim, 5, zDim]);
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
    _map.render();
    return window._map;
}