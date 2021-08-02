import Dialog from '../lib/Dialog';
import Callback from '../lib/Callback';
import { coordsInList } from '../lib/util';
import HighlightGroup from '../lib/HighlightGroup';

export default class GameUI {
    moveSelectSquares;
    attackSelectSquares;
    popup;
    deathSaveSuccess = 0;
    deathSaveFail = 0;

    constructor(state) {
        this.state = state;
    }

    turnMenu() {
        if (this.state.activeCharacter.HP <= 0) this.state.turnEnd();

        var moveAction = new Callback(() => {
            this.firstMenu.destroy();
            this.state.stateChain = ['turn', 'makeMove'];
            this.state.loop.go();
        });

        var attackAction = new Callback(() => {
            this.firstMenu.destroy();
            this.state.stateChain = ['turn', 'attack'];
            this.state.loop.go();
        });

        if (this.firstMenu) this.firstMenu.destroy();
        this.firstMenu = new Dialog(this.state.activeCharacter.name + '\'s turn');
        this.firstMenu.setText(this.state.activeCharacter.name + '\'s turn');
        this.firstMenu.place([1500, 500], [300, 300]);

        var endTurn = new Callback(() => {
            this.firstMenu.destroy();
            this.state.turnEnd();
        });


        if (this.state.activeCharacter.turn.hasMove) {
            this.firstMenu.addButton('Move', [16, 200], [250, 28], moveAction.callString);
        }
        if (this.state.activeCharacter.turn.hasAction) {
            this.firstMenu.addButton('Attack', [16, 150], [250, 28], attackAction.callString);
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
                    this.state.map.receiveClick = () => { };
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
                    this.state.update();
                    this.state.loop.go();
                }
            }
        }
    }

    attackSelection() {
        var characterPositions = [];
        for (var gC of this.state.initiativeOrder) {
            characterPositions.push(gC.position);
        }
        var characterPosition = this.state.activeCharacter.position;
        var adjacencies = this.state.map.pathAdjacencies(characterPosition);
        adjacencies.push(characterPosition);
        var targets = [];
        for (var charPos of characterPositions) {
            for (var adjPos of adjacencies) {
                if (charPos[0] == adjPos[0] && charPos[1] == adjPos[1] && charPos[2] == adjPos[2]) {
                    targets.push(charPos);
                }
            }
        }
        this.attackSelectSquares = targets;
        console.log('aSS:  ' + JSON.stringify(this.attackSelectSquares));
        this.state.update();

        this.state.map.receiveClick = (coords, face) => {
            if (face != 0) return;
            if ('' + coords == '' + characterPosition) {
                this.state.map.receiveClick = ()=>{};
                this.attackSelectSquares = [];
                this.state.update();
                this.state.stateChain = ['turn', 'mainMenu'];
                this.state.loop.go();
                return;
            }
            var found = false;
            var checkCoords;
            for (checkCoords of this.attackSelectSquares) {
                if ('' + coords == '' + checkCoords) {
                    found = true;
                    break;
                }
            }
            if (found) {
                // find target character;
                var found2 = false;
                var targetGC;
                for (targetGC of this.state.initiativeOrder) {
                    if ('' + targetGC.position == '' + coords) {
                        found = true;
                        break;
                    }
                }
                this.state.activeCharacter.attack(targetGC);
                this.state.map.receiveClick = () => {};

                this.state.stateChain = ['turn', 'mainMenu'];
                this.attackSelectSquares = [];
                this.state.update();
                this.state.loop.go();
            }
        }
    }

    updateState() {
        if (this.moveSelectSquares !== undefined && this.moveSelectSquares.length > 0) {
            if (!this.moveHG) this.moveHG = new HighlightGroup();
            else this.moveHG.clearHighlights();
            this.moveHG.highlightMultiple(this.moveSelectSquares, [0]);
            this.moveHG.showHighlights();
        }
        else {
            if (this.moveHG) this.moveHG.clearHighlights();
        }

        if (this.attackSelectSquares !== undefined && this.attackSelectSquares.length > 0) {
            if (!this.attackHG) this.attackHG = new HighlightGroup();
            else this.attackHG.clearHighlights();
            this.attackHG.highlightMultiple(this.attackSelectSquares, [0]);
            this.attackHG.showHighlights();
        }
        else {
            this.attackSelectSquares = [];
            if (this.attackHG) this.attackHG.clearHighlights();
        }

        if (this.popup) {
            if (this.popupDialog) this.popupDialog.destroy();
            this.popupDialog = new Dialog('_popup');
            this.popupDialog.setText(this.popup, .005);
            this.popupDialog.place(1920 / 2 - 200, 0, 400, 64);
            Callback.delayed(2, ()=> this.popupDialog.destroy());
            this.popup = null;
        }
    }
}