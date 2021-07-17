import {toSpaceCoords} from './util';
import AnimationPath from './AnimationPath';

export default  class Character {
    constructor(name, sprite = null, position = null, scale = null) {
        this.name = name;
        this.sprite = sprite;
        if (position) this.position = position;
        else this.position = [0, 0, 0];
        if (scale) this.scale = null;
        else this.scale = [1, 1];

        _i.createCharacter(this.name, this.sprite?.name, this.scale)
    }

    place(position = null) {
        if (position != null) this.position = position;
        if (this.position == null) this.position = [0, 0, 0];
        _i.placeCharacter(this.name, toSpaceCoords(this.position))
    }

    setSprite(sprite) {
        this.sprite = sprite;
        _i.setCharSprite(this.name, this.sprite?.name);
    }

    setAnimationGroup(group) {
        try {
            _i.setCharacterAnimationGroup(this.name, group.name)
        }
        catch (e) {
            console.error(`Error calling _i.setCharacterAnimationGroup on ${this.name} with ${JSON.stringify(group)}`);
            console.error(e);
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

    setPathFromSequence(coordList, animationGroup, ticks = 15, _eval=null) {
        var _path = AnimationPath.fromSequence(this.name + '_path', animationGroup, coordList, ticks, _eval);
        console.log(JSON.stringify(_path));
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
}

window.Character = Character;