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
import UIManager, {setOnScreenControls} from '../lib/UIManager';
import SpriteAnimation from './SpriteAnimation';
import Callback from '../lib/Callback';
import NewMapDemo from './NewMapDemo';

window.game = window.game ?? {};

export default MainMenu = () => {
    window.backButton = () => {};
    setOnScreenControls(false);
    window.game.scene = new Scene('mainMenu', null, true, true);
    window.game._logo = new UIImage('mainLogo', Sprites.logo);
    console.log(UIManager.width + ' x ' + UIManager.height);
    var logoWidth = 800;
    var logoHeight = logoWidth * 4/10;
    var logoBottom = UIManager.height - logoHeight;
    var logoLeft = 0;
    var centerLogoLeft = (1920 - logoWidth) / 2;

    window.game._logo.place([centerLogoLeft, logoBottom, logoWidth, logoHeight]);
    window.game._dialog = new Dialog('mainMenu', 'D20 Tactics');
    window.game._dialog.place([(1920 - 600) / 2, 32], [500, 600]);
    window.game._dialog.setText("");
    window.game._dialog.addButton("Path-Walk", [32, 500], [400, 64], "window.game._walkDemo()");
     
    //window.game._dialog.addButton("Sprite and Animation", [16, 200], [200,28], "window.game._spriteAnim()");
    //window.game._dialog.addButton("Map Gen", [16, 300], [300,28], "window.game._mapGenDemo()");
    window.game._dialog.addButton("Fight Overworld", [32, 350], [400, 64], "window.game._gameRules()");
    window.game._dialog.addButton("Fight Dungeon", [32,200], [400,64], Callback.call(()=> {
        window.game.scene = new Scene('newMap', null, true, true);
        NewMapDemo();
    }));
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