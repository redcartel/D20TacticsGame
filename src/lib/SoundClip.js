export default class SoundClip {
    constructor(name, path) {
        this.name = name;
        var details = _i.getSoundDetails(name);
        if (details != null && details.length > 0) return;
        try {
            _i.loadSound(name, window.modPath, path);
        }
        catch (e) {
            console.error(`Error calling _i.loadSound with ${name} and ${path}, window.modPath = ${window.modPath}`);
            console.error(e);
        }
    }
}

window.SoundCLip = SoundClip;