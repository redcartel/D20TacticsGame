export default class AudioSource {
    constructor(name = "__default__", loop = false) {
        this.name = name;
        this.loop = loop;
    }

    playSound(soundClip) {
        try {
            _i.playSound(soundClip.name, this.name, this.loop);
        }
        catch (e) {
            console.error(`Error calling _i.playSound on ${this.name} with soundClip ${soundClip.name} loop = ${loop}`);
            console.error(e);
        }
    }
}

window.AudioSource = AudioSource;