import SceneLoop from "./SceneLoop";

export default class GameState {
    sceneLoop;
    sceneState;
    loop;

    constructor() {}

    loadScene(sceneState) {
        this.sceneLoop = new SceneLoop(sceneState);
        this.sceneState = sceneState;
        this.stateChain = ['setup'];
        window.currentScene = sceneState;
        this.loop.go();
    }
}