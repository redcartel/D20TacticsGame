export default class SceneLoop {
    constructor(state) {
        this.state = state;
        this.state.loop = this;
    }

    go() {
        if (!this.state.stateChain) {
            
        }
        else if (this.state.stateChain[0] == 'setup') {
            console.log(':: setup');
            this.state.setup();
            this.state.update();
        }
        else if (this.state.stateChain[0] == 'turn') {
            if (this.state.stateChain.length == 1) {
                console.log(':: turn');
                this.state.turnSetup();
                this.state.update();
            }
            else if (this.state.stateChain[1] == 'mainMenu') {
                console.log(':: mainMenu');
                this.state.ui.turnMenu();
                this.state.update();
            }
            else if (this.state.stateChain[1] == 'makeMove') {
                console.log(':: makeMove');
                this.state.ui.moveSelection();
                this.state.update();
            }
            else if (this.state.stateChain[1] == 'attack') {
                console.log(':: attack');
                this.state.ui.attackSelection();
                this.state.update();
            }
            else if (this.state.stateChain[1] == 'end') {
                console.log(':: end');
                this.state.turnEnd();
                this.state.update();
            }
        }
        else if (this.state.stateChain[0] == 'aiTurn') {
            if (this.state.stateChain.length == 1) {
                console.log(':: ai turn');
                this.state.aiTurnSetup();
                this.state.update();
            }
            else if (this.state.stateChain[1] == 'mainMenu') {
                console.log(':: ai main menu');
                this.state.activeCharacter.turn.aiActionChoice();
                this.state.update();
            }
            else if (this.state.stateChain[1] == 'move') {
                console.log(':: ai move');
                this.state.activeCharacter.turn.aiMove();
                this.state.update();
            }
            else if (this.state.stateChain[1] == 'attack') {
                console.log(':: ai attack');
                this.state.activeCharacter.turn.aiAttack();
                this.state.update();
            }
            else if (this.state.stateChain[1] == 'end') {
                console.log(':: ai end');
                this.state.aiTurnEnd();
                this.state.update();
            }
        }
        else if (this.state.stateChain[0] == 'gameEnd') {
            console.log(':: game end');
        }
    }
}