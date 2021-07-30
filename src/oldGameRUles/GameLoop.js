export default class GameLoop {
    gameState;

    constructor() {
    }

    go() {
        this.runLoop();
    }

    loop() {

    }

    runLoop() {
        console.log('loop updateState ' + JSON.stringify(this.gameState.stateChain));
        if (this.gameState.stateChain[0] = 'turnSetup') this.gameState.turnSetup();
        else if (this.gameState.stateChain[0] = 'setup') this.gameState.setup();
        else if (this.gameState.stateChain[0] = 'animate');
        else if (this.gameState.stateChain[0] = 'move');
    }
}