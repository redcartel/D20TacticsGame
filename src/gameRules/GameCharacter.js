import Character from '../lib/Character';
import AnimationPath from '../lib/AnimationPath';
import Callback from '../lib/Callback';

export default class GameCharacter {

    prefab;
    position;
    animationState = 'idle';
    sheet = {};
    walkPath = [];
    animations;
    name;

    constructor(name) {
        this.name = name;
        this.position;
    }

    static fromPrefab(prefab, name) {
        var newC = new GameCharacter(name);
        newC.prefab = prefab;

        for (var key in prefab?.sheet ?? {}) {
            newC.sheet[key] = prefab.sheet[key];
        }
        newC.animations = {};
        for (var key in prefab?.animations ?? {}) {
            newC.animations[key] = prefab.animations[key];
        }

        newC.character = new Character(name, prefab.defaultSprite ?? null, null, prefab.scale ?? null);
        this.animationState = 'idle';
        if (newC.animations.idle) newC.character.setAnimationGroup(newC.animations.idle);
        return newC;
    }

    place(position) {
        this.position = position;
        this.character.place(position);
    }

    centerCameraOn() {
        this.character.centerInCamera();
    }

    updateState(state) {
    }

    initiative = 10;

    rollInitiative() {
        var mod = 0;
        if ('dex' in this.sheet) mod = Math.floor((this.sheet.dex - 10) / 2);
        this.initiative = Math.ceil(Math.random() % 20);
    }

    updateState() {
        if (this.prefab?.animations && this.prefab.animations[this.animationState]) {
            this.character.setAnimationGroup(this.prefab.animations[this.animationState]);
        }

        if (this.walkPath && this.walkPath.length >= 2) {
            console.log('game character found walk path');
            var finalSquare = this.walkPath[this.walkPath.length - 1];
            var endWalk = new Callback(() => {
                this.place(finalSquare);
                this.state.update();
                this.state.stateChain = ['turn', 'mainMenu'];
                this.state.loop.go();
            })
            this.character.setPathFromSequence(this.walkPath, this.animations['walk'], 15, endWalk.callString);
            this.walkPath = [];
        }
    }
}