import { useState, useEffect, useCallback } from "react";
import { type MazeGrid } from "../types/maze";
import {
  type GameState,
  type Position,
  type Direction,
  type GameConfig,
} from "../types/game";
import {
  canMove,
  getNextPosition,
  generateCheckpoints,
  isSamePosition,
} from "../utils/gameHelpers";

const DEFAULT_CONFIG: Required<GameConfig> = {
  numCheckpoints: 3,
  playerSize: 12,
  playerColor: "#3b82f6",
  startColor: "#3b82f6",
  endColor: "#ef4444",
  checkpointColor: "#fbbf24",
  pathColor: "#8b5cf6",
  pathWidth: 3,
};

export function useMazeGame(grid: MazeGrid, config: GameConfig = {}) {
  const fullConfig = { ...DEFAULT_CONFIG, ...config };
  const rows = grid.length;
  const cols = grid[0].length;

  const [gameState, setGameState] = useState<GameState>(() => {
    const startPosition: Position = { row: 0, col: 0 };
    const endPosition: Position = { row: rows - 1, col: cols - 1 };
    const checkpoints = generateCheckpoints(
      grid,
      startPosition,
      endPosition,
      fullConfig.numCheckpoints
    );

    return {
      playerPosition: { ...startPosition },
      startPosition,
      endPosition,
      checkpoints,
      visitedCheckpoints: new Set(),
      path: [{ ...startPosition }],
      isComplete: false,
      isPlaying: false,
    };
  });

  const startGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      playerPosition: { ...prev.startPosition },
      path: [{ ...prev.startPosition }],
      visitedCheckpoints: new Set(),
      isComplete: false,
      isPlaying: true,
    }));
  }, []);

  const movePlayer = useCallback(
    (direction: Direction) => {
      setGameState((prev) => {
        // Verificar condições usando prev
        if (!prev.isPlaying || prev.isComplete) return prev;

        const nextPos = getNextPosition(prev.playerPosition, direction);

        if (canMove(grid, prev.playerPosition, nextPos)) {
          const newPath = [...prev.path, nextPos];
          const newVisitedCheckpoints = new Set(prev.visitedCheckpoints);

          // Verificar se passou por um checkpoint
          prev.checkpoints.forEach((cp, index) => {
            if (isSamePosition(nextPos, cp)) {
              newVisitedCheckpoints.add(index);
            }
          });

          // Verificar se chegou no fim e coletou todos os checkpoints
          const allCheckpointsVisited =
            newVisitedCheckpoints.size === prev.checkpoints.length;
          const reachedEnd = isSamePosition(nextPos, prev.endPosition);
          const isComplete = reachedEnd && allCheckpointsVisited;

          return {
            ...prev,
            playerPosition: nextPos,
            path: newPath,
            visitedCheckpoints: newVisitedCheckpoints,
            isComplete,
          };
        }

        return prev; // Sem mudanças se não pode mover
      });
    },
    [grid] // Apenas grid como dependência
  );

  // Keyboard controls
  useEffect(() => {
    if (!gameState.isPlaying || gameState.isComplete) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          e.preventDefault();
          movePlayer("up");
          break;
        case "ArrowDown":
        case "s":
        case "S":
          e.preventDefault();
          movePlayer("down");
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault();
          movePlayer("left");
          break;
        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault();
          movePlayer("right");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameState.isPlaying, gameState.isComplete, movePlayer]);

  return {
    gameState,
    startGame,
    movePlayer,
    config: fullConfig,
  };
}
