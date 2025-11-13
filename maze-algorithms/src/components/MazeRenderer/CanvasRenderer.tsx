import { useEffect, useRef } from "react";
import { type MazeGrid } from "../../types/maze";

interface CanvasRendererProps {
  grid: MazeGrid;
  cellSize?: number;
}

export function CanvasRenderer({ grid, cellSize = 20 }: CanvasRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rows = grid.length;
    const cols = grid[0].length;

    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Configurar estilo
    ctx.strokeStyle =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--color-maze-wall")
        .trim() || "#1e293b";
    ctx.lineWidth = 2;
    ctx.lineCap = "square";

    // Desenhar células
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cell = grid[row][col];
        const x = col * cellSize;
        const y = row * cellSize;

        ctx.beginPath();

        // Desenhar paredes
        if (cell.walls.top) {
          ctx.moveTo(x, y);
          ctx.lineTo(x + cellSize, y);
        }

        if (cell.walls.right) {
          ctx.moveTo(x + cellSize, y);
          ctx.lineTo(x + cellSize, y + cellSize);
        }

        if (cell.walls.bottom) {
          ctx.moveTo(x, y + cellSize);
          ctx.lineTo(x + cellSize, y + cellSize);
        }

        if (cell.walls.left) {
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + cellSize);
        }

        ctx.stroke();
      }
    }
  }, [grid, cellSize]);

  const rows = grid.length;
  const cols = grid[0].length;

  return (
    <canvas
      ref={canvasRef}
      width={cols * cellSize}
      height={rows * cellSize}
      className="border-2 border-slate-800 dark:border-slate-200"
    />
  );
}
