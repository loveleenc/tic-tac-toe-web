const GameStatus = Object.freeze({
  ONGOING: "ONGOING",
  END: "END",
  NOTSTARTED: "NOTSTARTED",
});

const GameType = Object.freeze({
  SINGLEPLAYER: "SINGLEPLAYER",
  MULTIPLAYER: "MULTIPLAYER",
});

const GameDifficulty = Object.freeze({
  EASY: 'EASY',
  MEDIUM : 'MEDIUM',
  HARD : 'HARD'
})

const MultiplayerGameTypes = Object.freeze({
  CREATE: 'create',
  JOIN: 'join'
})

export default {
    GameStatus,
    GameType,
    GameDifficulty,
    MultiplayerGameTypes
}
