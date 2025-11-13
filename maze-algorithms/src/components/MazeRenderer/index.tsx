import { type MazeGrid } from "../../types/maze";
import { ComponentRenderer } from "./ComponentRenderer";
import { CanvasRenderer } from "./CanvasRenderer";

interface MazeRendererProps {
  grid: MazeGrid;
  cellSize?: number;
  forceRenderer?: "component" | "canvas";
}

const THRESHOLD = 30; // Tamanho máximo para usar componentes

export function MazeRenderer({
  grid,
  cellSize = 20,
  forceRenderer,
}: MazeRendererProps) {
  const rows = grid.length;
  const cols = grid[0].length;
  const size = Math.max(rows, cols);

  // Decidir qual renderer usar
  const useCanvas =
    forceRenderer === "canvas" ||
    (forceRenderer !== "component" && size > THRESHOLD);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="inline-block">
        {useCanvas ? (
          <CanvasRenderer grid={grid} cellSize={cellSize} />
        ) : (
          <ComponentRenderer grid={grid} cellSize={cellSize} />
        )}
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Renderizado com:{" "}
        <span className="font-semibold">
          {useCanvas ? "Canvas" : "React Components"}
        </span>{" "}
        ({rows}×{cols})
      </p>
    </div>
  );
}
