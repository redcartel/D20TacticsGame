export default class DecalTexture {
    constructor(name, path, lit = false) {
        this.name = name;
        var details = _i.getTextureDetails(name);
        if (details != null && details.length > 0) return;
        this.lit = lit;
        try {
            _i.loadFlatTexture(name, window.modPath, path, lit);
        }
        catch (e) {
            console.error(`Error calling _i.loadFlatTexture for ${this.name} for path ${path} with modPath ${window.modPath}`);
            console.error(e);
        }
    }
}

window.DecalTexture = DecalTexture;