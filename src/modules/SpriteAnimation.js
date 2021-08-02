import { grassPlain, standardLights } from './MapGenerators';
import SceneState from '../gameRules/SceneState';
import GameState from '../gameRules/GameState';
import GameLoop from '../gameRules/GameLoop';
import SceneLoop from '../gameRules/SceneLoop';
import { characterPrefabs } from './characterPrefabs';

export default class SpriteAnimation {
    constructor() {
        var scene = new SceneState('spriteAnimation');
        var game = new GameState();
        game.loop = new GameLoop(game);
        scene.map = grassPlain();
        scene.map.render();
        var rogue = scene.addCharacterPrefab(characterPrefabs.deadRogue, 'rogue', [2,0,2]);
        var cleric = scene.addCharacterPrefab(characterPrefabs.cleric, 'cleric', [6, 0, 2]);
        rogue.place(null, 0);

        standardLights(scene.map);
        game.loadScene(scene);
    }
}