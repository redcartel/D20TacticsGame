export default class UIImage {
    constructor(name, sprite) {
        this.name = name;
        try {
            _i.createUIImage(name, sprite.name);
        }
        catch (e)
        {
            console.error(`Error calling _i.createUIImage with ${name} and ${sprite.name}`);
            console.error(e);
        }
    }

    place(rect) {
        try {
            _i.placeUIImage(this.name, rect);
        }
        catch (e) {
            console.error(`Error calling _i.placeUIImage with ${this.name} and ${sprite.name} and ${JSON.stringify(rect)}`);
            console.error(e);
        }
    }

    delete() {
        try {
            _i.destroyUIImage(this.name);
        }
        catch (e) {
            console.error(`Error calling _i.deleteUIImage with ${this.name}`);
            console.error(e);
        }
    }
}