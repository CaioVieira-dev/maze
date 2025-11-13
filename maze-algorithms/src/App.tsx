import { Glossary } from "./components/Glossary";
import { AlgorithmSection } from "./components/AlgorithmSection";
import { algorithmsData } from "./data/algorithms";
import { generateBinaryTree } from "./algorithms/binaryTree";
import { generateRecursiveBacktracker } from "./algorithms/recursiveBacktracker";
import { generatePrim } from "./algorithms/prim";
import { generateKruskal } from "./algorithms/kruskal";

// Código exemplo Binary Tree
const binaryTreeCode = `function generateBinaryTree(rows: number, cols: number): MazeGrid {
  const grid = createEmptyGrid(rows, cols);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const current = grid[row][col];
      const neighbors = [];

      // Norte
      if (row > 0) neighbors.push(grid[row - 1][col]);
      
      // Leste
      if (col < cols - 1) neighbors.push(grid[row][col + 1]);

      // Escolhe aleatoriamente e remove parede
      if (neighbors.length > 0) {
        const chosen = randomChoice(neighbors);
        removeWall(current, chosen);
      }
    }
  }

  return grid;
}`;

// Código exemplo Recursive Backtracker
const recursiveBacktrackerCode = `function generateRecursiveBacktracker(rows: number, cols: number): MazeGrid {
  const grid = createEmptyGrid(rows, cols);
  const stack: Cell[] = [];

  // Começar na célula (0, 0)
  const startCell = grid[0][0];
  startCell.visited = true;
  stack.push(startCell);

  while (stack.length > 0) {
    const current = stack[stack.length - 1]; // Peek

    // Obter vizinhos não visitados
    const unvisitedNeighbors = getNeighbors(grid, current, true);

    if (unvisitedNeighbors.length > 0) {
      // Escolher vizinho aleatório
      const chosen = randomChoice(unvisitedNeighbors);

      // Remover parede entre current e chosen
      removeWall(current, chosen);

      // Adicionar à pilha
      chosen.visited = true;
      stack.push(chosen);
    } else {
      // Backtrack
      stack.pop();
    }
  }

  return grid;
}`;

// Código exemplo Prim
const primCode = `function generatePrim(rows: number, cols: number): MazeGrid {
  const grid = createEmptyGrid(rows, cols);
  const frontier: Cell[] = [];

  // Começar com célula aleatória
  const startCell = grid[randomRow][randomCol];
  startCell.visited = true;

  // Adicionar vizinhos à fronteira
  addToFrontier(grid, startCell, frontier);

  while (frontier.length > 0) {
    // Escolher célula aleatória da fronteira
    const current = frontier.splice(randomIndex, 1)[0];

    // Obter vizinhos visitados
    const visitedNeighbors = getNeighbors(grid, current)
      .filter(n => n.visited);

    if (visitedNeighbors.length > 0) {
      // Conectar a um vizinho visitado aleatório
      const chosen = randomChoice(visitedNeighbors);
      removeWall(current, chosen);
      
      current.visited = true;
      addToFrontier(grid, current, frontier);
    }
  }

  return grid;
}`;

// Código exemplo Kruskal
const kruskalCode = `function generateKruskal(rows: number, cols: number): MazeGrid {
  const grid = createEmptyGrid(rows, cols);
  const walls: Wall[] = [];
  const disjointSet = new DisjointSet();

  // Criar conjunto para cada célula
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      disjointSet.makeSet(\`\${row},\${col}\`);
    }
  }

  // Coletar todas as paredes
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (col < cols - 1) walls.push({cell1, cell2: right});
      if (row < rows - 1) walls.push({cell1, cell2: bottom});
    }
  }

  // Embaralhar paredes
  shuffleArray(walls);

  // Processar cada parede
  for (const wall of walls) {
    if (!disjointSet.connected(key1, key2)) {
      removeWall(wall.cell1, wall.cell2);
      disjointSet.union(key1, key2);
    }
  }

  return grid;
}`;

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Algoritmos de Geração de Labirinto
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Explore diferentes algoritmos com visualizações interativas
          </p>
        </header>

        <Glossary />

        {/* Binary Tree */}
        <AlgorithmSection
          info={algorithmsData[0]}
          generateFn={generateBinaryTree}
          code={binaryTreeCode}
        />

        {/* Recursive Backtracker */}
        <AlgorithmSection
          info={algorithmsData[1]}
          generateFn={generateRecursiveBacktracker}
          code={recursiveBacktrackerCode}
        />

        {/* Prim's Algorithm */}
        <AlgorithmSection
          info={algorithmsData[2]}
          generateFn={generatePrim}
          code={primCode}
        />

        {/* Kruskal's Algorithm */}
        <AlgorithmSection
          info={algorithmsData[3]}
          generateFn={generateKruskal}
          code={kruskalCode}
        />
      </div>
    </div>
  );
}

export default App;
