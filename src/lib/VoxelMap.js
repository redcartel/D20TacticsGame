import PriorityQueue from "./PriorityQueue";

var strToCoords = (str) => {
    var split = str.split(',');
    var nums = split.map(intStr => parseInt(intStr));
    return nums;
}

export default class VoxelMap {
    constructor(settings = {}) {
        this.settings = settings;
        this.yMax = this.settings.yMax ?? 20;
        this.voxels = {};
        this.solids = {};
        this.clearances = {};
    }

    setClickActive(active = true) {
        if (active) {
            window.faceClick = (coords, face) => this.receiveClick(coords, face);
        }
        else {
            window.faceClick = () => {};
        }
    }

    receiveClick(coords, face) {

    }

    genMapFromDelegateClass(DelegateClass) {
        var delegate = new DelegateClass(this);
        delegate.generate();
    }

    addVoxel(coords, voxelDef, solid = true) {
        if (voxelDef !== null) {
            if (voxelDef === undefined) delete this.voxels[coords];
            else if (coords[1] >= 0 && coords[1] < this.yMax) this.voxels[coords] = voxelDef;
        }
        if (solid !== null) {
            if (solid === undefined) delete this.solids[coords];
            else if (coords[1] >= -1 && coords[1] < this.yMax) this.solids[coords] = solid;
        }
    }

    // TODO: fill whole column  when seeking?
    getClearances(coords) {
        if (coords in this.clearances) {
            console.log('found');
            let clrs = this.clearances[coords];
            return {
                top: clrs.top,
                bottom: clrs.bottom
            };
        }
        else {
            console.log('not found');
            let [bottom, top] = [99999, 99999];
            let [x, y, z] = coords;
            let seekBottom = 0;
            if (y > -1) {
                console.log('seeking bottom');
                for (; y - seekBottom >= -1; seekBottom++) {
                    if (this.solids[[x, y - seekBottom, z]]) {
                        console.log(seekBottom);
                        bottom = seekBottom;
                        break;
                    }
                }
            }
            if (y < this.yMax) {
                console.log('seeking top');
                let seekTop = 1;
                for (; y + seekTop < this.yMax; seekTop++) {
                    if (this.solids[[x, y + seekTop, z]]) {
                        console.log(seekTop);
                        top = seekTop - 1;
                        break;
                    }
                }   
            }
            this.clearances[coords] = { top: top, bottom: bottom };
            return {top: top, bottom: bottom};
        }
    }

    forgetClearanceColumn(coords) {
        var [x, _, z] = coords;
        for (var y = 0; y < this.yMax; y++) {
            delete this.clearances[[x, y, z]];
        }
    }

    voxDefToCoordsListDict() {
        var dict = {};
        for (var coordstr in this.voxels) {
            var coords = strToCoords(coordstr);
            var voxelDef = this.voxels[coordstr];
            if (voxelDef.name in dict) {
                dict[voxelDef.name].push(coords);
            }
            else {
                dict[voxelDef.name] = [coords];
            }
        }
        return dict;
    }

    render() {
        var dict = this.voxDefToCoordsListDict();
        for (var key in dict) {
            try {
                _i.placeVoxelsOfDefinition(key, dict[key]);
            }
            catch (e) {
                console.error(`Error calling _i.placeVoxelsOfDefinition for ${this.key} and ${JSON.stringify(dict)}`);
                console.error(e);
            }
        }
        try {
            _i.genAllQuads();
        }
        catch (e) {
            console.error(`Error calling _i.genAllQuads`);
            console.error(e);
        }
    }

