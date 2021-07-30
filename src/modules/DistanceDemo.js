import {grassPlain, standardLights} from './MapGenerators';
import HighlightGroup from '../lib/HighlightGroup';
import {setOnScreenControls} from '../lib/UIManager';

window.game = window.game ?? {}

// TODO: bug when clicking on x=0 tiles
export default DistanceDemo = () => {
    setOnScreenControls(true);
    window.game._map = grassPlain();
    standardLights(window.game._map);
    window.game._map.render();
    window.game.sx = null;
    window.game.sy = null;
    window.game.hg = new HighlightGroup();
    window.game._map.receiveClick = (coords, face) => {
        var highlightCoords = window.game._map.closeSurfaces(coords, 4)
        window.game.hg.clearHighlights();
        window.game.hg.highlightMultiple(highlightCoords, null);
        window.game.hg.showHighlights();
    }

    window.backButton = () => {
        MainMenu();
    }
}