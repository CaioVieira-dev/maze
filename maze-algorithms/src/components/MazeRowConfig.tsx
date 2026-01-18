import type { RowConfig } from "../hooks/useMazeConfig";
import type { AlgorithmType } from "../types/maze";
import { MazeTileConfig } from "./MazeTileConfig";
import { Button } from "./ui/Button";

interface MazeRowConfigProps {
  row: RowConfig;
  rowIndex: number;
  tilesPerRow: number;
  totalRows: number;
  onRemove: () => void;
  onAlgorithmChange: (tileIndex: number, algorithm: AlgorithmType) => void;
  onToggleConnection: (tileIndex: number, direction: "right" | "down") => void;
}

export function MazeRowConfig({
  row,
  rowIndex,
  tilesPerRow,
  totalRows,
  onRemove,
  onAlgorithmChange,
  onToggleConnection,
}: MazeRowConfigProps) {
  return (
    <div className="py-2 my-2">
      <div className="flex items-center gap-2 justify-between w-full md:w-1/3 mb-2">
        <h3>Linha {rowIndex + 1}</h3>
        <Button onClick={onRemove}>Remover Linha</Button>
      </div>

      <div className="flex flex-wrap gap-4">
        {row.tiles.map((tile, tileIndex) => (
          <MazeTileConfig
            key={tile.id}
            tile={tile}
            tileIndex={tileIndex}
            tilesPerRow={tilesPerRow}
            isLastRow={rowIndex === totalRows - 1}
            onAlgorithmChange={(algorithm) =>
              onAlgorithmChange(tileIndex, algorithm)
            }
            onToggleConnection={(direction) =>
              onToggleConnection(tileIndex, direction)
            }
          />
        ))}
      </div>
    </div>
  );
}