    adjacencies(coords, options={}) {
        var stepDown = options.stepDown ?? 1;
        var stepUp = options.stepDown ?? 1;
        var headRoomMin = options.headRoom ?? 2;
        var footRoomMax = options.footRoomMax ?? 0;
        var footRoomMin = options.footRoomMin ?? 0;
        var [x,y,z] = coords;
        var tryCoords = [];
        for (var dy = 0-stepDown; dy <= 0+stepUp; dy++) {
            if (y + dy >= -1 && y + dy < this.yMax) {
                tryCoords.push([x,y+dy,z+1]);
                tryCoords.push([x+1,y+dy,z]);
                tryCoords.push([x,y+dy,z-1]);
                tryCoords.push([x-1,y+dy,z]);
            }
        }
        var adjacentCoords = [];
        for (var tCoords of tryCoords) {
            if (footRoomMax == 0 && !this.solids[tCoords]) continue;
            if (headRoomMin > 0 && this.solids[[tCoords[0], tCoords[1]+1, tCoords[2]]]) continue;
            if (footRoomMin > 0 && this.solids[tCoords]) continue;
            var clrs = this.getClearances(tCoords);
            if (clrs.top >= headRoomMin && clrs.bottom <= footRoomMax) {
                adjacentCoords.push(tCoords);
            }
        }
        return adjacentCoords;
    }

    surfacesNear(coords, d, options = {}) {
        var distanceSquares = {};
        var resultSurfaces = options.excludeStart ? [] : [coords];
        distanceSquares[coords] = 0;
        var newSquares = [coords];
        // while(newSquares.length > 0) {
        //     var square = newSquares.pop();
        //     var sd = distanceSquares[square];
        //     if (sd >= d) continue;
        //     for (var adjSquare of this.adjacencies(square, options)) {
        //         if (!(adjSquare in distanceSquares)) {
        //             distanceSquares[adjSquare] = sd + 1;
        //             if (sd + 1 < d) newSquares.push(adjSquare);
        //             resultSurfaces.push(adjSquare);
        //         }
        //     }
        // }
        for (var cd = 0; cd < d; cd++) {
            var newNewSquares = [];
            for (var square of newSquares) {
                var adjacencies = this.adjacencies(square, options);
                for (var adjSquare of adjacencies) {
                    if (!(adjSquare in distanceSquares)) {
                        newNewSquares.push(adjSquare);
                        distanceSquares[adjSquare] = cd+1;
                        resultSurfaces.push(adjSquare);
                    }
                }
            }
            newSquares = newNewSquares;
        }
        return resultSurfaces;
    }

    flatDistance(from, to) {
        return Math.abs(from[0] - to[0]) + Math.abs(from[2] - to[2]);
    }

    // TODO: diagonals and difficult terrain
    aStarPath(from, to, options={}) {
        var queue = new PriorityQueue();
        var cameFrom = {};
        var gScore = {};
        gScore[from] = 0;
        var gOf = (coord) => {
            if (coord in gScore) return gScore[coord];
            return Infinity;
        }

        

        var fScore = {};
        fScore[from] = this.flatDistance(from,to);

        var fOf = (coord) => {
            if (coord in fScore) return fScore[coord];
            return Infinity;
        }

        var reconstruct = (cameFrom, current) => {
            var totalPath = [current];
            while(current in cameFrom) {
                current = cameFrom[current];
                totalPath.push(current);
            }
            var reversed = [];
            for (var i = totalPath.length - 1; i >= 0; i--) {
                reversed.push(totalPath[i]);
            }
            return reversed;
        }

        queue.enqueue(fScore[from], from);
        while (queue.length > 0) {
            var current = queue.dequeue();
            if (current[0] == to[0] && current[1] == to[1] && current[2] == to[2]) {
                return reconstruct(cameFrom, current);
            }
            for (var neighbor of this.adjacencies(current, options)) {
                var tentativeGScore = gOf(current) + 5;
                if (tentativeGScore < gOf(neighbor)) {
                    cameFrom[neighbor] = current;
                    gScore[neighbor] = tentativeGScore;
                    fScore[neighbor] = tentativeGScore + this.flatDistance(neighbor, to);
                    queue.enqueue(fScore[neighbor], neighbor);
                }
            }
        }
    }
}