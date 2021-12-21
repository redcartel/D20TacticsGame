import {grassPlain, standardLights} from './MapGenerators';
import HighlightGroup from '../lib/HighlightGroup';
import {setOnScreenControls} from '../lib/UIManager';
import VoxelMap from '../lib/VoxelMap';
import { VoxelDefinitions } from './assetLoaders';
import Light from '../lib/Light';
import MainMenu from './MainMenu';
import GameState from '../gameRules/GameState';
import GameLoop from '../gameRules/GameLoop';
import SceneState from '../gameRules/SceneState';
import { characterPrefabs } from './characterPrefabs';

window.game = window.game ?? {}

// TODO: bug when clicking on x=0 tiles
export default function DistanceDemo() {

    setOnScreenControls(true);
    var map = grassPlain();
    standardLights(map);
    map.render();
    var gState = new GameState();
    var gLoop = new GameLoop(gState);
    var scene = new SceneState();
    scene.addCharacterPrefab(characterPrefabs.cleric, 'Sal', [1,0,1]);
    scene.map = map;
    gState.loadScene(scene);
    gLoop.go();

    var _x = 0;
    map.receiveClick = (coords, face) => {
        var highlightCoords = map.surfacesNear(coords, _x);
        hg.clearHighlights();
        hg.highlightMultiple(highlightCoords, null);
        hg.showHighlights();
        _x++;
    }
    map.setClickActive();

    window.backButton = () => {
        MainMenu();
    };

    // window.game._map = grassPlain();
    // standardLights(window.game._map);
    // window.game._map.render();
    // window.game.sx = null;
    // window.game.sy = null;
    // window.game.hg = new HighlightGroup();
    // window.game._map.receiveClick = (coords, face) => {
    //     var highlightCoords = window.game._map.closeSurfaces(coords, 4)
    //     window.game.hg.clearHighlights();
    //     window.game.hg.highlightMultiple(highlightCoords, null);
    //     window.game.hg.showHighlights();
    // }

    // var map = new VoxelMap({yMax: 3});
    // for (var x = 0; x < 20; x++) {
    //     for (var z = 0; z < 20; z++) {
    //         var y = Math.floor(Math.random() * 1);
    //         for (var i = 0; i <= y; i++) {
    //             map.addVoxel([x,i,z], VoxelDefinitions.grassDirt);
    //         }
    //     }
    // }
    // var l = new Light('1', 'directional', [-5,5,-5], [22.5, 60, 0], 1.2);
    // l.on();
    // map.render();

    // var hg = new HighlightGroup();

    // var _x = 0;
    // map.receiveClick = (coords, face) => {
    //     var highlightCoords = map.surfacesNear(coords, _x);
    //     hg.clearHighlights();
    //     hg.highlightMultiple(highlightCoords, null);
    //     hg.showHighlights();
    //     _x++;
    // }
    // map.setClickActive();

    // window.backButton = () => {
    //     MainMenu();
    // };
}