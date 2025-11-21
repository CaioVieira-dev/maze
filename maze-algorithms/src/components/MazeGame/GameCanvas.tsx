import { useEffect, useRef } from "react";
import { type MazeGrid } from "../../types/maze";
import {
  type GameState,
  type GameConfig,
  type Position,
} from "../../types/game";

interface GameCanvasProps {
  grid: MazeGrid;
  gameState: GameState;
  config: Required<GameConfig>;
  cellSize: number;
}

export function GameCanvas({
  grid,
  gameState,
  config,
  cellSize,
}: GameCanvasProps) {
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

    // Configurar estilo de paredes
    ctx.strokeStyle =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--color-maze-wall")
        .trim() || "#1e293b";
    ctx.lineWidth = 2;
    ctx.lineCap = "square";

    // Desenhar paredes do labirinto
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cell = grid[row][col];
        const x = col * cellSize;
        const y = row * cellSize;

        ctx.beginPath();

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

    // Desenhar caminho percorrido (trail)
    if (gameState.path.length > 1) {
      ctx.strokeStyle = config.pathColor;
      ctx.lineWidth = config.pathWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      const firstPos = gameState.path[0];
      ctx.moveTo(
        firstPos.col * cellSize + cellSize / 2,
        firstPos.row * cellSize + cellSize / 2
      );

      for (let i = 1; i < gameState.path.length; i++) {
        const pos = gameState.path[i];
        ctx.lineTo(
          pos.col * cellSize + cellSize / 2,
          pos.row * cellSize + cellSize / 2
        );
      }

      ctx.stroke();
    }

    // Desenhar início (quadrado azul)
    drawSquare(ctx, gameState.startPosition, cellSize, config.startColor, 0.6);

    // Desenhar fim (quadrado vermelho)
    drawSquare(ctx, gameState.endPosition, cellSize, config.endColor, 0.6);

    // Desenhar checkpoints (estrelas amarelas)
    gameState.checkpoints.forEach((checkpoint, index) => {
      const isVisited = gameState.visitedCheckpoints.has(index);
      if (!isVisited) {
        drawStar(ctx, checkpoint, cellSize, config.checkpointColor, 0.5);
      } else {
        // Checkpoint visitado - desenhar com opacidade reduzida
        drawStar(ctx, checkpoint, cellSize, config.checkpointColor, 0.2);
      }
    });

    // Desenhar jogador (círculo)
    if (gameState.isPlaying) {
      drawCircle(
        ctx,
        gameState.playerPosition,
        cellSize,
        config.playerColor,
        config.playerSize
      );
    }

    // Mostrar mensagem de vitória
    if (gameState.isComplete) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 32px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🎉 Você Venceu! 🎉", canvas.width / 2, canvas.height / 2);

      ctx.font = "16px sans-serif";
      ctx.fillText(
        'Pressione "Jogar" para começar novamente',
        canvas.width / 2,
        canvas.height / 2 + 40
      );
    }
  }, [grid, gameState, config, cellSize]);

  const rows = grid.length;
  const cols = grid[0].length;

  return (
    <canvas
      ref={canvasRef}
      width={cols * cellSize}
      height={rows * cellSize}
      className="border-2 border-slate-800 dark:border-slate-200 rounded"
    />
  );
}

/**
 * Desenha um quadrado centrado na célula
 */
function drawSquare(
  ctx: CanvasRenderingContext2D,
  pos: Position,
  cellSize: number,
  color: string,
  sizeFactor: number
) {
  const size = cellSize * sizeFactor;
  const offset = (cellSize - size) / 2;

  ctx.fillStyle = color;
  ctx.fillRect(
    pos.col * cellSize + offset,
    pos.row * cellSize + offset,
    size,
    size
  );
}

/**
 * Desenha um círculo centrado na célula
 */
function drawCircle(
  ctx: CanvasRenderingContext2D,
  pos: Position,
  cellSize: number,
  color: string,
  radius: number
) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(
    pos.col * cellSize + cellSize / 2,
    pos.row * cellSize + cellSize / 2,
    radius,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

/**
 * Desenha uma estrela de 5 pontas
 */
function drawStar(
  ctx: CanvasRenderingContext2D,
  pos: Position,
  cellSize: number,
  color: string,
  sizeFactor: number
) {
  const centerX = pos.col * cellSize + cellSize / 2;
  const centerY = pos.row * cellSize + cellSize / 2;
  const outerRadius = (cellSize * sizeFactor) / 2;
  const innerRadius = outerRadius / 2.5;
  const spikes = 5;

  ctx.fillStyle = color;
  ctx.beginPath();

  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (Math.PI * i) / spikes - Math.PI / 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.closePath();
  ctx.fill();
}
