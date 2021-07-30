export default class Scene {

    constructor(name, gameState, activate = false, destroyOld = false) {
        try {
            _i.newScene(name, activate, destroyOld);
        }
        catch (e) {
            console.error(`Error calling _i.newScene for ${this.name} with activate=${activate}, destroyOld=${destroyOld}`);
            console.error(e);
            return;
        }
        this.gameState = gameState;
    }

    activate() {
        try {
            _i.changeScene(this.name);
        }
        catch (e) {
            console.error(`Error calling _i.changeScene for ${this.name}`);
            console.error(e);
        }
    }

    destroy() {
        try {
            _i.destroyScene(this.name);
            if (window.currentScene == this) window.currentScene = null;
        }
        catch (e) {
            console.error(`Error calling _i.changeScene for ${this.name}`);
            console.error(e);
        }
    }

    static destroyAll() {
        try {
            _i.destroyAllScenes();
        }
        catch (e) {
            console.error(`Error calling _i.destroyAllScenes`);
            console.error(e);
        }
    }
}