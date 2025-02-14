export class Game {
  private id: number;
  private winnerId: number;
  private typeId: number;
  private date: Date;
  private playerIds: number[];
  private boxIds: number[][];

  constructor(
    id: number,
    winnerId: number,
    typeId: number,
    date: Date,
    playerIds: number[],
    boxIds: number[][]
  ) {
    this.id = id;
    this.winnerId = winnerId;
    this.typeId = typeId;
    this.date = date;
    this.playerIds = playerIds;
    this.boxIds = boxIds;
  }
}
