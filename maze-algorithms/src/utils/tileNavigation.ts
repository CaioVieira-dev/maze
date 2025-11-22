import type { MazeTile } from "../types/tiles";
import type { Position } from "../types/game";

// Recebe mapa de tiles para busca rápida
type TilesMap = Map<string, MazeTile>;

export function handleTileTransition(
  currentTile: MazeTile,
  playerPos: Position,
  direction: "right" | "left" | "up" | "down",
  tilesMap: TilesMap,
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
    const nextTile = tilesMap.get(exit.neighborTileId);
    if (nextTile) {
      setCurrentTile(nextTile);
      setPlayerPos(exit.neighborPosition);
    }
  }
  // Caso contrário, movimento dentro do tile normal
}
