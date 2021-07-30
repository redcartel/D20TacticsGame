var strToCoords = (str) => {
    var split = str.split(',');
    var nums = split.map(intStr => parseInt(intStr));
    return nums;
}

export default class Map {

    constructor(dimensions) {
        this.rendered = false;
        this.dimensions = dimensions;
        this.lights = [];
        this._createFreshGrid();
        window.faceClick = (coords, face) => this.receiveClick(coords, face);
    }

    attachState(gameState) {
        gameState.map = this;
    }

    receiveClick(coords, face) {
        console.log(JSON.stringify(coords) + ': ' + face);
    }

    addLight(light) {
        this.lights.push(light);
    }

    lightsOff() {
        for (var light of this.lights) {
            light.off();
        }
    }

    removeAllLights() {
        // TODO
    }

    _createFreshGrid() {
        this.blocks = [];
        this.surfaces = [];
        for (var x = 0; x < this.dimensions[0]; x++) {
            var xSheet = [];
            var sxSheet = [];
            for (var y = 0; y < this.dimensions[1]; y++) {
                var yRow = [];
                var syRow = [];
                for (var z = 0; z < this.dimensions[2]; z++) {
                    yRow.push(null);
                    syRow.push(null);
                }
                xSheet.push(yRow);
                sxSheet.push(yRow);
            }
            this.blocks.push(xSheet);
            this.surfaces.push(sxSheet);
        }
    }

    clearance(coords) {
        for (var y = coords[1] + 1; y < this.dimensions[1]; y++) {
            if (this.blocks[coords[0]][y][coords[2]] != null) {
                return (y - coords[1] - 1);
            };
        }
        return Infinity;
    }

    subClearance(coords) {
        for (var y = coords[1] - 1; y >= 0; y--) {
            if (this.blocks[coords[0]][y][coords[2]] != null) {
                return (coords[1] - y - 1);
            };
        }
        return Infinity;
    }

    // TODO: For now, maps can only be added to prior to rendering
    addVoxel(blockCoordinates, voxelDef) {
        if (this.rendered) return;
        if (blockCoordinates[0] < 0 || blockCoordinates[0] >= this.dimensions[0] || blockCoordinates[1] < 0 || blockCoordinates[1] >= this.dimensions[1] || blockCoordinates[2] < 0 || blockCoordinates[2] >= this.dimensions[2]) {
            console.error(`Coordinates ${blockCoordinates[0]}, ${blockCoordinates[1]}, ${blockCoordinates[2]} are outside of map dimension`);
            return;
        }
        //_i.placeVoxel(blockCoordinates, voxelDef.name);
        this.blocks[blockCoordinates[0]][blockCoordinates[1]][blockCoordinates[2]] = voxelDef;
    }

    _genTextureToCoordsMap() {
        this.texMap = {};
        for (var x = 0; x < this.dimensions[0]; x++) {
            for (var y = 0; y < this.dimensions[1]; y++) {
                for (var z = 0; z < this.dimensions[2]; z++) {
                    if (this.blocks[x][y][z] != null) {
                        var voxelDef = this.blocks[x][y][z];
                        if (voxelDef.name in this.texMap) {
                            this.texMap[voxelDef.name].push([x, y, z]);
                        }
                        else {
                            this.texMap[voxelDef.name] = [[x, y, z]];
                        }
                    }
                }
            }
        }
    }

    _getSurfaces() {
        this.rawSurfaceData = _i.mapSurfaces();
        for (var coords of this.rawSurfaceData) {
            this.surfaces[coords[0]][coords[1]][coords[2]] = true;
        }
    }

    render() {
        this._genTextureToCoordsMap();
        for (var key in this.texMap) {
            _i.placeVoxelsOfDefinition(key, this.texMap[key]);
        }
        this.rendered = true;
        _i.genAllQuads();
        this._getSurfaces();
    }

    // unrender() {
    //     this.rendered = false;
    //     _i.clearQuads();
    // }

    clearGameObjects() {
        this.rendered = false;
        _i.clearVoxels();
    }

    clearAndWipe() {
        this.rendered = false;
        _i.clearVoxels();
        this._createFreshGrid();
    }

    H(from, to) {
        return Math.abs(from[0] - to[0]) + Math.abs(from[2] - to[2]);
    }

