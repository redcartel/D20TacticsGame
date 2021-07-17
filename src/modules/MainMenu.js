import Dialog from '../lib/Dialog';
import { grassPlain, walkObstacle, standardLights } from './MapGenerators';
import WalkDemo from './WalkDemo';
import DistanceDemo from './DistanceDemo';
import MoveActionDemo from './MoveActionDemo';

window.game = window.game ?? {};

export default MainMenu = () => {
    window.game._dialog = new Dialog('mainMenu', 'D20 Tactics');
    window.game._dialog.place([(1920 - 200) / 2, (1080 - 400) / 2], [200, 400]);
    window.game._dialog.setText("D20 Tactics\nMain Menu");
    window.game._dialog.addButton("Path-Walk", [16, 288], [200, 28], "window.game._walkDemo()");
    window.game._dialog.addButton("Distance Click", [16, 256], [200, 28], "window.game._distanceDemo()");
    window.game._dialog.addButton("Move Action", [16, 224], [200,28], "window.game._moveAction()");
}

window.game._walkDemo = () => {
    window.game._dialog.destroy();
    // TODO: Progress bars for mapgen etc. also, test JS Engine speeds
    WalkDemo(40,40);
}

window.game._distanceDemo = () => {
    window.game._dialog.destroy();
    DistanceDemo();
}

window.game._moveAction = () => {
    window.game._dialog.destroy();
    MoveActionDemo();
}