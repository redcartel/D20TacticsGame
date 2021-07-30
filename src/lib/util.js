export function toMapCoords(coords) {
    return [Math.round(coords[0]), Math.round(coords[1] * 2), Math.round(coords[2])];
}

export function toSpaceCoords(coords) {
    return [coords[0], coords[1] / 2, coords[2]];
}

function coordsInList(coords, list) {
    console.log('coords In List');
    for (var checkCoords of list) {
        console.log('' + checkCoords + ' vs ' + coords);
        if (checkCoords == null) continue;
        if (coords.length != checkCoords.length) continue;
        var match = true;
        for (var i = 0; i < coords.length; i++) {
            if (coords[i] != checkCoords[i]) {
                match = false;
            }
        }
        if (match) return true;
    }
    return false;
}

window.coordsInList = coordsInList;
window.toMapCoords = toMapCoords;
window.toSpaceCoords = toSpaceCoords;