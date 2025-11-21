import { type MazeGrid } from "../../types/maze";
import { type GameConfig } from "../../types/game";
import { useMazeGame } from "../../hooks/useMazeGame";
import { GameCanvas } from "./GameCanvas";

interface MazeGameProps {
  grid: MazeGrid;
  cellSize?: number;
  config?: GameConfig;
}

export function MazeGame({ grid, cellSize = 20, config }: MazeGameProps) {
  const {
    gameState,
    startGame,
    config: gameConfig,
  } = useMazeGame(grid, config);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Informações do jogo */}
      <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 w-full max-w-md">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Checkpoints:
          </span>
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {gameState.visitedCheckpoints.size} / {gameState.checkpoints.length}
          </span>
        </div>

        {!gameState.isPlaying && !gameState.isComplete && (
          <button
            onClick={startGame}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            Jogar
          </button>
        )}

        {gameState.isPlaying && !gameState.isComplete && (
          <div className="text-center text-sm text-slate-600 dark:text-slate-400">
            Use as setas ← ↑ ↓ → ou WASD para mover
          </div>
        )}

        {gameState.isComplete && (
          <button
            onClick={startGame}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
          >
            Jogar Novamente
          </button>
        )}
      </div>

      {/* Canvas do jogo */}
      <div className="inline-block">
        <GameCanvas
          grid={grid}
          gameState={gameState}
          config={gameConfig}
          cellSize={cellSize}
        />
      </div>

      {/* Legenda */}
      <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 w-full max-w-md">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Legenda:
        </h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            <span className="text-slate-700 dark:text-slate-300">Início</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <span className="text-slate-700 dark:text-slate-300">Fim</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <span className="text-slate-700 dark:text-slate-300">
              Checkpoint
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
            <span className="text-slate-700 dark:text-slate-300">Jogador</span>
          </div>
        </div>
      </div>
    </div>
  );
}
