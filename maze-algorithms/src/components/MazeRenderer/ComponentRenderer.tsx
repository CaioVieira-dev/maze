import { type MazeGrid } from "../../types/maze";

interface ComponentRendererProps {
  grid: MazeGrid;
  cellSize?: number;
}

export function ComponentRenderer({
  grid,
  cellSize = 20,
}: ComponentRendererProps) {
  const rows = grid.length;
  const cols = grid[0].length;

  return (
    <div
      className="inline-block border-2 border-slate-800 dark:border-slate-200"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
      }}
    >
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className="bg-slate-50 dark:bg-slate-800"
            style={{
              borderTop: cell.walls.top
                ? "2px solid var(--color-maze-wall)"
                : "none",
              borderRight: cell.walls.right
                ? "2px solid var(--color-maze-wall)"
                : "none",
              borderBottom: cell.walls.bottom
                ? "2px solid var(--color-maze-wall)"
                : "none",
              borderLeft: cell.walls.left
                ? "2px solid var(--color-maze-wall)"
                : "none",
              color: "var(--color-maze-wall)",
            }}
          />
        ))
      )}
    </div>
  );
}
