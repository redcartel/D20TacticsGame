import {grassPlain, standardLights} from './MapGenerators';
import HighlightGroup from '../lib/HighlightGroup';

window.game = window.game ?? {}

export default DistanceDemo = () => {
    if (window._map) window._map.clearGameObjects();
    window._map = grassPlain();
    standardLights();
    window._map.render();
    window.game.sx = null;
    window.game.sy = null;
    window.game.hg = new HighlightGroup();
    window._map.receiveClick = (coords, face) => {
        var highlightCoords = window._map.closeSurfaces(coords, 4)
        window.game.hg.clearHighlights();
        window.game.hg.highlightMultiple(highlightCoords, null);
        window.game.hg.showHighlights();
    }
}