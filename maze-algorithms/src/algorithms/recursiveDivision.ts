import { type MazeGrid } from "../types/maze";
import { createEmptyGrid } from "../utils/maze";

/**
 * Algoritmo Recursive Division
 * Único que funciona "ao contrário" - começa com campo vazio e ADICIONA paredes
 * Cria padrões fractais com longos corredores retos
 */
export function generateRecursiveDivision(
  rows: number,
  cols: number
): MazeGrid {
  const grid = createEmptyGrid(rows, cols);

  // Começar com todas as paredes removidas (campo aberto)
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      grid[row][col].walls.top = false;
      grid[row][col].walls.right = false;
      grid[row][col].walls.bottom = false;
      grid[row][col].walls.left = false;
    }
  }

  // Adicionar paredes externas
  addOuterWalls(grid, rows, cols);

  // Dividir recursivamente
  divide(grid, 0, 0, cols, rows, chooseOrientation(cols, rows));

  return grid;
}

/**
 * Adiciona as paredes externas do labirinto
 */
function addOuterWalls(grid: MazeGrid, rows: number, cols: number): void {
  for (let row = 0; row < rows; row++) {
    grid[row][0].walls.left = true;
    grid[row][cols - 1].walls.right = true;
  }

  for (let col = 0; col < cols; col++) {
    grid[0][col].walls.top = true;
    grid[rows - 1][col].walls.bottom = true;
  }
}

/**
 * Função recursiva que divide a câmara
 */
function divide(
  grid: MazeGrid,
  x: number,
  y: number,
  width: number,
  height: number,
  orientation: "horizontal" | "vertical"
): void {
  if (width < 2 || height < 2) {
    return; // Câmara muito pequena para dividir
  }

  const horizontal = orientation === "horizontal";

  // Onde vamos dividir?
  const wx = x + (horizontal ? 0 : Math.floor(Math.random() * (width - 1)));
  const wy = y + (horizontal ? Math.floor(Math.random() * (height - 1)) : 0);

  // Onde vai ficar a passagem?
  const px = wx + (horizontal ? Math.floor(Math.random() * width) : 0);
  const py = wy + (horizontal ? 0 : Math.floor(Math.random() * height));

  // Comprimento da parede
  const length = horizontal ? width : height;

  // Direção perpendicular
  const dx = horizontal ? 1 : 0;
  const dy = horizontal ? 0 : 1;

  // Adicionar a parede
  for (let i = 0; i < length; i++) {
    const cellX = wx + i * dx;
    const cellY = wy + i * dy;

    // Pular a passagem
    if (cellX === px && cellY === py) {
      continue;
    }

    // Adicionar parede
    if (horizontal) {
      grid[cellY][cellX].walls.bottom = true;
      if (cellY + 1 < grid.length) {
        grid[cellY + 1][cellX].walls.top = true;
      }
    } else {
      grid[cellY][cellX].walls.right = true;
      if (cellX + 1 < grid[0].length) {
        grid[cellY][cellX + 1].walls.left = true;
      }
    }
  }

  // Dividir recursivamente as subcâmaras
  if (horizontal) {
    const h1 = wy - y + 1;
    const h2 = y + height - wy - 1;
    divide(grid, x, y, width, h1, chooseOrientation(width, h1));
    divide(grid, x, wy + 1, width, h2, chooseOrientation(width, h2));
  } else {
    const w1 = wx - x + 1;
    const w2 = x + width - wx - 1;
    divide(grid, x, y, w1, height, chooseOrientation(w1, height));
    divide(grid, wx + 1, y, w2, height, chooseOrientation(w2, height));
  }
}

/**
 * Escolhe a orientação da divisão baseada nas dimensões
 */
function chooseOrientation(
  width: number,
  height: number
): "horizontal" | "vertical" {
  if (width < height) {
    return "horizontal";
  } else if (height < width) {
    return "vertical";
  } else {
    return Math.random() < 0.5 ? "horizontal" : "vertical";
  }
}
