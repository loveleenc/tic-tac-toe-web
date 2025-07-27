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

export default {
    GameStatus,
    GameType,
    GameDifficulty
}
