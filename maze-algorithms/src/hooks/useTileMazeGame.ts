import { useState } from "react";
import type { MazeTile } from "../types/tiles";
import type { Position, Direction } from "../types/game";
import { canMove, getNextPosition } from "../utils/gameHelpers";

export function useTileMazeGame(
  tiles: MazeTile[],
  initialTileId: string,
  initialPosition: Position
) {
  const [currentTileId, setCurrentTileId] = useState(initialTileId);
  const [playerPos, setPlayerPos] = useState<Position>(initialPosition);

  const currentTile = tiles.find((t) => t.id === currentTileId)!;

  function move(direction: Direction) {
    const nextPos = getNextPosition(playerPos, direction);

    // Checa se é uma transição de tile
    const exit = currentTile.exits.find(
      (e) =>
        e.direction === direction &&
        e.localPosition.row === playerPos.row &&
        e.localPosition.col === playerPos.col
    );

    if (exit) {
      setCurrentTileId(exit.neighborTileId);
      setPlayerPos(exit.neighborPosition);
      return;
    }

    // Movimento normal dentro do tile
    if (canMove(currentTile.grid, playerPos, nextPos)) {
      setPlayerPos(nextPos);
    }
  }

  return {
    currentTile,
    playerPos,
    move,
    setPlayerPos,
    setCurrentTileId,
  };
}
