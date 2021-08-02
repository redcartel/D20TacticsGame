import Dialog from '../lib/Dialog';
import Scene from '../lib/Scene';
import { grassPlain, walkObstacle, standardLights } from './MapGenerators';
import { Sprites } from './assetLoaders';
import WalkDemo from './WalkDemo';
import DistanceDemo from './DistanceDemo';
import MoveActionDemo from './MoveActionDemo';
import MapGenDemo from './MapGenDemo';
import UIImage from '../lib/UIImage';
import GameRules from './GameRulesDemo';
import {setOnScreenControls} from '../lib/UIManager';
import SpriteAnimation from './SpriteAnimation';

window.game = window.game ?? {};

export default MainMenu = () => {
    window.backButton = () => {};
    setOnScreenControls(false);
    window.game.scene = new Scene('mainMenu', null, true, true);
    window.game._logo = new UIImage('mainLogo', Sprites.logo);
    window.game._logo.place([(1920 - 1000) / 2, 680, 1000, 400]);
    window.game._dialog = new Dialog('mainMenu', 'D20 Tactics');
    window.game._dialog.place([(1920 - 400) / 2, 150], [400, 500]);
    window.game._dialog.setText("D20 Tactics\nMain Menu");
    window.game._dialog.addButton("Path-Walk", [16, 320], [200, 28], "window.game._walkDemo()");
    window.game._dialog.addButton("Distance Click", [16, 260], [200, 28], "window.game._distanceDemo()");
    window.game._dialog.addButton("Sprite and Animation", [16, 200], [200,28], "window.game._spriteAnim()");
    window.game._dialog.addButton("Map Gen", [16, 140], [200,28], "window.game._mapGenDemo()");
    window.game._dialog.addButton("Game Rules", [16, 80], [200, 28], "window.game._gameRules()");
}

window.game._walkDemo = () => {
    window.game.scene = new Scene('walkDemo', null, true, true);
    // TODO: Progress bars for mapgen etc. also, test JS Engine speeds
    WalkDemo(40,40);
}

window.game._distanceDemo = () => {
    window.game.scene = new Scene('distanceDemo', null, true, true);
    DistanceDemo();
}

window.game._moveAction = () => {
    window.game.scene = new Scene('moveAction', null, true, true);
    MoveActionDemo();
}

window.game._mapGenDemo = () => {
    window.game.scene = new Scene('mapGen', null, true, true);
    MapGenDemo();
}

window.game._gameRules = () => {
    window.game.scene = new Scene('gameRules', null, true, true);
    GameRules();
}

window.game._spriteAnim = () => {
    window.game.scene = new Scene('spriteAnimation', null, true, true);
    new SpriteAnimation();
}