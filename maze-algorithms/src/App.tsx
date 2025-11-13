import { Glossary } from "./components/Glossary";
import { AlgorithmSection } from "./components/AlgorithmSection";
import { algorithmsData } from "./data/algorithms";
import { generateBinaryTree } from "./algorithms/binaryTree";

// Código exemplo para exibição
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
      </div>
    </div>
  );
}

export default App;
