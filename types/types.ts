
export type playerSymbol = string

export interface Player{
    symbol:playerSymbol,
    moves:number[],
    turn:boolean,
    isComputer:boolean,
    username: string | null,
}

export type NonSensitivePlayer = Omit<Player, 'username'>

export interface NewGameData{
  width:number,
  height:number,
  disableSquares:boolean,
  minMoves:number,
  gameType: GameType,
  difficulty: null | GameDifficulty,
  players: playerSymbol[],
}

export interface Game{
  playerData:Player[],
  width: number,
  height:number,
  squares: number[],
  minMoves: number,
  hasStarted: boolean,
  gameType: GameType,
  difficulty: null | GameDifficulty,
}

export enum GameDifficulty{
  EASY= 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export interface Cell{
  count:number,
  text: string | null
}

export type Row = Cell[]
export type Grid = Row[]

export enum GameStatus{
  ONGOING = 'ONGOING',
  END = 'END',
  NOTSTARTED = 'NOTSTARTED'
}

export enum GameType{
  SINGLEPLAYER = 'SINGLEPLAYER',
  MULTIPLAYER = 'MULTIPLAYER'
}

export interface OutgoingGameData{
  grid?: Grid,
  playerData:NonSensitivePlayer[],
  status: GameStatus,
  winner: playerSymbol | null,
}

export interface Setup{
  players: playerSymbol[],
  width: number,
  height: number,
  minMoves: number,
  disableSquares: boolean,
  gameType: string,
  difficulty: null | string,
}

export interface NewAccount{
  username: string,
  password: string,
  name: string,
  email: string
}

export enum accountType{
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export type gameId = string
export type Games = Record<gameId, Game>