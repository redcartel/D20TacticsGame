export default class Animation {
    constructor(name, frames = [], loop = true) {
        this.name = name;
        var details = _i.getSpriteDetails(this.name);
        if (details != null && details.length > 0) {
            return;
        }
        this.loop = loop;
        // TODO: Non-looping animations are weird, clean them up
        _i.createAnimation(this.name, loop);
        this.frames = [];
        for (var frame of frames) {
            this.addFrame(frame);
        }
    }

    addFrame(frame) {
        if (!frame || frame['sprite'] == undefined) return;
        let spriteName = frame.sprite.name;
        let ticks = frame['ticks'] ?? 15;
        let flip = frame['flip'] ?? false;
        let position, offset;
        // if (frame['position']) position = toSpaceCoords(frame.position);
        // else position = [0, 0, 0];
        if (frame['offset']) offset = frame['offset'];
        else offset = [0, 0, 0];
        let spacePosition = [offset[0], offset[1], offset[2]];
        try {
            _i.addFrame(this.name, spriteName, ticks, flip, spacePosition);
        }
        catch (e) {
            console.error("Error calling _i.addFrame with " + this.name + ", " + this.spriteName + ", " +
                ticks + ", " + flip + ", " + JSON.stringify(spacePosition));
            console.error(e);
        }
        this.frames.push(frame);
    }

    toString() {
        var message = "Animation(" + this.name + ") {";
        for (var frame of this.frames) {
            message += `frame(${frame.sprite?.name} ${frame.ticks ?? 15} ${frame.flip ?? false} ${frame.offset}), `;
        }
        message += "}";
        return message;
    }
}

window.Animation = Animation;