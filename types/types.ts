
export type playerSymbol = string

export interface Player{
    symbol:playerSymbol,
    moves:number[],
    turn:boolean,
    isComputer:boolean,
    username: string | null,
}

export type NonSensitivePlayer = Omit<Player, 'username'>

export interface Game{
  playerData:Player[],
  width: number,
  height:number,
  squares: number[],
  minMoves: number,
}

export interface Cell{
  count:number,
  text: string | null
}
export type Row = Cell[]
export type Grid = Row[]

export enum GameStatus{
  ONGOING = 'ONGOING',
  END = 'END'
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
  disableSquares: boolean
}

export type gameId = string
export type Games = Record<gameId, Game>