import type { TileConfig } from "../hooks/useMazeConfig";
import type { Direction } from "../types/game";

interface ConnectionControlsProps {
  connections: TileConfig["connections"];
  canConnectRight: boolean;
  canConnectDown: boolean;
  onToggle: (direction: Direction) => void;
}

export function ConnectionControls({
  connections,
  canConnectRight,
  canConnectDown,
  onToggle,
}: ConnectionControlsProps) {
  const hasRightConnection = connections.some((c) => c.direction === "right");
  const hasDownConnection = connections.some((c) => c.direction === "down");
  const hasUpConnection = connections.some((c) => c.direction === "up");
  const hasLeftConnection = connections.some((c) => c.direction === "left");

  return (
    <div className="flex flex-col gap-1">
      <label>Conexões:</label>
      {hasUpConnection && (
        <div className="flex gap-2 bg-slate-700 p-2 rounded items-center">
          <input
            type="checkbox"
            checked={hasUpConnection}
            onChange={() => onToggle("up")}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label>Cima</label>
        </div>
      )}
      {canConnectDown && (
        <div className="flex gap-2 bg-slate-700 p-2 rounded items-center">
          <input
            type="checkbox"
            checked={hasDownConnection}
            onChange={() => onToggle("down")}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label>Baixo</label>
        </div>
      )}
      {hasLeftConnection && (
        <div className="flex gap-2 bg-slate-700 p-2 rounded items-center">
          <input
            type="checkbox"
            checked={hasLeftConnection}
            onChange={() => onToggle("left")}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label>Esquerda</label>
        </div>
      )}
      {canConnectRight && (
        <div className="flex gap-2 bg-slate-700 p-2 rounded items-center">
          <input
            type="checkbox"
            checked={hasRightConnection}
            onChange={() => onToggle("right")}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label>Direita</label>
        </div>
      )}
    </div>
  );
}
