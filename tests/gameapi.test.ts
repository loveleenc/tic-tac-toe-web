import assert from 'node:assert'
import app from "../index.ts"
import supertest from 'supertest'
import { getGames, deleteAllGames } from '../data/liveData.ts'
import { GameDifficulty, GameType, NewGameData } from '../types/types.ts'

const api = supertest(app)

describe('failure to create game', function () {
    var game;
    let cookie = null;
    beforeAll(async function () {

        const response = await api.post("/api/login")
            .send({ username: process.env.TEST_USERNAME, password: process.env.TEST_PASSWORD })
        const cookies = response.headers["set-cookie"];
        cookie = cookies;
    })

    beforeEach(function () {
        deleteAllGames();
        game = {
            width: 5,
            height: 6,
            minMoves: 5,
            players: ['x'],
            difficulty: GameDifficulty.EASY,
            disableSquares: false,
            gameType: GameType.SINGLEPLAYER

        };
        // gameId = uuidv4()
        // getGames()[gameId] = game
    })

    test('fail to create game when player is missing', async function () {
        const gamesAtStart = getGames()
        delete game.players
        const responseWidthMissing = await api.post('/api/game')
            .set('Cookie', cookie)
            .send(game)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        assert(responseWidthMissing.body.error.includes('game setup data appears to be missing a few details'))
        assert.strictEqual(Object.keys(getGames()).length, Object.keys(gamesAtStart).length)
    })

    test('fail to create game when width is missing', async function () {
        const gamesAtStart = getGames()
        delete game.width
        const responseWidthMissing = await api.post('/api/game')
            .set('Cookie', cookie)
            .send(game)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        assert(responseWidthMissing.body.error.includes('game setup data appears to be missing a few details'))
        assert.strictEqual(Object.keys(getGames()).length, Object.keys(gamesAtStart).length)
    })

    test('fail to create game when height is missing', async function () {
        const gamesAtStart = getGames()
        delete game.height
        const responseWidthMissing = await api.post('/api/game')
            .set('Cookie', cookie)
            .send(game)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        assert(responseWidthMissing.body.error.includes('game setup data appears to be missing a few details'))
        assert.strictEqual(Object.keys(getGames()).length, Object.keys(gamesAtStart).length)
    })

    test('fail to create game when width is not an integer', async function () {
        const gamesAtStart = getGames()
        game.width = 'abcde'
        const responseWidthMissing = await api.post('/api/game')
            .set('Cookie', cookie)
            .send(game)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        assert(responseWidthMissing.body.error.includes('width is incorrect'))
        assert.strictEqual(Object.keys(getGames()).length, Object.keys(gamesAtStart).length)
    })

    test('fail to create game when height is not an integer', async function () {
        const gamesAtStart = getGames()
        game.height = 'abcde'
        const responseWidthMissing = await api.post('/api/game')
            .set('Cookie', cookie)
            .send(game)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        assert(responseWidthMissing.body.error.includes('height is incorrect'))
        assert.strictEqual(Object.keys(getGames()).length, Object.keys(gamesAtStart).length)
    })

    test('fail to create game when min moves is not an integer', async function () {
        const gamesAtStart = getGames()
        game.minMoves = 'K'
        const responseWidthMissing = await api.post('/api/game')
            .set('Cookie', cookie)
            .send(game)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        assert(responseWidthMissing.body.error.includes('min moves is incorrect'))
        assert.strictEqual(Object.keys(getGames()).length, Object.keys(gamesAtStart).length)
    })

    test('fail to create game when width is less than 3', async function () {
        const gamesAtStart = getGames()
        game.width = 2
        const responseWidthMissing = await api.post('/api/game')
            .set('Cookie', cookie)
            .send(game)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        assert(responseWidthMissing.body.error.includes('both width and height of the grid should be greater than or equal to 3'))
        assert.strictEqual(Object.keys(getGames()).length, Object.keys(gamesAtStart).length)
    })

    test('fail to create game when height is less than 3', async function () {
        const gamesAtStart = getGames()
        game.height = 1
        const responseWidthMissing = await api.post('/api/game')
            .set('Cookie', cookie)
            .send(game)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        assert(responseWidthMissing.body.error.includes('both width and height of the grid should be greater than or equal to 3'))
        assert.strictEqual(Object.keys(getGames()).length, Object.keys(gamesAtStart).length)
    })

    test('fail to create game when minimum number of moves needed to win is greater than the maximum of width/height', async function () {
        const gamesAtStart = getGames()
        game.width = 7
        game.height = 9
        game.minMoves = 10
        const responseWidthMissing = await api.post('/api/game')
        .set('Cookie', cookie)
            .send(game)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        assert(responseWidthMissing.body.error.includes('min number of moves needed to win should be greater than or equal to 3 and less than or equal to the width/height (whichever is bigger)'))
        assert.strictEqual(Object.keys(getGames()).length, Object.keys(gamesAtStart).length)
    })

    test('fail to create game when minimum number of moves is less than 3', async function () {
        const gamesAtStart = getGames()
        game.width = 7
        game.height = 9
        game.minMoves = 2
        const responseWidthMissing = await api.post('/api/game')
        .set('Cookie', cookie)
            .send(game)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert(responseWidthMissing.body.error.includes('min number of moves needed to win should be greater than or equal to 3 and less than or equal to the width/height (whichever is bigger)'))
        assert.strictEqual(Object.keys(getGames()).length, Object.keys(gamesAtStart).length)
    })
})

