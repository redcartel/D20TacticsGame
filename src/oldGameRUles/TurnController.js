
export default class TurnController {
    isCPU = false;
    gameCharacter;
    gameState;

    constructor(gameCharacter) {
        this.gameCharacter = gameCharacter;
        this.actions = {
            'move' : {
                'walk' : character.sheet.walk ?? 30
            }
        }
    }

    completeFunction() {
        this.gameState.nextTurn();
    }

    showUI() {
        
    }
}