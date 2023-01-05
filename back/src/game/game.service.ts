import { Injectable } from "@nestjs/common";
import { Room } from "src/utils/types";
import { RoomService } from "./room.service";

export class GameState {
  public player1Score: number;
  public player2Score: number;
  public player1Position: { x: number; y: number };
  public player2Position: { x: number; y: number };
  public ballPosition: { x: number; y: number };
  public ballDirection: { x: number; y: number };
  public gameRunning: boolean;

  constructor() {
    this.player1Score = 0;
    this.player2Score = 0;
    this.player1Position = { x: 0, y: 0 };
    this.player2Position = { x: 0, y: 0 };
    this.ballPosition = { x: 0, y: 0 };
    this.ballDirection = { x: 1, y: 1 };
    this.gameRunning = false;
  }
}

@Injectable()
export class GameService {
  public gameState: GameState;
  constructor(private readonly roomService: RoomService) {
    this.gameState = {
    player1Score: 0,
    player2Score: 0,
    player1Position: { x: 0, y: 0 },
    player2Position: { x: 0, y: 0 },
    ballPosition: { x: 0, y: 0 },
    ballDirection: { x: 1, y: 1 },
    gameRunning: false,
  };}

  users: Map<number, string> = new Map();


  resetGame(room: Room) {

  }
}
