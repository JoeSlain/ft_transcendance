import { useContext, useEffect, useState } from "react";
import { ChatContext, GameContext } from "../../context/socketContext";
import { CanvasRef } from "../../pages/games/type";
import User from "../User";
import { gameData } from "../../types/gameType";

type Props = {
  canvasRef: CanvasRef;
  setRoom: (room: any) => void;
};

export default function useGameEvents({ canvasRef, setRoom }: Props) {
  const gameSocket = useContext(GameContext);
  const chatSocket = useContext(ChatContext);
  const { user } = useContext(User);
  const [playerId, setPlayerId] = useState(0);
  const [key, setKey] = useState<string | null>(null);
  const [game, setGame] = useState<gameData | null>(null);

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
    gameSocket.emit("getGame", user.id);

    gameSocket.on("newGame", (data) => {
      console.log("game", data);
      setGame(data);
      if (data.player1.infos.id === user.id) {
        setPlayerId(1);
        chatSocket.emit("updateUserStatus", { user, status: "ingame" });
      } else if (data.player2.infos.id === user.id) {
        setPlayerId(2);
        chatSocket.emit("updateUserStatus", { user, status: "ingame" });
      }
      //updateCanvas();
    });

    gameSocket.on("gameReset", (game: gameData) => {
      setGame(game);
    });

    gameSocket.on("updateGameState", (game: gameData) => {
      setGame((prev: any) => {
        if (prev) {
          return {
            ...prev,
            ball: game.ball,
            player1: { ...prev.player1, score: game.player1.score },
            player2: { ...prev.player2, score: game.player2.score },
          };
        }
        return game;
      });
      //updateCanvas();
    });

    gameSocket.on("endGame", (game) => {
      console.log("endgame");
      setRoom((prev: any) => {
        return { ...prev, gameStarted: false };
      });
      if (
        game.player1.infos.id === user.id ||
        game.player2.infos.id === user.id
      )
        chatSocket.emit("updateUserStatus", { user, status: "online" });
    });

    gameSocket.on("updateBall", (ball) => {
      setGame((prev: any) => {
        return { ...prev, ball };
      });
    });

    gameSocket.on("updatePaddle", (game) => {
      setGame((prev: any) => {
        if (prev) {
          return {
            ...prev,
            player1: { ...prev.player1, y: game.player1.y },
            player2: { ...prev.player2, y: game.player2.y },
          };
        }
      });
    });

    gameSocket.on("win", (data) => {
      const { game } = data;

      if (game.player1.win) {
        //..
        console.log("Player 1 win the game!");
      } else if (game.player2.win) {
        //..
        console.log("Player 2 win the game!");
      }
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      setKey(event.key);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      gameSocket.off("newGame");
      gameSocket.off("gameReset");
      gameSocket.off("updateGameState");
      gameSocket.off("endGame");
      gameSocket.off("updateBall");
      gameSocket.off("updatePaddle");
      gameSocket.off("win");
    };
  }, []);

  // keydown
  useEffect(() => {
    if (!key) {
      console.log("key null");
      return;
    }
    if (key === "ArrowUp" || key === "ArrowDown") {
      console.log("key pressed", key);
      console.log("game", game);
      gameSocket.emit("movePaddle", { game, playerId, direction: key });
      setKey(null);
    }
  }, [key, game]);

  // draw
  useEffect(() => {
    updateCanvas();
  }, [game]);

  return game;
}
