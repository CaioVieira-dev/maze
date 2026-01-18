import type { TileConfig } from "../hooks/useMazeConfig";
import type { AlgorithmType } from "../types/maze";
import { AlgorithmSelector } from "./AlgorithmSelector";
import { ConnectionControls } from "./ConnectionControls";

interface MazeTileConfigProps {
  tile: TileConfig;
  tileIndex: number;
  tilesPerRow: number;
  isLastRow: boolean;
  onAlgorithmChange: (algorithm: AlgorithmType) => void;
  onToggleConnection: (direction: "right" | "down") => void;
}

export function MazeTileConfig({
  tile,
  tileIndex,
  tilesPerRow,
  isLastRow,
  onAlgorithmChange,
  onToggleConnection,
}: MazeTileConfigProps) {
  const canConnectRight = tileIndex < tilesPerRow - 1;
  const canConnectDown = !isLastRow;

  return (
    <div className="tile-config flex flex-col gap-2">
      <h4>Labirinto {tile.id}</h4>

      <AlgorithmSelector value={tile.algorithm} onChange={onAlgorithmChange} />

      <ConnectionControls
        connections={tile.connections}
        canConnectRight={canConnectRight}
        canConnectDown={canConnectDown}
        onToggle={onToggleConnection}
      />
    </div>
  );
}
