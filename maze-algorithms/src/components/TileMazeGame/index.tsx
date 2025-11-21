import type { MazeTile } from "../../types/tiles";
import { useTileMazeGame } from "../../hooks/useTileMazeGame";
import { useEffect, useMemo } from "react";
import { GameCanvas } from "../MazeGame/GameCanvas"; // supondo GameCanvas já pronto
import type { GameConfig } from "../../types/game";

interface TileMazeGameProps {
  tiles: MazeTile[];
  initialTileId: string;
  initialPosition: { row: number; col: number };
  cellSize?: number;
  config?: GameConfig;
}

export function TileMazeGame({
  tiles,
  initialTileId,
  initialPosition,
  cellSize = 20,
  config,
}: TileMazeGameProps) {
  const { currentTile, playerPos, move } = useTileMazeGame(
    tiles,
    initialTileId,
    initialPosition
  );

  const configSafe = useMemo(
    () => ({
      playerSize: 12,
      playerColor: "#3b82f6",
      startColor: "#3b82f6",
      endColor: "#ef4444",
      checkpointColor: "#fbbf24",
      pathColor: "#8b5cf6",
      pathWidth: 3,
      numCheckpoints: config?.numCheckpoints ?? 3,
      ...(config || {}),
    }),
    [config]
  );

  // Listener de teclado (setas/WASD)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowUp" || e.key === "w") move("up");
      if (e.key === "ArrowDown" || e.key === "s") move("down");
      if (e.key === "ArrowLeft" || e.key === "a") move("left");
      if (e.key === "ArrowRight" || e.key === "d") move("right");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move]);

  // Renderiza só o tile atual como Labirinto jogável
  return (
    <div>
      <div className="mb-2">Tile atual: {currentTile.id}</div>
      <GameCanvas
        grid={currentTile.grid}
        gameState={{
          playerPosition: playerPos,
          startPosition: playerPos,
          endPosition: playerPos,
          checkpoints: [],
          visitedCheckpoints: new Set(),
          path: [],
          isComplete: false,
          isPlaying: true,
        }}
        config={configSafe}
        cellSize={cellSize}
      />
    </div>
  );
}
