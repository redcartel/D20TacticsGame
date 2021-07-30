export default class HighlightGroup {
    constructor() {
        this.voxels = [];
    }

    highlightFaces(voxelPosition, faces) {
        this.voxels.push([voxelPosition, faces]);
    }

    highlightMultiple(coordinateList, faces = null) {
        try {
            if (!coordinateList) coordinateList = [];
            if (!faces) faces = [0, 1, 2, 3, 4];
            for (var coords of coordinateList) {
                this.highlightFaces(coords, faces);
            }
        }
        catch (e) {
            console.error(`Error calling HighlightGroup.highlightMultpile with ${JSON.stringify(coordinateList)} and ${JSON.stringify(faces)}`);
            console.error(e);
        }
    }

    showHighlights() {
        var positions = [];
        var faces = [];
        for (var positionFaces of this.voxels) {
            positions.push(positionFaces[0]);
            faces.push(positionFaces[1]);
        }
        try {
            _i.highlightFaces(positions, faces);
        }
        catch (e) {
            console.error(`Error calling _i.highlightFaces for positions ${JSON.stringify(positions)} and faces ${JSON.stringify(faces)}`);
            console.error(e);
        }
    }

    clearHighlights() {
        var positions = [];
        var faces = [];
        for (var positionFaces of this.voxels) {
            positions.push(positionFaces[0]);
            faces.push(positionFaces[1]);
        }
        try {
            _i.clearHighlights(positions, faces);
            this.voxels = [];
        }
        catch (e) {
            console.error(`Error calling _i.clearHighlights for positions ${JSON.stringify(positions)} and faces ${JSON.stringify(faces)}`);
            console.error(e);
        }
    }
}

window.HighlightGroup = HighlightGroup;