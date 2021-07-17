import {toSpaceCoords} from './util';

export default class AnimationPath {
    constructor(name, nodes = []) {
        this.name = name;
        _i.createPath(this.name);
        for (var node of nodes) {
            this.addNode(node);
        }
    }

    addNode(node) {
        if (!node || !node['position']) return;
        let position = node['position'];
        let ticks = node['ticks'] ?? 15;
        let animationGroup = node['animationGroup'] ?? { name: null };
        let jump = node['jump'] ?? 0.0;
        let _eval = node['eval'];
        if (eval != null) {
            _i.addScriptedPathNode(this.name, _eval, position, ticks, animationGroup.name, jump);
        }
        else {
            _i.addPathNode(this.name, position, ticks, animationGroup.name, jump);
        }
    }

    static fromSequence(name, animationGroup, squares, ticks = 15, finalEval = null) {
        var nodes = [];
        var lastSquare = null;
        if (squares == null) squares = [];
        for (var i = 0; i < squares.length; i++) {
            var square = squares[i];
            var jump = 0;
            if (lastSquare != null && lastSquare[1] != square[1]) jump = 0.5;
            var position = toSpaceCoords(square);
            if (i == squares.length - 1 && finalEval != null) {
                nodes.push({
                    animationGroup: animationGroup,
                    position: position,
                    jump: jump,
                    ticks: ticks,
                    eval: finalEval
                })
            }
            else {
                nodes.push({
                    animationGroup: animationGroup,
                    position: position,
                    jump: jump,
                    ticks: ticks
                })
            }
            lastSquare = square;
        }
        return new AnimationPath(name, nodes);
    }
}

window.AnimationPath = AnimationPath;