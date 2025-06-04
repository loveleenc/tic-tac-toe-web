import assert from 'node:assert'
import {test, describe, before, beforeEach} from 'node:test'
import app from '../app.js'
import supertest from 'supertest'
import getGames, {deleteAllGames} from '../data/liveData.js'
import gameServices from '../utils/game.js'
import { v4 as uuidv4 } from 'uuid'
import { arrayBuffer } from 'node:stream/consumers'

const api = supertest(app)
let gameId;

describe('failure to create game', function (){
    beforeEach(function (){
        deleteAllGames()
        this.game = {}
        this.game.width = 5
        this.game.height = 6
        this.game.minMoves = 5
        this.game.players = ['x']
        this.game.disableSquares = false
        // gameId = uuidv4()
        // getGames()[gameId] = game
    })

    test('fail to create game when player is missing', async function (){
        const gamesAtStart = getGames()
        delete this.game.players
        const responseWidthMissing = await api.post('/api/game')
            .send(this.game)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        assert(responseWidthMissing.body.error.includes('players are missing'))
        assert.strictEqual(Object.keys(getGames()).length, Object.keys(gamesAtStart).length)
    })

    test('fail to create game when width is missing', async function (){
        const gamesAtStart = getGames()
        delete this.game.width
        const responseWidthMissing = await api.post('/api/game')
            .send(this.game)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        assert(responseWidthMissing.body.error.includes('height or width is missing'))
        assert.strictEqual(Object.keys(getGames()).length, Object.keys(gamesAtStart).length)
    })

    test('fail to create game when height is missing', async function() {
        const gamesAtStart = getGames()
        delete this.game.height
        const responseWidthMissing = await api.post('/api/game')
            .send(this.game)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        assert(responseWidthMissing.body.error.includes('height or width is missing'))
        assert.strictEqual(Object.keys(getGames()).length, Object.keys(gamesAtStart).length)
    })

    test('fail to create game when width is not an integer', async function() {
        const gamesAtStart = getGames()
        this.game.width = 'abcde'
        const responseWidthMissing = await api.post('/api/game')
            .send(this.game)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        assert(responseWidthMissing.body.error.includes('width, height, and number of moves needed to win should be integers'))
        assert.strictEqual(Object.keys(getGames()).length, Object.keys(gamesAtStart).length)
    })

    test('fail to create game when height is not an integer', async function() {
        const gamesAtStart = getGames()
        this.game.height = 'abcde'
        const responseWidthMissing = await api.post('/api/game')
            .send(this.game)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        assert(responseWidthMissing.body.error.includes('width, height, and number of moves needed to win should be integers'))
        assert.strictEqual(Object.keys(getGames()).length, Object.keys(gamesAtStart).length)
    })

    test('fail to create game when min moves is not an integer', async function() {
        const gamesAtStart = getGames()
        this.game.minMoves = 'K'
        const responseWidthMissing = await api.post('/api/game')
            .send(this.game)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        assert(responseWidthMissing.body.error.includes('width, height, and number of moves needed to win should be integers'))
        assert.strictEqual(Object.keys(getGames()).length, Object.keys(gamesAtStart).length)
    })

    test('fail to create game when width is less than 3', async function() {
        const gamesAtStart = getGames()
        this.game.width = 2
        const responseWidthMissing = await api.post('/api/game')
            .send(this.game)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        assert(responseWidthMissing.body.error.includes('both width and height of the grid should be greater than or equal to 3'))
        assert.strictEqual(Object.keys(getGames()).length, Object.keys(gamesAtStart).length)
    })

    test('fail to create game when height is less than 3', async function() {
        const gamesAtStart = getGames()
        this.game.height = 1
        const responseWidthMissing = await api.post('/api/game')
            .send(this.game)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        assert(responseWidthMissing.body.error.includes('both width and height of the grid should be greater than or equal to 3'))
        assert.strictEqual(Object.keys(getGames()).length, Object.keys(gamesAtStart).length)
    })

    test('fail to create game when minimum number of moves needed to win is greater than the maximum of width/height', async function() {
        const gamesAtStart = getGames()
        this.game.width = 7
        this.game.height = 9
        this.game.minMoves = 10
        const responseWidthMissing = await api.post('/api/game')
            .send(this.game)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        assert(responseWidthMissing.body.error.includes('min number of moves needed to win should be greater than or equal to 3 and less than or equal to the width/height (whichever is bigger)'))
        assert.strictEqual(Object.keys(getGames()).length, Object.keys(gamesAtStart).length)
    })

    test('fail to create game when minimum number of moves is less than 3', async function() {
        const gamesAtStart = getGames()
        this.game.width = 7
        this.game.height = 9
        this.game.minMoves = 2
        const responseWidthMissing = await api.post('/api/game')
            .send(this.game)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        assert(responseWidthMissing.body.error.includes('min number of moves needed to win should be greater than or equal to 3 and less than or equal to the width/height (whichever is bigger)'))
        assert.strictEqual(Object.keys(getGames()).length, Object.keys(gamesAtStart).length)
    })
})

describe('Successful game creation via POST request', function (){
    beforeEach(function (){
        deleteAllGames()
        this.game = {}
        this.game.width = 5
        this.game.height = 6
        this.game.minMoves = 5
        this.game.players = ['x']
        this.game.disableSquares = false
    })

    test('If squares are not disabled in the request body, then the grid should not contain disabled squares', async function(){
        const gamesAtStart = Object.keys(getGames())
        this.game.disableSquares = false
        const response = await api.post('/api/game')
            .send(this.game)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.notStrictEqual(response.body, null)
        assert.strictEqual(Object.keys(getGames()).length, Object.keys(gamesAtStart).length + 1)
        assert.strictEqual(response.body.grid.some(row => row.find(cell => cell.text === null)), false)
        assert.strictEqual(response.body.playerData.find(p => p.turn === true && p.isComputer === true), undefined)
    })

    test('in single player, the returned player whose turn it is to play is always the human', async function (){
        const gamesAtStart = Object.keys(getGames())
        this.game.players = ['a']
        const response = await api.post('/api/game')
            .send(this.game)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.playerData.length, this.game.players.length + 1)
        const humanPlayer = response.body.playerData.find(p => p.symbol === this.game.players[0])
        assert.strictEqual(humanPlayer.isComputer, false)
        assert.strictEqual(humanPlayer.turn, true)
        assert.strictEqual(humanPlayer.moves.length, 0)

        const computer = response.body.playerData.find(p => p.symbol !== this.game.players[0])
        assert.strictEqual(computer.isComputer, true)
        assert.strictEqual(computer.turn, false)     

        // const q = new Array()
        // q.find
    })

    test('status of the game is set to ongoing and winner is null', async function () {
        const response = await api.post('/api/game')
            .send(this.game)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        assert.strictEqual(response.body.winner, null)
        assert.strictEqual(response.body.status, "ONGOING")
    })

    test('if multiplayer mode is selected, then there is no computer player present', async function (){
        this.game.players = ['x', 'o', 'p']
        const response = await api.post('/api/game')
            .send(this.game)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        assert.strictEqual(response.body.playerData.find(p => p.isComputer === true), undefined)
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