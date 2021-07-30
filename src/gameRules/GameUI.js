import Dialog from '../lib/Dialog';
import Callback from '../lib/Callback';
import { coordsInList } from '../lib/util';
import HighlightGroup from '../lib/HighlightGroup';

export default class GameUI {
    moveSelectSquares;

    constructor(state) {
        this.state = state;
    }

    turnMenu() {
        console.log('turnMenu');
        var endTurn = new Callback(() => {
            this.firstMenu.destroy();
            this.state.endTurn();
        });

        var moveAction = new Callback(() => {
            this.firstMenu.destroy();
            this.state.stateChain = ['turn', 'makeMove'];
            this.state.loop.go();
        })

        if (this.firstMenu) this.firstMenu.destroy();
        this.firstMenu = new Dialog('turnMenu');
        this.firstMenu.setText('Turn Menu');
        this.firstMenu.place([1500, 500], [300, 300]);

        var endTurn = new Callback(() => {
            this.firstMenu.destroy();
            this.state.turnEnd();
        });

        if (this.state.activeCharacter.turn.hasMove) {
            this.firstMenu.addButton('Move', [16, 200], [250, 28], moveAction.callString);
        }
        this.firstMenu.addButton('End Turn', [16, 100], [250, 28], endTurn.callString);
    }

    moveSelection() {
        this.moveSelectSquares = this.state.map.closeSurfaces(this.state.activeCharacter.position, Math.floor(this.state.activeCharacter?.turn?.walk ?? 0));
        this.state.update();
        //console.log('moveSelectSquares:' + JSON.stringify(this.moveSelectSquares));
        this.state.map.receiveClick = (coords, face) => {
            // console.log(JSON.stringify(coords));
            // console.log(face);
            // console.log(JSON.stringify(this.moveSelectSquares));
            if (face == 0) {
                var found = false;
                for (var checkCoords of this.moveSelectSquares) {
                    if ('' + coords == '' + checkCoords) {
                        found = true;
                    }
                }
                if (found) {
                    var walkPath = this.state.map.aStar(this.state.activeCharacter.position, coords);
                    if (!walkPath || walkPath.length <= 1) {
                        this.moveSelectSquares = [];
                        this.state.update();
                        this.state.stateChain = ['turn', 'mainMenu'];
                        this.state.loop.go();
                        return;
                    }

                    this.state.activeCharacter.turn.walk -= (walkPath.length - 1);
                    this.state.activeCharacter.walkPath = walkPath;
                    this.moveSelectSquares = [];
                    this.state.stateChain = ['turn', 'animate'];
                    console.log('animating');
                    this.state.update();
                    this.state.loop.go();
                }
            }
        }
    }

    updateState() {
        if (this.moveSelectSquares !== undefined && this.moveSelectSquares.length > 0) {
            console.log(JSON.stringify(this.moveSelectSquares));
            if (!this.moveHG) this.moveHG = new HighlightGroup();
            else this.moveHG.clearHighlights();
            this.moveHG.highlightMultiple(this.moveSelectSquares, [0]);
            this.moveHG.showHighlights();
        }
        else {
            if (this.moveHG) this.moveHG.clearHighlights();
        }
    }
}