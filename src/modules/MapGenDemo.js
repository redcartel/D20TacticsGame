import { setOnScreenControls, registerCharacterForClicks } from "../lib/UIManager";
import { dungeonAlpha, standardLights } from './MapGenerators';
import { Sprites, AnimationGroups } from './assetLoaders';
import Character from '../lib/Character';
import HighlightGroup from '../lib/HighlightGroup';

window.game = window.game ?? {};

export default MapGenDemo = () => {
    setOnScreenControls(true);
    dungeonAlpha(window.game, 24, 48, 5);
    standardLights(window.game._map);


    window.backButton = () => {
        MainMenu();
    }
};