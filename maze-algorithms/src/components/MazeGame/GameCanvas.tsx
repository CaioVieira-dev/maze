import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
} from "react";
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

interface Camera {
  x: number;
  y: number;
}

export function GameCanvas({
  grid,
  gameState,
  config,
  cellSize,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastCameraPos, setLastCameraPos] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({
    width: 800,
    height: 600,
  });
  const [showCameraControls, setShowCameraControls] = useState(true);
  const [isManualControl, setIsManualControl] = useState(false); // NOVO: rastreia se usuário está controlando manualmente
  const lastPlayerPosRef = useRef<Position>(gameState.playerPosition); // NOVO: rastrear posição anterior do jogador

  const rows = grid.length;
  const cols = grid[0].length;

  const worldWidth = cols * cellSize;
  const worldHeight = rows * cellSize;

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const maxWidth = Math.min(rect.width, window.innerWidth - 40);
      const maxHeight = Math.min(600, window.innerHeight - 200);

      setContainerSize({
        width: Math.floor(maxWidth),
        height: Math.floor(maxHeight),
      });
    };

    const timeoutId = setTimeout(updateSize, 0);

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });

    resizeObserver.observe(container);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, []);

  const clampCamera = useCallback(
    (cam: Camera, viewWidth: number, viewHeight: number) => {
      return {
        x: Math.max(0, Math.min(cam.x, Math.max(0, worldWidth - viewWidth))),
        y: Math.max(0, Math.min(cam.y, Math.max(0, worldHeight - viewHeight))),
      };
    },
    [worldWidth, worldHeight],
  );

  // NOVO: Função para centralizar câmera no jogador
  const centerCameraOnPlayer = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const playerX = gameState.playerPosition.col * cellSize;
    const playerY = gameState.playerPosition.row * cellSize;

    const newCamera = {
      x: playerX - canvas.width / 2 + cellSize / 2,
      y: playerY - canvas.height / 2 + cellSize / 2,
    };

    setCamera(clampCamera(newCamera, canvas.width, canvas.height));
  }, [gameState.playerPosition, cellSize, clampCamera]);

  // NOVO: Seguir jogador automaticamente quando ele se move
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isManualControl || !gameState.isPlaying) return;

    // Verificar se o jogador se moveu
    const playerMoved =
      lastPlayerPosRef.current.row !== gameState.playerPosition.row ||
      lastPlayerPosRef.current.col !== gameState.playerPosition.col;

    if (playerMoved) {
      centerCameraOnPlayer();
      lastPlayerPosRef.current = gameState.playerPosition;
    }
  }, [
    gameState.playerPosition,
    gameState.isPlaying,
    isManualControl,
    centerCameraOnPlayer,
  ]);

  // NOVO: Resetar controle manual quando jogo reinicia
  useEffect(() => {
    if (!gameState.isPlaying) {
      setIsManualControl(false);
    }
  }, [gameState.isPlaying]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!showCameraControls) return;
    setIsDragging(true);
    setIsManualControl(true); // NOVO: marcar como controle manual
    setDragStart({ x: e.clientX, y: e.clientY });
    setLastCameraPos(camera);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !canvasRef.current) return;

      const deltaX = dragStart.x - e.clientX;
      const deltaY = dragStart.y - e.clientY;

      const newCamera = {
        x: lastCameraPos.x + deltaX,
        y: lastCameraPos.y + deltaY,
      };

      const canvas = canvasRef.current;
      setCamera(clampCamera(newCamera, canvas.width, canvas.height));
    },
    [isDragging, dragStart, lastCameraPos, clampCamera],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const panSpeed = 20;
      let newCamera = { ...camera };

      // Toggle controles com tecla 'C'
      if (e.key === "c" || e.key === "C") {
        setShowCameraControls((prev) => !prev);
        e.preventDefault();
        return;
      }

      // NOVO: Tecla 'F' para seguir jogador
      if (e.key === "f" || e.key === "F") {
        setIsManualControl((prev) => !prev);
        centerCameraOnPlayer();
        e.preventDefault();
        return;
      }

      if (!showCameraControls) return;

      switch (e.key) {
        case "ArrowLeft":
          setIsManualControl(true); // NOVO: ativar controle manual
          newCamera.x -= panSpeed;
          e.preventDefault();
          break;
        case "ArrowRight":
          setIsManualControl(true); // NOVO: ativar controle manual
          newCamera.x += panSpeed;
          e.preventDefault();
          break;
        case "ArrowUp":
          setIsManualControl(true); // NOVO: ativar controle manual
          newCamera.y -= panSpeed;
          e.preventDefault();
          break;
        case "ArrowDown":
          setIsManualControl(true); // NOVO: ativar controle manual
          newCamera.y += panSpeed;
          e.preventDefault();
          break;
        case "Home": {
          setIsManualControl(false); // NOVO: voltar para modo automático
          const playerX = gameState.playerPosition.col * cellSize;
          const playerY = gameState.playerPosition.row * cellSize;
          newCamera = {
            x: playerX - canvas.width / 2 + cellSize / 2,
            y: playerY - canvas.height / 2 + cellSize / 2,
          };
          e.preventDefault();
          break;
        }
        default:
          return;
      }

      setCamera(clampCamera(newCamera, canvas.width, canvas.height));
    },
    [
      camera,
      gameState.playerPosition,
      cellSize,
      clampCamera,
      showCameraControls,
      centerCameraOnPlayer,
    ],
  );

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const viewportWidth = Math.min(worldWidth, containerSize.width);
    const viewportHeight = Math.min(worldHeight, containerSize.height);

    canvas.width = viewportWidth;
    canvas.height = viewportHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    ctx.strokeStyle =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--color-maze-wall")
        .trim() || "#1e293b";
    ctx.lineWidth = 2;
    ctx.lineCap = "square";

    const startRow = Math.max(0, Math.floor(camera.y / cellSize) - 1);
    const endRow = Math.min(
      rows,
      Math.ceil((camera.y + canvas.height) / cellSize) + 1,
    );
    const startCol = Math.max(0, Math.floor(camera.x / cellSize) - 1);
    const endCol = Math.min(
      cols,
      Math.ceil((camera.x + canvas.width) / cellSize) + 1,
    );

    for (let row = startRow; row < endRow; row++) {
      for (let col = startCol; col < endCol; col++) {
        const cell = grid[row][col];
        if (!cell?.walls) continue;
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

    if (gameState.path.length > 1) {
      ctx.strokeStyle = config.pathColor;
      ctx.lineWidth = config.pathWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      const firstPos = gameState.path[0];
      ctx.moveTo(
        firstPos.col * cellSize + cellSize / 2,
        firstPos.row * cellSize + cellSize / 2,
      );

      for (let i = 1; i < gameState.path.length; i++) {
        const pos = gameState.path[i];
        ctx.lineTo(
          pos.col * cellSize + cellSize / 2,
          pos.row * cellSize + cellSize / 2,
        );
      }

      ctx.stroke();
    }

    drawSquare(ctx, gameState.startPosition, cellSize, config.startColor, 0.6);
    drawSquare(ctx, gameState.endPosition, cellSize, config.endColor, 0.6);

    gameState.checkpoints.forEach((checkpoint, index) => {
      const isVisited = gameState.visitedCheckpoints.has(index);
      drawStar(
        ctx,
        checkpoint,
        cellSize,
        config.checkpointColor,
        isVisited ? 0.2 : 0.5,
      );
    });

    if (gameState.isPlaying) {
      drawCircle(
        ctx,
        gameState.playerPosition,
        cellSize,
        config.playerColor,
        config.playerSize,
      );
    }

    ctx.restore();

    // MODIFICADO: Instruções atualizadas no canto inferior direito
    if (!gameState.isComplete && showCameraControls) {
      const boxWidth = 235;
      const boxHeight = 80; // AUMENTADO para incluir nova linha
      const padding = 10;
      const boxX = canvas.width - boxWidth - padding;
      const boxY = canvas.height - boxHeight - padding;

      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

      ctx.fillStyle = "#ffffff";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("🖱️ Arraste para mover a câmera", boxX + 5, boxY + 15);
      ctx.fillText("⌨️ Setas para navegar", boxX + 5, boxY + 30);
      ctx.fillText("🏠 Home/F - Alternar camera", boxX + 5, boxY + 45); // MODIFICADO
      ctx.fillText("C - Esconder controles", boxX + 5, boxY + 60);

      // NOVO: Indicador de modo
      if (isManualControl) {
        ctx.fillText("📷 Modo: Manual", boxX + 5, boxY + 75);
      } else {
        ctx.fillText("🎯 Modo: Seguindo", boxX + 5, boxY + 75);
      }
    }

    if (!gameState.isComplete && !showCameraControls) {
      const boxWidth = 145;
      const boxHeight = 20;
      const padding = 10;
      const boxX = canvas.width - boxWidth - padding;
      const boxY = canvas.height - boxHeight - padding;

      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

      ctx.fillStyle = "#ffffff";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("C - Mostrar controles", boxX + 5, boxY + 14);
    }

    if (gameState.isComplete) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 32px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🎉Você Venceu!🎉", canvas.width / 2, canvas.height / 2);

      ctx.font = "16px sans-serif";
      ctx.fillText(
        'Pressione "Jogar" para',
        canvas.width / 2,
        canvas.height / 2 + 30,
      );
      ctx.fillText(
        "começar novamente",
        canvas.width / 2,
        canvas.height / 2 + 50,
      );
    }
  }, [
    grid,
    gameState,
    config,
    cellSize,
    camera,
    rows,
    cols,
    worldWidth,
    worldHeight,
    containerSize,
    showCameraControls,
    isManualControl, // NOVO
  ]);

  return (
    <div
      ref={containerRef}
      className="w-full flex items-center justify-center bg-slate-900"
      style={{
        height: "600px",
        maxHeight: "600px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        className="border-2 border-slate-800 dark:border-slate-200 rounded"
        style={{
          cursor: showCameraControls
            ? isDragging
              ? "grabbing"
              : "grab"
            : "default",
          maxWidth: "100%",
          maxHeight: "100%",
          display: "block",
        }}
      />
    </div>
  );
}

function drawSquare(
  ctx: CanvasRenderingContext2D,
  pos: Position,
  cellSize: number,
  color: string,
  sizeFactor: number,
) {
  const size = cellSize * sizeFactor;
  const offset = (cellSize - size) / 2;

  ctx.fillStyle = color;
  ctx.fillRect(
    pos.col * cellSize + offset,
    pos.row * cellSize + offset,
    size,
    size,
  );
}

function drawCircle(
  ctx: CanvasRenderingContext2D,
  pos: Position,
  cellSize: number,
  color: string,
  radius: number,
) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(
    pos.col * cellSize + cellSize / 2,
    pos.row * cellSize + cellSize / 2,
    radius,
    0,
    Math.PI * 2,
  );
  ctx.fill();
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  pos: Position,
  cellSize: number,
  color: string,
  sizeFactor: number,
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
