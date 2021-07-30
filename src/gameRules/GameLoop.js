export default class GameLoop {
    state;

    constructor(gameState) {
        this.state = gameState;
        this.state.loop = this;
    }

    go() {
        if (this.state.stateChain[0] == 'setup') {
            this.state.sceneLoop.go();
        }
    }
}