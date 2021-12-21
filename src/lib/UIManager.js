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
        window.characterMove = this.receiveCharacterMove;
    }

    clear() {
        this.setOnScreenControls(false);
        window.characterClick = () => {};
        window.backButton = () => {};
    }

    setOnScreenControls(active = true) {
        try {
            _i.onScreenControls(active);
        }
        catch (e) {
            console.error(`Error calling _i.onScreenControls with ${active}`);
            console.error(e);
        }
    }

    registerCharacterForClicks(character) {
        window._clickableCharacters[character.name] = character;
    }

    registerCharacterForMove(character) {
        window._moveCallbackCharacters[character.name] = character;
    }

    unregisterCharacterForMove(character) {
        window._moveCallebackCharacters[character.name] = character;
    }
    
    unregisterCharacterForClicks(character) {
        window._clickableCharacters[character.name] = undefined;
    }
    
    receiveCharacterClick(name) {
        if (name in window._clickableCharacters[name]) {
            window._clickableCharacters[name].receiveClick();
        }
    }

    receiveCharacterMove(name) {
        if (name in window._moveCallbackCharacters[name]) {
            window._moveCallbackCharacters.moveCallback();
        }
    }

    clearCharacterClicks() {
        window._clickableCharacters = {};
    }

    setBackButton(fn) {
        window.backButton = fn;
    }

    static get width() {
        return _i.screenWidth();
    }

    static get height() {
        return _i.screenHeight();
    }

    static widthOrMax(width) {
        return Math.min(width, this.width);
    }

    static heightOrMax(height) {
        return Math.min(height, this.height);
    }
}