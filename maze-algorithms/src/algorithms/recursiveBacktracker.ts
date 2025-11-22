import { type MazeGrid } from "../types/maze";
import {
  createEmptyGrid,
  removeWall,
  getNeighbors,
  randomChoice,
} from "../utils/maze";

/**
 * Algoritmo Recursive Backtracker (DFS)
 * Usa busca em profundidade com backtracking para gerar o labirinto
 */
export function generateRecursiveBacktracker(
  rows: number,
  cols: number
): MazeGrid {
  const grid = createEmptyGrid(rows, cols);
  const stack: (typeof grid)[0][0][] = [];

  // Começar na célula (0, 0)
  const startCell = grid[0][0];
  startCell.visited = true;
  stack.push(startCell);

  while (stack.length > 0) {
    const current = stack[stack.length - 1]; // Peek (não remove ainda)

    // Obter vizinhos não visitados
    const unvisitedNeighbors = getNeighbors(grid, current, true);

    if (unvisitedNeighbors.length > 0) {
      // Escolher um vizinho aleatório
      const chosen = randomChoice(unvisitedNeighbors);

      // Remover parede entre current e chosen
      removeWall(current, chosen);

      // Marcar chosen como visitado e adicionar à pilha
      chosen.visited = true;
      stack.push(chosen);
    } else {
      // Sem vizinhos não visitados, fazer backtrack
      stack.pop();
    }
  }

  return grid;
}

// Código exemplo Recursive Division
export const recursiveDivisionCode = `function generateRecursiveDivision(rows: number, cols: number): MazeGrid {
  const grid = createEmptyGrid(rows, cols);

  // Começar com campo aberto (sem paredes internas)
  removeAllInnerWalls(grid);
  addOuterWalls(grid);

  // Dividir recursivamente
  divide(grid, 0, 0, cols, rows, chooseOrientation(cols, rows));

  return grid;
}

function divide(grid, x, y, width, height, orientation) {
  if (width < 2 || height < 2) return;

  const horizontal = orientation === 'horizontal';

  // Escolher onde dividir
  const wx = x + (horizontal ? 0 : random(width - 1));
  const wy = y + (horizontal ? random(height - 1) : 0);

  // Escolher onde colocar a passagem
  const px = wx + (horizontal ? random(width) : 0);
  const py = wy + (horizontal ? 0 : random(height));

  // Adicionar parede com passagem
  addWallWithGap(grid, wx, wy, px, py, horizontal);

  // Dividir subcâmaras recursivamente
  if (horizontal) {
    divide(grid, x, y, width, wy - y + 1, ...);
    divide(grid, x, wy + 1, width, y + height - wy - 1, ...);
  } else {
    divide(grid, x, y, wx - x + 1, height, ...);
    divide(grid, wx + 1, y, x + width - wx - 1, height, ...);
  }
}`;
