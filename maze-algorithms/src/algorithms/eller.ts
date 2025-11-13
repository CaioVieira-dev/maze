import { type MazeGrid } from "../types/maze";
import { createEmptyGrid, removeWall } from "../utils/maze";

/**
 * Algoritmo de Eller
 * Constrói o labirinto linha por linha usando conjuntos
 * Extremamente eficiente em memória - O(largura)
 */
export function generateEller(rows: number, cols: number): MazeGrid {
  const grid = createEmptyGrid(rows, cols);

  // Rastrear qual conjunto cada célula pertence
  let rowSets: number[] = [];
  let nextSetId = 1;

  for (let row = 0; row < rows; row++) {
    const isLastRow = row === rows - 1;

    // Passo 1: Atribuir células sem conjunto a novos conjuntos
    for (let col = 0; col < cols; col++) {
      if (rowSets[col] === undefined || rowSets[col] === 0) {
        rowSets[col] = nextSetId++;
      }
    }

    // Passo 2: Conectar células horizontalmente (aleatoriamente)
    for (let col = 0; col < cols - 1; col++) {
      const current = grid[row][col];
      const right = grid[row][col + 1];

      // Se estiverem em conjuntos diferentes, decidir aleatoriamente conectar
      // Na última linha, sempre conectar se forem de conjuntos diferentes
      if (rowSets[col] !== rowSets[col + 1]) {
        if (isLastRow || Math.random() > 0.5) {
          // Conectar: remover parede e unir conjuntos
          removeWall(current, right);
          const oldSet = rowSets[col + 1];
          const newSet = rowSets[col];
          // Atualizar todas as células do conjunto antigo
          for (let i = 0; i < cols; i++) {
            if (rowSets[i] === oldSet) {
              rowSets[i] = newSet;
            }
          }
        }
      }
    }

    // Passo 3: Criar conexões verticais (se não for a última linha)
    if (!isLastRow) {
      const setVerticals: Map<number, number[]> = new Map();

      // Agrupar células por conjunto
      for (let col = 0; col < cols; col++) {
        const setId = rowSets[col];
        if (!setVerticals.has(setId)) {
          setVerticals.set(setId, []);
        }
        setVerticals.get(setId)!.push(col);
      }

      // Para cada conjunto, criar pelo menos uma conexão vertical
      const nextRowSets: number[] = new Array(cols).fill(0);

      for (const [setId, columns] of setVerticals.entries()) {
        // Decidir quantas conexões verticais criar (pelo menos 1)
        const numVerticals = Math.max(
          1,
          Math.floor(Math.random() * columns.length) + 1
        );

        // Embaralhar e pegar as primeiras numVerticals colunas
        const shuffled = [...columns].sort(() => Math.random() - 0.5);
        const chosen = shuffled.slice(0, numVerticals);

        // Criar conexões verticais
        for (const col of chosen) {
          const current = grid[row][col];
          const below = grid[row + 1][col];
          removeWall(current, below);
          nextRowSets[col] = setId; // Célula abaixo herda o conjunto
        }
      }

      rowSets = nextRowSets;
    }
  }

  return grid;
}
