export default class Decal {
    constructor(name, texture, outline = false) {
        this.name = name;
        this.outline = outline;
        if (texture == null) texture = {name: null};
        try {
            _i.createDecal(name, texture.name, outline);
        }
        catch (e) {
            console.error(`Error calling _i.createDecal for ${this.name} with texture ${texture.name}`);
            console.error(e);
        }
    }

    place(position = null, rotation = null, scale = null) {
        try {
            _i.placeDecal(this.name, position, rotation, scale);
        }
        catch (e) {
            console.error(`Error calling _i.placeDecal for ${this.name} at position ${position}, rotation ${rotation}, scale ${scale}`);
            console.error(e);
        }
    }

    destroy() {
        try {
            _i.removeDecal(this.name);
        }
        catch (e) {
            console.error(`Error calling _i.destroyDecal for ${this.name}`);
            console.error(e);
        }
    }
}

window.Decal = Decal;