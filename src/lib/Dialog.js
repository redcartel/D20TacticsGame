export default class Dialog {
    constructor(name = null, text = null, portraitTexture = null, rightSide = false) {
        if (name == null) name = '__default__';
        this.name = name;
        this.text = text;
        this.portraitTexture = portraitTexture;
        this.rightSide = false;
        if (portraitTexture == null) {
            portraitTexture = { name: null };
        }
        try {
            _i.createDialog(name, text, portraitTexture.name, rightSide)
        }
        catch (e) {
            console.error(`Error calling _i.createDialog for ${this.name} with portrait ${portraitTexture.name} rightside=${rightSide}`);
            console.error(e);
        }
    }

    place(position = null, size = null) {
        try {
            _i.placeDialog(this.name, position, size);
        }
        catch (e) {
            console.error(`Error calling _i.placeDialog for ${this.name} with position ${position}, size ${size}`);
            console.error(e);
        }
    }

    destroy() {
        try {
            _i.destroyDialog(this.name);
        }
        catch (e) {
            console.error(`Error calling _i.destroyDialog for ${this.name}`);
            console.error(e);
        }
    }

    setText(text, seconds = null) {
        try {
            _i.setDialogText(this.name, text, seconds);
        }
        catch (e) {
            console.error(`Error calling _i.setDialogText for ${this.name} with ${this.text} seconds=${this.seconds}`);
            console.error(e);
        }
    }

    addButton(text, position, size, script) {
        try {
            _i.addButtonToDialog(this.name, text, position, size, script);
        }
        catch (e) {
            console.error(`Error calling _i.addButtonToDialog with ${text} ${JSON.stringify(position)} ${JSON.stringify(size)} ${script}`);
            console.error(e);
        }
    }
}

window.Dialog = Dialog;