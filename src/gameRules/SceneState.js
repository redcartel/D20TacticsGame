import Scene from "../lib/Scene";
import Callback from "../lib/Callback";
import GameCharacter from "./GameCharacter";
import GameUI from "./GameUI";
import GameTurn from "./GameTurn";

export default class SceneState {
    active;
    scene;
    name;
    loop;

    map;
    gameCharacters = {};
    gameMap;
    gameUI;

    initiativeIndex = -1;
    initiativeOrder = [];
    ui;

    activeCharacter;

    stateChain = ['setup'];

    constructor(name) {
        this.name = name;
        this.ui = new GameUI(this);
        this.add(this.ui);
    }

    deactivate() {
        if (this.scene) this.scene.deactivate();
    }

    activate() {
        if (this.scene == null) {
            this.scene = new Scene(name, this);
        }
        if (window.currentScene && window.currentScene.deactivate) this.currentScene.deactivate();
        this.scene.activate();
        window.currentScene = this;
    }

    _listeners = [];

    add(object) {
        this._listeners.push(object);
        object.state = this;
    }

    update() {
        for (var listener of this._listeners) {
            if (listener.updateState) listener.updateState();
        }
    }

    setup() {
        console.log('setup');
        this.stateChain = ['turn'];
        this.fillInitiativeOrder();
        this.initiativeIndex = 0;
        this.loop.go();
    }

    turnSetup() {
        console.log('turnSetup');
        if (this.initiativeOrder.length == 0) {
            this.activeCharacter = null;
            this.stateChain = ['turn', 'noCharacters'];
        }
        else {
            if (this.initiativeIndex >= this.initiativeOrder.length) {
                this.initiativeIndex = 0; // TODO: issues when removing characters?
            }
            this.activeCharacter = this.initiativeOrder[this.initiativeIndex];
            this.activeCharacter.turn = new GameTurn(this.activeCharacter);
            this.activeCharacter.centerCameraOn();
            this.stateChain = ['turn', 'mainMenu'];
        }
        this.loop.go();
    }

    turnEnd() {
        console.log('end');
        this.initiativeIndex = (this.initiativeIndex + 1) % this.initiativeOrder.length;
        this.stateChain = ['turn'];
        this.loop.go();
    }

    addCharacterPrefab(prefab, name, position, initiative = null) {
        if (!this.gameCharacters) this.gameCharacters = {};
        this.gameCharacters[name] = GameCharacter.fromPrefab(prefab, name);
        this.gameCharacters[name].rollInitiative();
        this.gameCharacters[name].place(position);
        this.add(this.gameCharacters[name]);
        if (initiative == null) {
            this.gameCharacters[name].rollInitiative();
        }
        this.update();
    }

    fillInitiativeOrder() {
        this.initiativeOrder = [];
        for (var key in this.gameCharacters) {
            this.initiativeOrder.push(this.gameCharacters[key]);
        }
        this.initiativeOrder.sort((a, b) => a.initiative - b.initiative);
    }
}