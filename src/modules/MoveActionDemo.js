import {walkObstacle, standardLights} from './MapGenerators';
import {Sprites, AnimationGroups} from './assetLoaders';
import Character from '../lib/Character';
import HighlightGroup from '../lib/HighlightGroup';

window.game = window.game ?? {}

export default MoveActionDemo = () => {
    window._map = walkObstacle(22,22);
    standardLights();
    
    window.game._cleric = new Character('game.cleric', Sprites.cleric0, [1, 0, 1]);
    window.game._cleric.place([1, 0, 1]);
    window.game._rogue = new Character('game.rogue', Sprites.rogueDRWalk2, [21, 0, 0]);
    window.game._rogue.place([21, 0, 1]);

    // states = "clericTurn, rogueTurn, animating"
    window.game.state = 'clericTurn';

    window.game._hg = new HighlightGroup();
    window.game._clickableSquares = [];

    function coordsInList(coords, list) {
        for (var checkCoords of list) {
            if (checkCoords == null) continue;
            if (coords.length != checkCoords.length) continue;
            var match = true;
            for (var i = 0; i < coords.length; i++) {
                if (coords[i] != checkCoords[i]) {
                    match = false;
                }
            }
            if (match) return true;
        }
    }

    window.game._clickableSquares = [];
    characterMoveSelect = (character, animationGroup, nextTurn) => {
        window.game._hg.clearHighlights();
            var range = window._map.closeSurfaces(character.position, 6);
            window.game._clickableSquares = range;
            window.game._hg.highlightMultiple(range, [0]);
            window.game._hg.showHighlights();
            window._map.receiveClick = (coords, face) => {
                var aStarPath = window._map.aStar(character.position, coords);
                window.game._cleric.complete = () => {
                    character.position = coords;
                    window.game.state = nextTurn;
                    window.game.setState();
                }
                character.setPathFromSequence(aStarPath, animationGroup, 15, 'window.game._cleric.complete()');
                window.game.state = 'animate';
                window.game.setState();
            }
    }

    window.game.setState = () => {
        window.game._clickableSquares = [];
        window._map.receiveClick = () => {};
        if (window.game.state == 'clericTurn') {
            characterMoveSelect(window.game._cleric, AnimationGroups.clericWalkGroup, 'rogueTurn');
        }
        if (window.game.state == 'rogueTurn') {
            characterMoveSelect(window.game._rogue, AnimationGroups.rogueWalkGroup, 'clericTurn');
        }
        if (window.game.state == 'animate') {

        }
    }

    window.game.setState();
}