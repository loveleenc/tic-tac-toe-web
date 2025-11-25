import { vi } from "vitest";
import gameService from "../services/gameService";
import { ReturnedUser } from "../types/models";
import { GameDifficulty, GameStatus, GameType, NewGameData } from "../types/types";

describe('testing creation of a new game', () => {
    beforeAll(() => {
        vi.spyOn(global.Math, 'random').mockReturnValue(0.5);
    })

    test('creating a new single player game', () => {
        const user:ReturnedUser = {
            name: 'a',
            username: 'batman',
            id: '4'
        }
        const gameData:NewGameData = {
            width: 3,
            height: 7,
            disableSquares: true,
            minMoves: 4,
            gameType: GameType.SINGLEPLAYER,
            difficulty: GameDifficulty.EASY,
            players: ['b']
        }
        const data = gameService.createNewGame(gameData, user);
        expect(data).toHaveProperty('outgoingGameData');
        expect(data).toHaveProperty('gameId');

        expect(data.outgoingGameData).toHaveProperty('grid');

        expect(data.outgoingGameData).toHaveProperty('status', GameStatus.ONGOING);
        expect(data.outgoingGameData).toHaveProperty('winner', null);
        expect(data.outgoingGameData).toHaveProperty('playerData');
        expect(data.outgoingGameData.playerData.length).toBe(2);
        const computerPlayer = data.outgoingGameData.playerData.find(player => player.isComputer === true);
        const userPlayer = data.outgoingGameData.playerData.find(player => player.isComputer === false);

        expect(computerPlayer).not.toBeUndefined();
        expect(userPlayer).not.toBeUndefined();

        expect(userPlayer).not.toHaveProperty('username')
        expect(userPlayer).toHaveProperty('symbol', 'b')
        expect(userPlayer).toHaveProperty('moves', new Array());
        expect(userPlayer).toHaveProperty('turn', true);

        expect(computerPlayer).not.toHaveProperty('username')
        expect(computerPlayer).toHaveProperty('symbol', expect.any(String));
        expect(computerPlayer).toHaveProperty('turn', false);
        expect(computerPlayer).toHaveProperty('moves');
        expect(computerPlayer?.moves).toBeInstanceOf(Array);
        expect(computerPlayer?.moves.length).toEqual(1);
        expect(computerPlayer?.moves[0]).toEqual(expect.any(Number));
        expect(computerPlayer?.moves[0]).toBeLessThanOrEqual(gameData.width * gameData.height - 1);
        
        

    });

    test('creating a new multi-player game', () => {
        const user:ReturnedUser = {
            name: 'ab9c',
            username: 'frkkjk0',
            id: '23edu8'
        }
        const gameData:NewGameData = {
            width: 50,
            height: 9,
            disableSquares: false,
            minMoves: 4,
            gameType: GameType.MULTIPLAYER,
            difficulty: null,
            players: ['x']
        }
        const data = gameService.createNewGame(gameData, user);
        expect(data).toHaveProperty('outgoingGameData');
        expect(data).toHaveProperty('gameId');

        expect(data.outgoingGameData).toHaveProperty('grid');

        expect(data.outgoingGameData).toHaveProperty('status', GameStatus.NOTSTARTED);
        expect(data.outgoingGameData).toHaveProperty('winner', null);
        expect(data.outgoingGameData).toHaveProperty('playerData');
        expect(data.outgoingGameData.playerData.length).toBe(1);
        const userPlayer = data.outgoingGameData.playerData.find(player => player.isComputer === false);

        expect(userPlayer).not.toBeUndefined();

        expect(userPlayer).not.toHaveProperty('username')
        expect(userPlayer).toHaveProperty('symbol', 'x')
        expect(userPlayer).toHaveProperty('moves', new Array());
        expect(userPlayer).toHaveProperty('turn', false);

    })

    afterAll(() => {
        vi.spyOn(global.Math, 'random').mockRestore();
    })
})