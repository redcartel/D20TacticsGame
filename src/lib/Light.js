export default class Light {
    constructor(name, type = null, position = null, rotation = null, intensity = null, range = null, angle = null, color = null) {
        this.name = name;
        var _type = "point";
        if (type == "directional") _type = "directional";
        if (type == "spot") _type = "spot";
        if (position === null) position = [0, 0, 0];
        if (rotation === null) rotation = [90, 0, 0];
        if (intensity === null) intensity = 1.0;
        if (range === null) range = 10.0;
        if (angle === null) angle = 20.0;
        if (color === null) color = [255, 255, 255, 255];
        this.type = type;
        this.position = position;
        this.rotation = rotation;
        this.intensity = intensity;
        this.range = range;
        this.angle = angle;
        this.color = color;
        this.createObject();
    }

    createObject() {
        if (this.type === "point") {
            try {
                _i.createPointLight(this.name, this.position, this.intensity, this.range, this.color);
            }
            catch (e) {
                console.error(`Error calling _i.createPointLight from {this.toString()}.`);
                console.error(e);
            }
        }
        else if (this.type === "directional") {
            try {
                _i.createDirectionalLight(this.name, this.rotation, this.intensity, this.color);
            }
            catch (e) {
                console.error(`Error calling _i.createDirectionalLight from {this.toString()}.`);
                console.error(e);
            }
        }
        else if (this.type === "spot") {
            try {
                _i.createSpotLight(this.name, this.position, this.rotation, this.intensity, this.range, this.angle, this.color);
            }
            catch (e) {
                console.error(`Error calling _i.createDirectionalLight from {this.toString()}.`);
                console.error(e);
            }
        }
        else {
            console.error('Invalid type on ' + this.toString());
        }
    }

    off() {
        _i.setLightActive(this.name, false);
    }

    on() {
        _i.setLightActive(this.name, true);
    }

    toString() {
        return `Light({this.name}, {this.type}, {JSON.stringify(this.position)}, {JSON.stringify(this.rotation)}, {this.intensity}, {this.range}, {this.angle}, {JSON.stringify(this.color)})`;
    }
}

window.Light = Light;