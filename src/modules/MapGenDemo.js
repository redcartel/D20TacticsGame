import { setOnScreenControls, registerCharacterForClicks } from "../lib/UIManager";
import { dungeon1, standardLights, walkObstacle } from './MapGenerators';
import { Sprites, AnimationGroups } from './assetLoaders';
import Character from '../lib/Character';
import HighlightGroup from '../lib/HighlightGroup';
import Callback from "../lib/Callback";
import SceneState from "../gameRules/SceneState";
import SceneLoop from "../gameRules/SceneLoop";
import GameState from "../gameRules/GameState";
import GameLoop from "../gameRules/GameLoop";
import { characterPrefabs } from "./characterPrefabs";

window.game = window.game ?? {};

export default MapGenDemo = () => {
    setOnScreenControls(true);
    var xD = 20;
    var yD = 5;
    var zD = 20;
    var map = dungeon1(20, 5, 20);
    standardLights(map);
    map.render();
    var gState = new GameState();
    var gLoop = new GameLoop(gState);
    var scene = new SceneState();
    scene.map = map;


    var search = true;
    var x = 0;
    var y = 0;
    var z = 0;
    for (z = 0; search && z < zD; z++) {
        for (x = 0; search && x < xD; x++) {
            var greatest = -1;
            for (y = 0; search && y < yD; y++) {
                if (map.surfaces[x][y][z]) {
                    greatest = y;
                }
            }
            if (greatest != -1) {
                y = greatest;
                search = false;
                break;
            }
        }
        if (!search) break;
    }
    scene.addCharacterPrefab(characterPrefabs.cleric, 'Sal', [x, y, z]);
    var search = true;
    x = y = z = 0;
    for (z = zD - 1; search && z >= 0; z--) {
        for (x = 0; search && x < xD; x++) {
            var greatest = -1;
            for (y = 0; search && y < yD; y++) {
                if (map.surfaces[x][y][z]) {
                    greatest = y;
                }
            }
            if (greatest != -1) {
                y = greatest;
                search = false;
                break;
            }
        }
        if (!search) break;
    }
    scene.addCharacterPrefab(characterPrefabs.rogue, 'Sam', [x, y, z]);


    gState.loadScene(scene);
    window.backButton = () => {
        MainMenu();
    }
};