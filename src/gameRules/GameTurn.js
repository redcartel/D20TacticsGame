export default class GameTurn {
    actions = [];
    gameCharacter;
    walk = 0;

    constructor(gameCharacter) {
        gameCharacter.gameTurn = this;
        this.gameCharacter = gameCharacter;
        this.walk = this.gameCharacter.sheet?.walk ?? 0;
        this.actions = ['action', 'move', 'bonus', 'reaction'];
    }

    get hasMove() {
        return this.walk >= 1;
    }
}