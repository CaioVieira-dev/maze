import { Glossary } from "./components/Glossary";
import { AlgorithmSection } from "./components/AlgorithmSection";
import { algorithmsData } from "./data/algorithms";
import { binaryTreeCode, generateBinaryTree } from "./algorithms/binaryTree";
import {
  generateRecursiveBacktracker,
  recursiveDivisionCode,
} from "./algorithms/recursiveBacktracker";
import { generatePrim, primCode } from "./algorithms/prim";
import { generateKruskal, kruskalCode } from "./algorithms/kruskal";
import { ellerCode, generateEller } from "./algorithms/eller";
import { generateWilson, wilsonCode } from "./algorithms/wilson";
import {
  aldousBroderCode,
  generateAldousBroder,
} from "./algorithms/aldousBroder";
import { generateGrowingTree, growingTreeCode } from "./algorithms/growingTree";
import { generateHuntAndKill, huntAndKillCode } from "./algorithms/huntAndKill";
import {
  generateRecursiveDivision,
  recursiveBacktrackerCode,
} from "./algorithms/recursiveDivision";
import { generateSidewinder, sidewinderCode } from "./algorithms/sidewinder";
import { MazeGame } from "./components/MazeGame";
import { connectTiles, createTile } from "./utils/tileFactory";
import { mergeTileLayout } from "./utils/gridMerger";

// montar layout, gerar tiles e conectá-los
const tileA = createTile("A", "binary-tree");
const tileB = createTile("B", "recursive-backtracker");
const tileC = createTile("C", "recursive-backtracker");

// conecta tileA à direita do tileB
connectTiles(tileA, tileB, "right");
connectTiles(tileA, tileC, "down");

const layout = [
  [tileA, tileB],
  [tileC, null],
];

const bigMazeGrid = mergeTileLayout(layout);

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

        {/* Eller's Algorithm */}
        <AlgorithmSection
          info={algorithmsData[4]}
          generateFn={generateEller}
          code={ellerCode}
        />

        {/* Wilson's Algorithm */}
        <AlgorithmSection
          info={algorithmsData[5]}
          generateFn={generateWilson}
          code={wilsonCode}
        />

        {/* Aldous-Broder Algorithm */}
        <AlgorithmSection
          info={algorithmsData[6]}
          generateFn={generateAldousBroder}
          code={aldousBroderCode}
        />

        {/* Growing Tree Algorithm */}
        <AlgorithmSection
          info={algorithmsData[7]}
          generateFn={generateGrowingTree}
          code={growingTreeCode}
        />

        {/* Hunt-and-Kill Algorithm */}
        <AlgorithmSection
          info={algorithmsData[8]}
          generateFn={generateHuntAndKill}
          code={huntAndKillCode}
        />

        {/* Recursive Division Algorithm */}
        <AlgorithmSection
          info={algorithmsData[9]}
          generateFn={generateRecursiveDivision}
          code={recursiveDivisionCode}
        />

        {/* Sidewinder Algorithm */}
        <AlgorithmSection
          info={algorithmsData[10]}
          generateFn={generateSidewinder}
          code={sidewinderCode}
        />

        <MazeGame
          grid={bigMazeGrid}
          cellSize={24}
          config={
            {
              /* opcoes do player, cores, etc */
            }
          }
        />
      </div>
    </div>
  );
}

export default App;
