import { characterPrefabs } from './characterPrefabs';
import GameCharacter from './GameCharacter';
import MapHighlight from './MapHighlight';
import TurnController from './TurnController';

export default class GameState {

    map;
    stateChain = ['setup'];
    gameCharacters = {};
    mapHighlights = {};
    uiElements = {};
    loop;
    activeGameCharacter;

    constructor(listeners, loop) {
        for (var listener of listeners) {
            this.attach(listener);
        }
        this.loop = loop;
        loop.gameState = this;
    }

    _listeners = [];

    update() {
        for (var listener of this._listeners) {
            if (listener.updateState) {
                listener.updateState(this);
            }
        }
    }

    attach(object) {
        object.gameState = this;
        for (var listener in this._listeners) {
            if (object === listener) return;
        }
        this._listeners.push(object);
        if (object.attachState) {
            object.attachState(this);
        }
    }

    addCharacterPrefab(prefabName, name, position) {
        this.gameCharacters[name] = new GameCharacter(characterPrefabs[prefabName], name, position);
        this.gameCharacters[name].rollInitiative();
        this.attach(this.gameCharacters[name]);
        this.update();
    }

    initiativeOrder = [];
    initiativeIndex = -1;

    setup() {
        this.initiativeOrder = [];
        for (var key in this.gameCharacters) {
            this.gameCharacters[key].rollInitiative();
            console.log('roll init: ' + JSON.stringify(this.gameCharacters[key]));
            this.initiativeOrder.push(this.gameCharacters[key]);
        }
        this.initiativeOrder.sort((a, b) => a.initiative - b.initiative);
        this.initiativeIndex = 0;
        this.stateChain = ['turnSetup'];
        this.update();
        this.loop.runLoop();
    }

    turnSetup() {
        this.activeGameCharacter = this.initiativeOrder[this.initiativeIndex];
        this.turnController = new TurnController(this.activeGameCharacter);
        console.log(JSON.stringify(this.activeGameCharacter));
        this.stateChain = ['turnUI'];
        this.loop.runLoop();
    }

    nextTurn() {
        this.initiativeIndex = (this.initiativeIndex + 1) % this.initiativeOrder.length;
        this.stateChain = ['turnSetup'];
    }

    turnUI() {
        if (this.stateChain[0] == 'turnUI' && this.stateChain.length == 0) {
            this.turnController.showUI();
        }
    }
}