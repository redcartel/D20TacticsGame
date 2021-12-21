import Scene from "../lib/Scene";
import Callback from "../lib/Callback";
import GameCharacter from "./GameCharacter";
import GameUI from "./GameUI";
import GameTurn from "./GameTurn";
import BanditAI from "./BanditAI";

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
        if ('addState' in object) object.addState();
    }

    update() {
        for (var listener of this._listeners) {
            if (listener.updateState) listener.updateState();
        }
    }

    setup() {
        
        this.fillInitiativeOrder();
        this.initiativeIndex = 0;
        this.stateChain = ['turn'];
        this.loop.go();
    }

    setState(stateChain = null) {
        if (stateChain != null) this.stateChain = stateChain;
        this.update();
        this.loop.go();
    }

    turnSetup() {
        var aliveCount = 0;
        for (var character of this.initiativeOrder) {
            console.log(`${character.name} ${character.isAlive} ${character.isAI}`);
            if (character.isAlive && !character.isAI) aliveCount++;
        }
        if (aliveCount <= 0) {
            return this.setState(['endGame']);
        }

        if (this.initiativeOrder.length == 0) {
            this.activeCharacter = null;
            return this.setState(['turn', 'noCharacters']);
        }
        else {
            if (this.initiativeIndex >= this.initiativeOrder.length) {
                this.initiativeIndex = 0;
            }
            this.activeCharacter = this.initiativeOrder[this.initiativeIndex];
            
            if (this.activeCharacter.HP <= 0) {
                if (this.initiativeOrder.length <= 1) {
                    return this.setState(['endGame']);
                }
                else {
                    return this.setState(['turn', 'end']);
                }
            }
            if (this.activeCharacter.isAI) {
                return this.setState(['aiTurn']);
            }
            else {
                this.activeCharacter.turn = new GameTurn(this.activeCharacter);
                this.activeCharacter.centerCameraOn();
                return this.setState(['turn', 'mainMenu']);
            }
        }
    }

    aiTurnSetup() {
        if (this.initiativeOrder.length == 0) {
            this.activeCharacter = null;
            return this.stateChain(['turn', 'noCharacters']);
        }
        else {
            // TODO: URGENT, this is a stupid hack
        this.activeCharacter.aiSeekKill = this.gameCharacters['Sal'];
        this.activeCharacter.turn = new BanditAI(this.activeCharacter);
        this.activeCharacter.centerCameraOn();
        return this.setState(['aiTurn', 'mainMenu']);
        }
    }

    turnEnd() {
        console.log('end');
        this.initiativeIndex = (this.initiativeIndex + 1) % this.initiativeOrder.length;
        return this.setState(['turn']);
    }

    aiTurnEnd() {
        console.log('ai turn end');
        this.initiativeIndex = (this.initiativeIndex + 1) % this.initiativeOrder.length;
        return this.setState(['turn']);
    }

    addCharacterPrefab(prefab, name, position, initiative = null, revealsMap = true) {
        if (!this.gameCharacters) this.gameCharacters = {};
        this.gameCharacters[name] = GameCharacter.fromPrefab(prefab, name, revealsMap);
        this.gameCharacters[name].rollInitiative();
        this.gameCharacters[name].place(position);
        this.add(this.gameCharacters[name]);
        if (initiative == null) {
            this.gameCharacters[name].rollInitiative();
        }
        else this.gameCharacters[name].initiative = initiative;
        this.update();
        return this.gameCharacters[name];
    }

    fillInitiativeOrder() {
        this.initiativeOrder = [];
        for (var key in this.gameCharacters) {
            this.initiativeOrder.push(this.gameCharacters[key]);
        }
        this.initiativeOrder.sort((a, b) => b.initiative - a.initiative);
        return this.initiativeOrder;
    }
}