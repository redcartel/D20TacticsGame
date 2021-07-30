import Character from '../lib/Character';
import AnimationPath from '../lib/AnimationPath';

export default class GameCharacter {

    prefab;
    position;
    animationState = 'idle';
    sheet = {};
    animationPath = [];
    animations;
    name;

    constructor(prefab, name, position) {
        this.prefab = prefab;
        this.position = position;
        this.name = name;

        for (var key in prefab?.sheet ?? {}) {
            this.sheet[key] = prefab.sheet[key];
        }
        this.animations = {};
        for (var key in prefab?.animations ?? {}) {
            this.animations[key] = prefab.animations[key];
        }

        this.character = new Character(name, prefab.defaultSprite ?? null, null, prefab.scale ?? null);
    }

    updateState(state) {
        var found = false;
        for (var key in state.gameCharacters) {
            var gC = state.gameCharacters[key];
            if (gC == this) {
                found = true;
                
                this.character.place(this.position);
                
                var animationGroup;
                if (this.prefab?.animations && this.prefab.animations[this.animationState]) {
                    this.character.setAnimationGroup(this.prefab.animations[this.animationState]);
                }

                if (this.animationPath) {
                    this.animateWalkPath();
                }
                break;
            }
        }
        if (!found) {
            console.error(`character ${this.character.name} in listeners and not in gameCharacters`);
        }
    }

    initiative;

    rollInitiative() {
        this.initiative = Math.ceil(Math.random() % 20);
    }

    // TODO: The entire way this is happening sucks
    animateWalkPath() {
        if (!this.animationPath || this.animationPath.length == 0) return;
        this.animationState = 'walk';
        var key = '_' + this.name + Math.random();
        window[`${key}`] = () => {
            // TODO: real action choices
            this.gameState.nextTurn();
        };
        var animationPath = AnimationPath.fromSequence(key, this.animations[this.animationState], this.animationPath, 15, 
            `window["${key}"]()`);
        this.character.setPath(animationPath);
        this.animationPath = [];
    }
}