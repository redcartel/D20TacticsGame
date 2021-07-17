import Map from '../lib/Map';
import Light from '../lib/Light';
import Character from '../lib/Character';
import HighlightGroup from '../lib/HighlightGroup';
import AnimationPath from '../lib/AnimationPath';
//import AnimationPath from '../lib/AnimationPath';
import { Sprites, AnimationGroups } from './assetLoaders';
import { walkObstacle, standardLights } from './MapGenerators';

window.game = window.game ?? {}
window.game._walkDemo = window.game._walkDemo ?? {}

export default WalkDemo = (xDim, zDim) => {
    walkObstacle(xDim, zDim);
    standardLights();
    window.game._cleric = new Character('game.cleric', Sprites.cleric0, [1, 0, 1]);
    window.game._cleric.place([1, 0, 1]);
    window.game._cleric.x = 1;
    window.game._cleric.y = 0;
    window.game._cleric.z = 1;
    window.game._cleric.dx = undefined;
    window.game.pathHighlight = new HighlightGroup();
    window.game._newWalkPath = () => {
        if (window.game._cleric.dx !== undefined) {
            window.game._cleric.x = window.game._cleric.dx;
            window.game._cleric.y = window.game._cleric.dy;
            window.game._cleric.z = window.game._cleric.dz;
        }
        var aStarPath = null;
        while (aStarPath == null) {
            window.game.pathHighlight.clearHighlights();
            var found = false;
            var x, y, z;
            while (!found) {
                y = 0;
                z = Math.floor(Math.random() * zDim);
                x = Math.floor(Math.random() * xDim);
                for (; y < 5; y++) {
                    if (window._map.surfaces[x][y][z]) {
                        found = true;
                        break;
                    }
                }
            }
            window.game._cleric.dx = x;
            window.game._cleric.dy = y;
            window.game._cleric.dz = z;
            aStarPath = window._map.aStar([window.game._cleric.x, window.game._cleric.y, window.game._cleric.z],
                [window.game._cleric.dx, window.game._cleric.dy, window.game._cleric.dz]);
        }
        window.game.pathHighlight.clearHighlights();
        for (var coords of aStarPath) {
            window.game.pathHighlight.highlightFaces(coords, [0]);
        }
        window.game.pathHighlight.showHighlights();
        var walkPath = AnimationPath.fromSequence('__default__', AnimationGroups.clericWalkGroup, aStarPath, 25, 'window.game._newWalkPath()');

        window.game._cleric.setPath(walkPath);
        window.game._cleric.followWithCamera();
    }
    _i.delayedEval(.1, 'window.game._newWalkPath()');
}