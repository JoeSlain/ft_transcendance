import "../../../styles/games.css";

declare global {
  interface HTMLElement {
    getContext: (contextId: "2d") => CanvasRenderingContext2D | null;
    height: number;
    width: number;
  }
}


export class Game {
  private gameCanvas;
  private gameContext;
  private running: boolean = false;
  public static player1Score: number = 0;
  public static player2Score: number = 0;


  constructor(canvas: HTMLCanvasElement, width: number, height: number) {
    // Récupération de l'objet canvas
    this.gameCanvas = canvas;
    if (!this.gameCanvas) {
      console.error("Unable to find canvas element with id 'game-canvas'");
      return;
    }
    this.gameCanvas.height = height;
    this.gameCanvas.width = width;
    // Récupération du contexte du canvas
    this.gameContext = this.gameCanvas.getContext("2d");
    if (!this.gameContext) {
      console.error("Unable to get 2D context for canvas element");
      return;
    }
    // Initialisation de la police de caractères à utiliser pour dessiner le score
    this.gameContext.font = "30px Orbitron";
  }

  drawBoardDetails() {
    //draw les détails de la planche du jeu
    // draw le contour du terrain
    if (!this.gameContext) {
      return;
    }
    if (!this.gameCanvas) {
      return;
    }
    this.gameContext.strokeStyle = "#fff";
    this.gameContext.lineWidth = 5;
    this.gameContext.strokeRect(
      10,
      10,
      this.gameCanvas.width - 20,
      this.gameCanvas.height - 20
    );

    // draw les lignes centrales
    if (!this.gameCanvas) {
      return;
    }
    for (var i = 0; i + 30 < this.gameCanvas.height; i += 30) {
      this.gameContext.fillStyle = "#fff";
      this.gameContext.fillRect(this.gameCanvas.width / 2 - 10, i + 10, 15, 20);
    }
    //draw scores
    this.gameContext.fillText(Game.player1Score.toString(), 320, 50);
    this.gameContext.fillText(Game.player2Score.toString(), 450, 50);
  }

  // mettre à jour l'état du jeu
  update() {
    console.log("update called");
    if (!this.gameCanvas) {
      console.error("Unable to find gamecanvas element");
      return;
    }
	// mettre a jour la position des paddle et ball
	// ....
  }

  draw() {
    if (!this.gameContext) {
      return;
    }
    if (!this.gameCanvas) {
      return;
    }

    this.gameContext.fillStyle = "#000";
    this.gameContext.fillRect(
      0,
      0,
      this.gameCanvas.width,
      this.gameCanvas.height
    );

    this.drawBoardDetails();
	// dessiner les paddle et ball
    // this.player1.draw(this.gameContext);
	// ...
  }

  private gameLoop(): void {
    console.log("gameLoop called1");
    if (this.running) {
      // mettre à jour l'état du jeu et dessiner le canvas
      this.update();
      this.draw();
      requestAnimationFrame(this.gameLoop.bind(this));
    }
  }

}

