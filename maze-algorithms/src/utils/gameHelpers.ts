import { type MazeGrid } from "../types/maze";
import { type Position, type Direction } from "../types/game";

/**
 * Verifica se uma posição está dentro dos limites do grid
 */
export function isValidPosition(grid: MazeGrid, pos: Position): boolean {
  return (
    pos.row >= 0 &&
    pos.row < grid.length &&
    pos.col >= 0 &&
    pos.col < grid[0].length
  );
}

/**
 * Verifica se é possível mover de uma célula para outra (sem parede entre elas)
 */
export function canMove(grid: MazeGrid, from: Position, to: Position): boolean {
  if (!isValidPosition(grid, from) || !isValidPosition(grid, to)) {
    return false;
  }

  const fromCell = grid[from.row][from.col];
  const rowDiff = to.row - from.row;
  const colDiff = to.col - from.col;

  // Verificar se são células adjacentes
  if (Math.abs(rowDiff) + Math.abs(colDiff) !== 1) {
    return false;
  }

  // Verificar parede na direção do movimento
  if (rowDiff === -1) return !fromCell.walls.top; // Mover para cima
  if (rowDiff === 1) return !fromCell.walls.bottom; // Mover para baixo
  if (colDiff === -1) return !fromCell.walls.left; // Mover para esquerda
  if (colDiff === 1) return !fromCell.walls.right; // Mover para direita

  return false;
}

/**
 * Obtém a próxima posição baseada na direção
 */
export function getNextPosition(pos: Position, direction: Direction): Position {
  switch (direction) {
    case "up":
      return { row: pos.row - 1, col: pos.col };
    case "down":
      return { row: pos.row + 1, col: pos.col };
    case "left":
      return { row: pos.row, col: pos.col - 1 };
    case "right":
      return { row: pos.row, col: pos.col + 1 };
  }
}

/**
 * Gera posições aleatórias para checkpoints, garantindo que são alcançáveis
 */
export function generateCheckpoints(
  grid: MazeGrid,
  start: Position,
  end: Position,
  count: number
): Position[] {
  const checkpoints: Position[] = [];
  const rows = grid.length;
  const cols = grid[0].length;

  while (checkpoints.length < count) {
    const pos: Position = {
      row: Math.floor(Math.random() * rows),
      col: Math.floor(Math.random() * cols),
    };

    // Verificar se não é a posição de início ou fim
    if (
      (pos.row === start.row && pos.col === start.col) ||
      (pos.row === end.row && pos.col === end.col)
    ) {
      continue;
    }

    // Verificar se já não existe um checkpoint nessa posição
    if (checkpoints.some((cp) => cp.row === pos.row && cp.col === pos.col)) {
      continue;
    }

    checkpoints.push(pos);
  }

  return checkpoints;
}

/**
 * Verifica se duas posições são iguais
 */
export function isSamePosition(pos1: Position, pos2: Position): boolean {
  return pos1.row === pos2.row && pos1.col === pos2.col;
}

export function getAccessiblePositions(
  grid: MazeGrid,
  start: Position
): Set<string> {
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = new Set<string>();
  const queue: Position[] = [start];
  visited.add(`${start.row},${start.col}`);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const neighbors = [
      { row: current.row - 1, col: current.col },
      { row: current.row + 1, col: current.col },
      { row: current.row, col: current.col - 1 },
      { row: current.row, col: current.col + 1 },
    ];

    for (const n of neighbors) {
      if (
        n.row >= 0 &&
        n.row < rows &&
        n.col >= 0 &&
        n.col < cols &&
        !visited.has(`${n.row},${n.col}`) &&
        canMove(grid, current, n)
      ) {
        visited.add(`${n.row},${n.col}`);
        queue.push(n);
      }
    }
  }

  return visited;
}
