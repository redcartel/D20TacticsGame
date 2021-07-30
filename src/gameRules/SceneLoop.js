export default class SceneLoop {
    constructor(state) {
        this.state = state;
        this.state.loop = this;
    }

    go() {
        if (this.state.stateChain[0] == 'setup') {
            this.state.setup();
            this.state.update();
        }
        if (this.state.stateChain[0] == 'turn') {
            if (this.state.stateChain.length == 1) {
                this.state.turnSetup();
                this.state.update();
            }
            else if (this.state.stateChain[1] == 'mainMenu') {
                console.log(this.state.ui);
                this.state.ui.turnMenu();
                this.state.update();
            }
            else if (this.state.stateChain[1] == 'makeMove') {
                console.log('move selection');
                this.state.ui.moveSelection();
                this.state.update();
            }
            else if (this.state.stateChain[1] == 'end') {
                this.state.turnEnd();
                this.state.update();
            }
        }
    }
}