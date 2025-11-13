import { useState } from "react";
import { type AlgorithmInfo } from "../types/maze";
import { MazeRenderer } from "./MazeRenderer";
import { type MazeGrid } from "../types/maze";

interface AlgorithmSectionProps {
  info: AlgorithmInfo;
  generateFn: (rows: number, cols: number) => MazeGrid;
  code: string;
}

export function AlgorithmSection({
  info,
  generateFn,
  code,
}: AlgorithmSectionProps) {
  const [maze, setMaze] = useState<MazeGrid | null>(null);
  const [size, setSize] = useState(15);
  const [showCode, setShowCode] = useState(false);

  const handleGenerate = () => {
    const newMaze = generateFn(size, size);
    setMaze(newMaze);
  };

  return (
    <section id={info.id} className="mb-16 scroll-mt-8">
      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
        {/* Header */}
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          {info.name}
        </h2>

        {/* Complexidade */}
        <div className="flex gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
          <span>
            <strong>Tempo:</strong> {info.complexity.time}
          </span>
          <span>
            <strong>Espaço:</strong> {info.complexity.space}
          </span>
        </div>

        {/* Descrição */}
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          {info.description}
        </p>

        {/* Características */}
        <div className="mb-6">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Características:
          </h3>
          <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
            {info.characteristics.map((char, idx) => (
              <li key={idx}>{char}</li>
            ))}
          </ul>
        </div>

        {/* Controles */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label
              htmlFor={`size-${info.id}`}
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Tamanho:
            </label>
            <input
              id={`size-${info.id}`}
              type="range"
              min="5"
              max="50"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-32"
            />
            <span className="text-sm text-slate-600 dark:text-slate-400 w-16">
              {size}×{size}
            </span>
          </div>

          <button
            onClick={handleGenerate}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            Gerar Labirinto
          </button>

          <button
            onClick={() => setShowCode(!showCode)}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-md transition-colors"
          >
            {showCode ? "Esconder" : "Ver"} Código
          </button>
        </div>

        {/* Código */}
        {showCode && (
          <div className="mb-6">
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-md overflow-x-auto text-sm">
              <code>{code}</code>
            </pre>
          </div>
        )}

        {/* Renderização do Labirinto */}
        {maze && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-md border border-slate-200 dark:border-slate-700">
            <MazeRenderer grid={maze} cellSize={20} />
          </div>
        )}
      </div>
    </section>
  );
}
