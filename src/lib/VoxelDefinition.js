export default class VoxelDefinition {
    // TODO: BORDER AND EBB
    constructor(name, textures) {
        this.textures = textures;
        var _textures = textures.map(tex => tex.name);
        this.name = name;
        _i.defineVoxel(this.name, _textures, null, 1.0);
    }

    toString() {
        return `VoxelDefinition(${this.name}, ${this.textures.map(tex => tex.name)})`;
    }
}

window.VoxelDefinition = VoxelDefinition;