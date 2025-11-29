import { mergeTileLayout } from "../utils/gridMerger";
import { connectTiles, createTile } from "../utils/tileFactory";
import { MazeGame } from "./MazeGame";

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

export function BigMazeGame() {
  return (
    <MazeGame
      grid={bigMazeGrid}
      cellSize={24}
      config={
        {
          /* opcoes do player, cores, etc */
        }
      }
    />
  );
}
