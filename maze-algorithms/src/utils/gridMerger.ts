import type { MazeGrid, Cell } from "../types/maze";

import type { MazeTile } from "../types/tiles";

export function mergeTileLayout(layout: (MazeTile | null)[][]): MazeGrid {
  const tileRows = layout.length;
  const tileCols = layout[0]?.length || 0;

  // Determina o tamanho dos tiles (assume todos do mesmo tamanho)
  let tileHeight = 0;
  let tileWidth = 0;

  for (const row of layout) {
    for (const tile of row) {
      if (tile) {
        tileHeight = tile.grid.length;
        tileWidth = tile.grid[0].length;
        break;
      }
    }
    if (tileHeight > 0) break;
  }

  const totalRows = tileHeight * tileRows;
  const totalCols = tileWidth * tileCols;

  const mergedGrid: MazeGrid = Array.from({ length: totalRows }, () =>
    Array.from({ length: totalCols }, () => ({} as Cell))
  );

  // Copiar células com ajustes de row/col globais
  for (let tr = 0; tr < tileRows; tr++) {
    for (let tc = 0; tc < tileCols; tc++) {
      const tile = layout[tr][tc];
      if (!tile) continue;

      for (let r = 0; r < tileHeight; r++) {
        for (let c = 0; c < tileWidth; c++) {
          const globalRow = tr * tileHeight + r;
          const globalCol = tc * tileWidth + c;
          mergedGrid[globalRow][globalCol] = {
            ...tile.grid[r][c],
            row: globalRow,
            col: globalCol,
          };
        }
      }
    }
  }

  // Remover paredes entre tiles conectados (usar exits)
  for (let tr = 0; tr < tileRows; tr++) {
    for (let tc = 0; tc < tileCols; tc++) {
      const tile = layout[tr][tc];
      if (!tile) continue;

      for (const exit of tile.exits) {
        // Encontrar tile vizinho
        const neighborTileIndex = layout
          .flat()
          .findIndex((t) => t?.id === exit.neighborTileId);
        if (neighborTileIndex === -1) continue; // Vizinho não na grade (ou nulo)

        // Converter índice linear para 2D
        const nr = Math.floor(neighborTileIndex / tileCols);
        const nc = neighborTileIndex % tileCols;
        const neighborTile = layout[nr][nc];
        if (!neighborTile) continue;

        // Coordenadas globais das posições local e vizinha
        const globalLocRow = tr * tileHeight + exit.localPosition.row;
        const globalLocCol = tc * tileWidth + exit.localPosition.col;
        const globalNeighRow = nr * tileHeight + exit.neighborPosition.row;
        const globalNeighCol = nc * tileWidth + exit.neighborPosition.col;

        // Remover parede entre células conectadas
        const cellA = mergedGrid[globalLocRow][globalLocCol];
        const cellB = mergedGrid[globalNeighRow][globalNeighCol];

        // Mesma lógica do removeWall para sincronizar paredes
        const rowDiff = cellA.row - cellB.row;
        const colDiff = cellA.col - cellB.col;

        if (rowDiff === 1) {
          cellA.walls.top = false;
          cellB.walls.bottom = false;
        } else if (rowDiff === -1) {
          cellA.walls.bottom = false;
          cellB.walls.top = false;
        } else if (colDiff === 1) {
          cellA.walls.left = false;
          cellB.walls.right = false;
        } else if (colDiff === -1) {
          cellA.walls.right = false;
          cellB.walls.left = false;
        }
      }
    }
  }

  return mergedGrid;
}