    pathAdjacencies(square, clearance = 2, exploreNonSurfaces = false, stepUp = true, stepDown = true) {
        // if (square == null) return [];
        // if (square[0] < 0 || square[0] >= this.dimensions[0]) return [];
        // if (square[1] < 1 || square[1] >= this.dimensions[1]) return [];
        // if (square[2] < 2 || square[2] >= this.dimensions[2]) return [];

        if (!exploreNonSurfaces && this.surfaces[square[0]][square[1]][square[2]] !== true) return [];
        var _adjacencies = [];
        var possibilities = [[1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]]
        if (stepUp) possibilities.push([1, 1, 0]);
        if (stepUp) possibilities.push([0, 1, 1]);
        if (stepUp) possibilities.push([-1, 1, 0]);
        if (stepUp) possibilities.push([0, 1, -1]);
        if (stepDown) possibilities.push([1, -1, 0]);
        if (stepDown) possibilities.push([-1, -1, 0]);
        if (stepDown) possibilities.push([0, -1, 1]);
        if (stepDown) possibilities.push([0, -1, -1]);
        for (var delta of possibilities) {
            var checkX = square[0] + delta[0];
            var checkY = square[1] + delta[1];
            var checkZ = square[2] + delta[2];
            
            if (checkX < 0 || checkX >= this.dimensions[0]) continue;
            if (checkY < 0 || checkY >= this.dimensions[1]) continue;
            if (checkZ < 0 || checkZ >= this.dimensions[2]) continue;
            if (this.clearance([checkX, checkY, checkZ]) < clearance) {
                //console.log('Insufficient clearance at ' + JSON.stringify([checkX, checkY, checkZ]));
                continue;}
            if (exploreNonSurfaces) {
                _adjacencies.push([checkX, checkY, checkZ]);
            }
            else {
                //console.log(`surfaces ${checkX} = ${JSON.stringify(this.surfaces[checkX])}`);
                if (this.surfaces[checkX][checkY][checkZ] == true) {
                    _adjacencies.push([checkX, checkY, checkZ]);
                }
            }
        }
        return _adjacencies;
    }

    canPath(from, to) {
        var fx = from[0]; var fy = from[1]; var fz = from[2];
        var tx = to[0]; var ty = to[1]; var tz = to[2];
        if (fx < 0 || fx >= this.dimensions[0] || tx < 0 || tx >= this.dimensions[0]) return false;
        if (fy < 0 || fy >= this.dimensions[1] || ty < 0 || ty >= this.dimensions[1]) return false;
        if (fz < 0 || fz >= this.dimensions[2] || tz < 0 || tz >= this.dimensions[2]) return false;
        if (this.surfaces[fx][fy][fz] != true) return false;
        if (this.surfaces[tx][ty][tz] != true) return false;
        return true;
    }

    reconstruct(cameFrom, current) {
        var totalPath = [current];
        while (current in cameFrom) {
            current = cameFrom[current];
            totalPath.push(current);
        }
        var reversed = [];
        for (var i = totalPath.length - 1; i >= 0; i--) {
            reversed.push(totalPath[i]);
        }
        return reversed;
    }

    aStar(from, to, clearance = 2, exploreNonSurfaces = false, stepUp = true, stepDown = true) {
        if (exploreNonSurfaces !== true) exploreNonSurfaces = false;
        if (!exploreNonSurfaces) {
            if (!this.canPath(from, to)) return null;
        }
        var openHeap = new MinHeap();
        var cameFrom = {};
        var gScore = {};
        gScore[from] = 0;
        var gOf = (coord) => {
            if (coord in gScore) return gScore[coord];
            return Infinity;
        };
        var fScore = {};
        fScore[from] = this.H(from, to);
        var fOf = (coord) => {
            if (coord in fScore) return fScore[coord];
            return Infinity;
        }

        openHeap.insert([fScore[from], from]);
        while (openHeap.size > 0) {
            var current = openHeap.getMin();
            var coords = current[1];
            // if at goal, return the path to this point
            if (coords[0] == to[0] && coords[1] == to[1] && coords[2] == to[2]) {
                return this.reconstruct(cameFrom, coords);
            }
            openHeap.remove();
            for (var neighbor of this.pathAdjacencies(coords, clearance, exploreNonSurfaces, stepUp, stepDown)) {
                // TODO: movement with cost other than 5feet
                var tentativeGScore = gOf(coords) + 5;
                if (tentativeGScore < gOf(neighbor)) {
                    cameFrom[neighbor] = coords;
                    gScore[neighbor] = tentativeGScore;
                    fScore[neighbor] = tentativeGScore + this.H(neighbor, to);
                    openHeap.insert([fScore[neighbor], neighbor]);
                }
            }
        }
    }

