import { walkObstacle, standardLights } from './MapGenerators';
import UIManager from '../lib/UIManager';
import GameLoop from '../gameRules/GameLoop';
import GameState from '../gameRules/GameState';
import SceneState from '../gameRules/SceneState';
import {characterPrefabs} from './characterPrefabs';
import { Sounds } from './assetLoaders';

window.game = window.game ?? {};

export default function GameRules() {
    var map = walkObstacle(22, 22);
    window._music = new AudioSource('window._music');
    window._music.playSound(Sounds.necrophage);
    standardLights(map);
    map.render();
    var gState = new GameState();
    var gLoop = new GameLoop(gState);
    var scene = new SceneState();
    scene.addCharacterPrefab(characterPrefabs.cleric, 'Sal', [1,0,1]);
    scene.addCharacterPrefab(characterPrefabs.rogue, 'Sam', [21,0,1]);
    scene.map = map;
    gState.loadScene(scene);
    gLoop.go();

    window.backButton = () => {
        MainMenu();
    }
}