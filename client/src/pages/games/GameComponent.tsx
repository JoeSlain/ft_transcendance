import { GameContext } from "../../context/socketContext";
import "../../styles/games.css";
import { useRef, useState, useEffect, useContext } from "react";
import { GameType, CanvasRef, GameUpdateData } from "./type"


function GameComponent () {
  console.log("GameComponent");
	const canvasRef: CanvasRef = useRef<HTMLCanvasElement>(null);
	const [game, setGame] = useState<GameType>();
  const socket = useContext(GameContext);


  useEffect(() => {
    if (!socket) return;
   
    socket.on('updateGameState', (data: GameUpdateData, roomId) => {
        setGame(data.game);
        console.log("Game state updated: ", data.game);
    });
    socket.on('win', (data) => {
      const { game } = data;
      
      if (game.player1.win) {
        //..
        console.log("Player 1 win the game!");
      } else if (game.player2.win) {
        //..
        console.log("Player 2 win the game!");
      }
    });

    // 
    const handleMovePaddle = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        socket.emit("movePaddle", { direction: event.key }
        );
      }
    };
    document.addEventListener("keydown", handleMovePaddle);
    return () => {
      document.removeEventListener("keydown", handleMovePaddle);
    };

  }, [socket]);

  
  useEffect(() => {
    if (!game) return;
	if (!canvasRef.current) {
		console.error("Unable to find canvas element with id 'game-canvas");
		return;
	}
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
	if (!ctx) {
		console.error("Unable to get 2D context for canvas element");
		return;
	}
    drawBoardDetails(ctx, game);
    // Dessiner sur le canvas en utilisant les données du jeu
    console.log("DrawGame", game);
    ctx.clearRect(0, 0, game.width, game.height);
    ctx.fillRect(game.player1.x, game.player1.y, game.player1.width, game.player1.height);
    ctx.fillRect(game.player2.x, game.player2.y, game.player2.width, game.player2.height);
    ctx.fillRect(game.ball.x, game.ball.y, 10, 10);
  }, [game]);

  function drawBoardDetails(ctx: CanvasRenderingContext2D, game: GameType) {
 
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 5;
    ctx.strokeRect(
      10,
      10,
      game.width - 20,
      game.height - 20
    );

    // draw les lignes centrales
    for (var i = 0; i + 30 < game.height; i += 30) {
      ctx.fillStyle = "#fff";
      ctx.fillRect(game.width / 2 - 10, i + 10, 15, 20);
    }
    //draw scores
    ctx.fillText(game.player1.score.toString(), 320, 50);
    ctx.fillText(game.player2.score.toString(), 450, 50);
  }

  return (
    <div className="game-canvas-container">
        <canvas ref={canvasRef} width={game? game.width : 800} height={game? game.height : 500} />
    </div>

  );
}

export default GameComponent;