    /**
     * All surface coordinates within d steps of an origin
     */
    closeSurfaces(coords, d) {
        var selectedSquares = {};
        if (!this.surfaces[coords[0], coords[1], coords[2]]) {
            return selectedSquares;
        }
        selectedSquares[coords] = 0; // creates string of the coords array to use as key
        for (var currentD = 0; currentD < d; currentD++) {
            var addCoords = [];
            for (var strCoords in selectedSquares) {
                var surfaceCoords = strToCoords(strCoords);
                if (selectedSquares[strCoords] == currentD) {
                    var adjCoords;
                    for (adjCoords of this.pathAdjacencies(surfaceCoords, 2)) { // TODO: make clearance variable
                        if (!(adjCoords in selectedSquares)) {
                            addCoords.push(adjCoords);
                        }
                    }
                }
            }
            for (var newCoords of addCoords) {
                selectedSquares[newCoords] = currentD + 1;
            }
        }
        var result = [];
        for (var strCoords in selectedSquares) {
            var intCoords = strToCoords(strCoords);
            result.push(intCoords);
        }
        return result;
    }
}

// copied and pasted from a blog where comments suggest there are bugs.
// but it seems to work
// TODO: investigate this
class MinHeap {

    constructor() {
        /* Initialing the array heap and adding a dummy element at index 0 */
        this.heap = [null]
    }

    get size() {
        return this.heap.length - 1;
    }

    getMin() {
        /* Accessing the min element at index 1 in the heap array */
        return this.heap[1]
    }

    // node = [score, value]
    insert(node) {

        /* Inserting the new node at the end of the heap array */
        this.heap.push(node)

        /* Finding the correct position for the new node */

        if (this.heap.length > 1) {
            let current = this.heap.length - 1

            /* Traversing up the parent node until the current node (current) is greater than the parent (current/2)*/
            while (current > 1 && this.heap[Math.floor(current / 2)][0] > this.heap[current][0]) {

                /* Swapping the two nodes by using the ES6 destructuring syntax*/
                [this.heap[Math.floor(current / 2)], this.heap[current]] = [this.heap[current], this.heap[Math.floor(current / 2)]]
                current = Math.floor(current / 2)
            }
        }
    }

    remove() {
        /* Smallest element is at the index 1 in the heap array */
        let smallest = this.heap[1]

        /* When there are more than two elements in the array, we put the right most element at the first position
            and start comparing nodes with the child nodes
        */
        if (this.heap.length > 2) {
            this.heap[1] = this.heap[this.heap.length - 1]
            this.heap.splice(this.heap.length - 1)

            if (this.heap.length === 3) {
                if (this.heap[1][0] > this.heap[2][0]) {
                    [this.heap[1], this.heap[2]] = [this.heap[2], this.heap[1]]
                }
                return smallest
            }

            let current = 1
            let leftChildIndex = current * 2
            let rightChildIndex = current * 2 + 1

            while (this.heap[leftChildIndex] &&
                this.heap[rightChildIndex] &&
                (this.heap[current][0] > this.heap[leftChildIndex][0] ||
                    this.heap[current][0] > this.heap[rightChildIndex][0])) {
                if (this.heap[leftChildIndex][0] < this.heap[rightChildIndex][0]) {
                    [this.heap[current], this.heap[leftChildIndex]] = [this.heap[leftChildIndex], this.heap[current]]
                    current = leftChildIndex
                } else {
                    [this.heap[current], this.heap[rightChildIndex]] = [this.heap[rightChildIndex], this.heap[current]]
                    current = rightChildIndex
                }

                leftChildIndex = current * 2
                rightChildIndex = current * 2 + 1
            }
        }

        else if (this.heap.length === 2) {
            this.heap.splice(1, 1)
        } else {
            return null
        }

        return smallest
    }
}

window.Map = Map;