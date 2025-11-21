import type { MazeTile } from "../types/tiles";
import type { Position } from "../types/game";

export function handleTileTransition(
  currentTile: MazeTile,
  playerPos: Position,
  direction: "right" | "left" | "up" | "down",
  tiles: MazeTile[],
  setCurrentTile: (tile: MazeTile) => void,
  setPlayerPos: (pos: Position) => void
) {
  const exit = currentTile.exits.find(
    (e) =>
      e.direction === direction &&
      e.localPosition.row === playerPos.row &&
      e.localPosition.col === playerPos.col
  );

  if (exit) {
    const nextTile = tiles.find((t) => t.id === exit.neighborTileId);
    if (nextTile) {
      setCurrentTile(nextTile);
      setPlayerPos(exit.neighborPosition);
    }
  }
  // senão, prossiga o movimento normal dentro do tile
}
