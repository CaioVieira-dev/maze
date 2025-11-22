import type { MazeGrid, Cell } from "../types/maze";

// tiles: array de MazeGrid de mesmo tamanho
export function mergeTilesHorizontal(tiles: MazeGrid[]): MazeGrid {
  const rows = tiles[0].length;
  const cols = tiles[0][0].length;
  const tilesCount = tiles.length;

  const mergedGrid: MazeGrid = Array.from({ length: rows }, () =>
    Array.from({ length: cols * tilesCount }, () => ({} as Cell))
  );

  for (let t = 0; t < tilesCount; t++) {
    const tile = tiles[t];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const globalCol = col + t * cols;
        mergedGrid[row][globalCol] = {
          ...tile[row][col],
          row,
          col: globalCol,
        };
      }
    }
  }

  // Garantir os "furos" entre tiles
  // Para cada par de tiles vizinhos, alinhe as paredes das células de conexão
  for (let t = 0; t < tilesCount - 1; t++) {
    const rowConnect = Math.floor(rows / 2);
    const colA = (t + 1) * cols - 1; // Última coluna do tile t
    const colB = (t + 1) * cols; // Primeira coluna do tile t+1

    // Furo na passagem: direita de A, esquerda de B
    mergedGrid[rowConnect][colA].walls.right = false;
    mergedGrid[rowConnect][colB].walls.left = false;
  }

  return mergedGrid;
}

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
