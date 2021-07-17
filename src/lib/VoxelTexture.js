export default class VoxelTexture {
    constructor(name, path) {
        this.name = name;
        var details = _i.getTextureDetails(name);
        if (details != null && details.length > 0) return;
        _i.loadBlockTexture(this.name, window.modPath, path)
    }
}

window.VoxelTexture = VoxelTexture;