export const setOnScreenControls = (active = true) => {
    try {
        _i.onScreenControls(active);
    }
    catch (e) {
        console.error(`Error calling _i.onScreenControls with ${active}`);
        console.error(e);
    }
}

export default class UIManager {
    constructor() {
        window.characterClick = this.receiveCharacterClick;
    }

    clear() {
        this.setOnScreenControls(false);
        window.characterClick = () => {};
        window.backButton = () => {};
    }

    setOnScreenControls = (active = true) => {
        try {
            _i.onScreenControls(active);
        }
        catch (e) {
            console.error(`Error calling _i.onScreenControls with ${active}`);
            console.error(e);
        }
    }

    registerCharacterForClicks = (character) => {
        window._clickableCharacters[character.name] = character;
    }
    
    unregisterCharacterForClicks = (character) => {
        window._clickableCharacters[character.name] = undefined;
    }
    
    receiveCharacterClick = (name) => {
        if (name in window._clickableCharacters[name]) {
            window._clickableCharacters[name].receiveClick();
        }
    }

    clearCharacterClicks = () => {
        window._clickableCharacters = {};
    }

    setBackButton = (fn) => {
        window.backButton = fn;
    }
}