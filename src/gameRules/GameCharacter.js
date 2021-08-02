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
    HP;
    deathSaveSuccesses = 0;
    deathSaveFailures = 0;

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

        newC.HP = newC.sheet.HP ?? 1;

        newC.animations = {};
        for (var key in prefab?.animations ?? {}) {
            newC.animations[key] = prefab.animations[key];
        }

        newC.character = new Character(name, prefab.defaultSprite ?? null, null, prefab.scale ?? null);
        this.animationState = 'idle';
        if (newC.animations.idle) newC.character.setAnimationGroup(newC.animations.idle);
        return newC;
    }

    place(position = null, facing = null) {
        if (position != null) {
            this.position = position;
            this.character.place(position);
        }
        if (facing != null) {
            this.character.setFacing(facing);
        }
    }

    centerCameraOn() {
        this.character.centerInCamera();
    }

    initiative = 10;

    rollInitiative() {
        var mod = 0;
        if ('dex' in this.sheet) mod = Math.floor((this.sheet.dex - 10) / 2);
        this.initiative = Math.ceil(Math.random() * 20) + mod;
    }

    _lastAnimationState;
    updateState() {
        if (this.HP <= 0) this.animationState = 'die';
        if (this.animationState && this.animationState != this._lastAnimationState) {
            if (this.prefab?.animations && this.prefab.animations[this.animationState]) {
                var reset = false;
                // TODO: this is a hack, seriously, animations need work
                if (this.animationState == 'die' || this.animationState == 'attack') {
                    console.log('Javascript reset');
                    reset = true;
                }
                this.character.setAnimationGroup(this.prefab.animations[this.animationState], reset);
            }
            this._lastAnimationState = this.animationState;
        }

        if (this.walkPath && this.walkPath.length >= 2) {
            this.animationState = 'walk';
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

    attack(targetGameCharacter) {
        console.log(this.name + ' attacks ' + targetGameCharacter.name);
        this.turn.actions = this.turn.actions.filter(act=>act != 'action');
        console.log('' + this.turn.actions);
        var damage = Math.ceil(Math.random() * 6);
        targetGameCharacter.HP -= damage;
        this.state.ui.popup = `${this.name} attack ${targetGameCharacter.name} for ${damage} damage`;
        if (targetGameCharacter.HP <= 0) this.state.ui.popup += ` ${targetGameCharacter.name} dies`;
        this.state.update();
    }

    // TODO: set facing
}