export default class Sprite {
    constructor(name, path = null, pivot = null, rect = null) {
        this.name = name;
        var details = _i.getSpriteDetails(this.name);
        if (details != null && details.length > 0) {
            return;
        }
        _i.loadSprite(this.name, window.modPath, path, pivot, rect)
    }
}

window.Sprite = Sprite;