export function toMapCoords(coords) {
    return [Math.round(coords[0]), Math.round(coords[1] * 2), Math.round(coords[2])];
}

export function toSpaceCoords(coords) {
    return [coords[0], coords[1] / 2, coords[2]];
}

window.toMapCoords = toMapCoords;
window.toSpaceCoords = toSpaceCoords;