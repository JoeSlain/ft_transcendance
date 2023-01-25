import { useContext, useEffect, useState } from "react";
import { GameContext } from "../../context/socketContext";
import { CanvasRef } from "../../pages/games/type";
import User from "../User";
import { gameData } from "../../types/gameType";
import { getSavedItem, saveItem } from "../../utils/storage";

type Props = {
  canvasRef: CanvasRef;
  game: gameData | null;
  setGame: (game: gameData | null) => void;
};

export default function useGameEvents({ canvasRef, game, setGame }: Props) {
  const socket = useContext(GameContext);
  const { user } = useContext(User);
  const [playerId, setPlayerId] = useState(0);
  const [key, setKey] = useState<string | null>(null);

  function drawBoardDetails(ctx: CanvasRenderingContext2D, game: gameData) {
    console.log("game data", game);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 5;
    ctx.strokeRect(10, 10, game.width - 20, game.height - 20);

    // draw les lignes centrales
    for (var i = 0; i + 30 < game.height; i += 30) {
      ctx.fillStyle = "#fff";
      ctx.fillRect(game.width / 2 - 10, i + 10, 15, 20);
    }
    //draw scores
    ctx.fillText(game.player1.score.toString(), 320, 50);
    ctx.fillText(game.player2.score.toString(), 450, 50);
  }

  const updateCanvas = () => {
    if (!game) {
      console.log("game null");
      return;
    }
    if (!canvasRef.current) {
      console.error("Unable to find canvas element with id 'game-canvas");
      return;
    }
    console.log("updating canvas");
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Unable to get 2D context for canvas element");
      return;
    }
    ctx.clearRect(0, 0, game.width, game.height);
    drawBoardDetails(ctx, game);
    // Dessiner sur le canvas en utilisant les données du jeu
    //console.log("DrawGame", game);
    ctx.fillRect(
      game.player1.x,
      game.player1.y,
      game.player1.width,
      game.player1.height
    );
    ctx.fillRect(
      game.player2.x,
      game.player2.y,
      game.player2.width,
      game.player2.height
    );
    ctx.fillRect(game.ball.x, game.ball.y, 10, 10);
  };

  // first render
  useEffect(() => {
    socket.emit("getGame", user.id);

    socket.on("newGame", (data) => {
      console.log("game", data);
      setGame(data);
      setPlayerId(data.player1.id === user.id ? 1 : 2);
      updateCanvas();
    });

    socket.on("updateGameState", (game: gameData) => {
      setGame(game);
      updateCanvas();
      console.log("Game state updated: ", game);
    });

    socket.on("win", (data) => {
      const { game } = data;

      if (game.player1.win) {
        //..
        console.log("Player 1 win the game!");
      } else if (game.player2.win) {
        //..
        console.log("Player 2 win the game!");
      }
    });

    const handKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      setKey(event.key);
    };

    window.addEventListener("keydown", handKeyDown);

    return () => {
      window.removeEventListener("keydown", handKeyDown);
      socket.off("newGame");
      socket.off("updateGameState");
      socket.off("win");
    };
  }, []);

  useEffect(() => {
    if (!key) {
      console.log("key null");
      return;
    }
    if (key === "ArrowUp" || key === "ArrowDown") {
      console.log("key pressed", key);
      console.log("game", game);
      socket.emit("movePaddle", { game, playerId, direction: key });
      setKey(null);
    }
  }, [key, game]);

  useEffect(() => {
    updateCanvas();
  }, [game]);
}