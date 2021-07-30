import HighlightGroup from '../lib/HighlightGroup'

export default class MapHighlight {
    gameState;
    hg;

    constructor() {
        this.name = `${Math.random()}`;
        this.hg = new HighlightGroup();
    }

    updated = false;
    clear = false;

    highlightAround(position, radius, except = null) {
        this.updated = true;
        var highlightCoords = this.gameState.map.closeSurfaces(position, radius) 
        this.hg.highlightMultiple(highlightCoords, [0]);
    }

    updateState() {
        if (this.clear) {
            console.log(this.hg);
            this.hg.clearHighlights();
            this.clear = false;
            this.updated = false;
        }
        else if (this.updated) {
            this.hg.showHighlights();
            this.updated = false;
        }
    }

    clearHighlights() {
        this.clear = true;
    }

    get coordFaces() {
        return this.hg.voxels;
    }
}