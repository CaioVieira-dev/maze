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
