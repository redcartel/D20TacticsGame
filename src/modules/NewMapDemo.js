import VoxelMap from "../lib/VoxelMap";
import { VoxelDefinitions, Sounds } from "./assetLoaders";
import Light from "../lib/Light";
import { standardLights, walkObstacle, fourRooms } from "./MapGenerators";
import { setOnScreenControls } from "../lib/UIManager";
import GameState from "../gameRules/GameState";
import GameLoop from "../gameRules/GameLoop";
import SceneState from "../gameRules/SceneState";
import { characterPrefabs } from "./characterPrefabs";
import MainMenu from "./MainMenu";
import AudioSource from "../lib/AudioSource";

export default NewMap = () => {
    setOnScreenControls(true);
    window.game._map = fourRooms();
    //standardLights(window.game._map);
    window.game._map.render();
    var gState = new GameState();
    var gLoop = new GameLoop(gState);
    var scene = new SceneState();
    window._music = new AudioSource('window._music');
    window._music.playSound(Sounds.necrophage);
    scene.addCharacterPrefab(characterPrefabs.cleric, 'Sal', [1,0,1]);
    scene.addCharacterPrefab(characterPrefabs.rogue, 'Sam', [18, 0, 18], null, false);
    scene.map = window.game._map;
    gState.loadScene(scene);
    gLoop.go();

    window.backButton = () => {
        MainMenu();
    };
};