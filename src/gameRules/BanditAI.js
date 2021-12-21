import GameTurn from "./GameTurn";

export default class BanditAI extends GameTurn {
    hasAction = true;

    constructor(gameCharacter) {
        console.log('Bandit AI loading for ' + gameCharacter?.name);
        super(gameCharacter);
        this.state = this.gameCharacter.state;
        this.walk = this.gameCharacter.sheet.walk ?? 6;
    }

    aiActionChoice() {
        if (this.walk > 0) {
            this.actionChoice = 'move';
            return this.state.setState(['aiTurn', 'move']);
        }
        else if (this.hasAction == true) {
            console.log('>> seek attack');
            var threatenSquares = this.state.map.pathAdjacencies(this.gameCharacter.position);
            var found = false;
            for (var square of threatenSquares) {
                if (''+square == '' + this.gameCharacter.aiSeekKill.position) {
                    console.log('found');
                    return this.state.setState(['aiTurn', 'attack']);
                }
            }
            this.hasAction = false;
            return this.state.setState();
        }
        else {
            return this.state.setState(['aiTurn', 'end']);
        }
    }

    aiMove() {
        this.state.stateChain = ['aiTurn', 'end'];
        if (this.gameCharacter.aiSeekKill && this.walk > 0) {
            var moveTo = this.gameCharacter.aiSeekKill.position;
            var path = this.state.map.aStar(this.gameCharacter.position, moveTo);
            if (path.length > this.walk) {
                path = path.slice(0, this.walk);
            }
            if ('' + path[path.length - 1] == this.gameCharacter.aiSeekKill.position) {
                path = path.slice(0, path.length - 1);
            }
            this.walk = 0;
            if (path.length > 1) {
                console.log('AI walking');
                this.gameCharacter.walkPath = path;
                return this.state.setState(['aiTurn', 'animate']);
            }
            else {
                console.log('AI at destination');
                return this.state.setState(['aiTurn', 'mainMenu']);
            }

        }
        else {
            console.log('aiMove: no target to seek');
            return this.state.setState(['aiTurn', 'end']);
        }
    }

    aiAttack() {
        console.log('Attack');
            this.gameCharacter.attack(this.gameCharacter.aiSeekKill);
            this.hasAction = false;
            this.state.stateChain = ['aiTurn', 'mainMenu'];
            this.state.loop.go();
    }
}