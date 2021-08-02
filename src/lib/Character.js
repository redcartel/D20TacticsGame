import { toSpaceCoords } from './util';
import AnimationPath from './AnimationPath';

export default class Character {
    animationGroup;

    constructor(name, sprite = null, position = null, scale = null) {
        this.name = name;
        this.sprite = sprite;
        if (position) this.position = position;
        else this.position = [0, 0, 0];
        if (scale) this.scale = null;
        else this.scale = [1, 1];

        _i.createCharacter(this.name, this.sprite?.name, this.scale)
    }

    destroy() {
        try {

            _i.destroyCharacter(this.name);
            console.log('destroy ' + this.name);
        }
        catch (e) {
            console.error(`Error calling _i.destroyCharacter for ${this.name}`);
            console.error(e);
        }
    }

    place(position) {
        this.position = position;
        try {
            _i.placeCharacter(this.name, toSpaceCoords(this.position));
        }
        catch (e) {
            console.error(`Error calling _i.placeCharacter for ${this.name} ${JSON.stringify(this.position)}`);
            console.error(e);
        }
    }

    setSprite(sprite) {
        this.sprite = sprite;
        _i.setCharSprite(this.name, this.sprite?.name);
    }

    setAnimationGroup(group, reset = false) {
        console.log('set animation group ' + group.name);
        if (!(this.animationGroup) || this.animationGroup.name !== group.name) {
            try {
                _i.setCharacterAnimationGroup(this.name, group.name, reset)
                this.animationGroup = group;
            }
            catch (e) {
                console.error(`Error calling _i.setCharacterAnimationGroup on ${this.name} with ${JSON.stringify(group)}`);
                console.error(e);
            }
        }
    }

    setPath(path) {
        try {
            _i.attachPath(this.name, path.name);
        }
        catch (e) {
            console.error(`Error calling _i.setPath for ${this.name} on ${path.name}: ${JSON.stringify(path)}`);
            console.error(e);
        }
    }

    setFacing(facing) {
        try {
            _i.setCharacterFacing(this.name, facing);
        }
            catch (e) {
                console.error(`Error calling _i.setFacing for ${this.name} with ${facing}`);
                console.error(e);
        }
    }

    setPathFromSequence(coordList, animationGroup, ticks = 15, _eval = null) {
        var _path = AnimationPath.fromSequence(this.name + '_path', animationGroup, coordList, ticks, _eval);
        this.setPath(_path);
    }

    followWithCamera() {
        try {
            _i.focusCameraOnCharacter(this.name);
        }
        catch (e) {
            console.error(`Error calling _i.focusCameraOnCharacter for ${this.name}`);
            console.error(e);
        }
    }

    unfollowWithCamera() {
        try {
            _i.unfocusCamera()
        }
        catch (e) {
            console.error(`Error calling _i.unfocusCamera for ${this.name}`);
            console.error(e);
        }
    }

    centerInCamera() {
        try {
            _i.moveCameraToCharacter(this.name);
        }
        catch (e) {
            console.error(`Error calling _i.moveCameraToCharacter for ${this.name}`);
            console.error(e);
        }
    }

    characterClick() {
        console.log(`Script detected click on ${this.name}`);
    }

    destroy() {
        try {

        }
        catch (e) {

        }
    }
}

window.Character = Character;