describe('Successful game creation via POST request', function () {
    var game: NewGameData | null = null;
    let cookie = null;
    beforeAll(async function () {

        const response = await api.post("/api/login")
            .send({ username: process.env.TEST_USERNAME, password: process.env.TEST_PASSWORD })
        const cookies = response.headers["set-cookie"];
        cookie = cookies;
    });

    beforeEach(function () {
        deleteAllGames();
        game = {
            width: 5,
            height: 6,
            minMoves: 5,
            players: ['x'],
            difficulty: GameDifficulty.EASY,
            disableSquares: false,
            gameType: GameType.SINGLEPLAYER

        };
        // gameId = uuidv4()
        // getGames()[gameId] = game
    })
    // beforeEach(function (){
    //     deleteAllGames()
    //     game = {}
    //     game.width = 5
    //     game.height = 6
    //     game.minMoves = 5
    //     game.players = ['x']
    //     game.disableSquares = false
    // })

    test('If squares are not disabled in the request body, then the grid should not contain disabled squares', async function () {
        const gamesAtStart = Object.keys(getGames())
        if (game !== null) {
            game.disableSquares = false
        }
        const response = await api.post('/api/game')
            .set('Cookie', cookie)
            .send(game)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.notStrictEqual(response.body, null)
        assert.strictEqual(Object.keys(getGames()).length, Object.keys(gamesAtStart).length + 1)
        assert.strictEqual(response.body.grid.some(row => row.find(cell => cell.text === null)), false)
        assert.strictEqual(response.body.playerData.find(p => p.turn === true && p.isComputer === true), undefined)
    })

    test('If squares are disabled in the request body, then the grid should contain disabled squares', async function () {
        const gamesAtStart = Object.keys(getGames())
        if (game !== null) {
            game.disableSquares = true
        }
        const response = await api.post('/api/game')
            .set('Cookie', cookie)
            .send(game)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.notStrictEqual(response.body, null)
        assert.strictEqual(Object.keys(getGames()).length, Object.keys(gamesAtStart).length + 1)
        assert.strictEqual(response.body.grid.some(row => row.find(cell => cell.text === null)), true)
    })

    test('in single player, the returned player whose turn it is to play is always the human', async function () {
        const gamesAtStart = Object.keys(getGames())
        if (game !== null) {


            game.players = ['a']
        }
        const response = await api.post('/api/game')
        .set('Cookie', cookie)
            .send(game)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.playerData.length, (game as NewGameData).players.length + 1)
        const humanPlayer = response.body.playerData.find(p => p.symbol === (game as NewGameData).players[0])
        assert.strictEqual(humanPlayer.isComputer, false)
        assert.strictEqual(humanPlayer.turn, true)
        assert.strictEqual(humanPlayer.moves.length, 0)

        const computer = response.body.playerData.find(p => p.symbol !== (game as NewGameData).players[0])
        assert.strictEqual(computer.isComputer, true)
        assert.strictEqual(computer.turn, false)

        // const q = new Array()
        // q.find
    })

    test('status of the game is set to ongoing and winner is null', async function () {
        const response = await api.post('/api/game')
        .set('Cookie', cookie)
            .send(game)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        assert.strictEqual(response.body.winner, null)
        assert.strictEqual(response.body.status, "ONGOING")
    })

    test('if multiplayer mode is selected, then there is no computer player present', async function () {
        if (game !== null) {
            game.gameType = GameType.MULTIPLAYER
        }
        const response = await api.post('/api/game')
        .set('Cookie', cookie)
            .send(game)
            .expect(200)
            .expect('Content-Type', /application\/json/)


        assert.strictEqual(response.body.playerData.length, (game as NewGameData).players.length)
        // assert.strictEqual(response.body.playerData.find(p => p.isComputer === true), undefined)
        response.body.playerData.forEach(p => {
            assert.strictEqual(p.moves.length, 0)
            assert.strictEqual(p.hasOwnProperty('symbol'), true)
            assert.strictEqual(p.hasOwnProperty('moves'), true)
            assert.strictEqual(p.hasOwnProperty('turn'), true);
            assert.strictEqual(p.hasOwnProperty('isComputer'), true);
            assert.strictEqual(p.isComputer, false)
            assert.strictEqual(Object.keys(p).length, 4)
        })
    })
})