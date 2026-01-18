import type { RowConfig } from "../hooks/useMazeConfig";
import type { Direction } from "../types/game";
import type { AlgorithmType } from "../types/maze";
import { MazeRowConfig } from "./MazeRowConfig";
import { Button } from "./ui/Button";

interface MazeConfigPanelProps {
  rows: RowConfig[];
  tilesPerRow: number;
  onTilesPerRowChange: (count: number) => void;
  onAddRow: () => void;
  onRemoveRow: (rowIndex: number) => void;
  onAlgorithmChange: (
    rowIndex: number,
    tileIndex: number,
    algorithm: AlgorithmType,
  ) => void;
  onToggleConnection: (
    rowIndex: number,
    tileIndex: number,
    direction: Direction,
  ) => void;
}

export function MazeConfigPanel({
  rows,
  tilesPerRow,
  onTilesPerRowChange,
  onAddRow,
  onRemoveRow,
  onAlgorithmChange,
  onToggleConnection,
}: MazeConfigPanelProps) {
  return (
    <div className="">
      <div className="flex justify-between w-full md:w-1/3">
        <label>
          Labirintos por linha:
          <input
            id="labirintos-por-linha"
            type="number"
            min="1"
            max="10"
            value={tilesPerRow}
            onChange={(e) => onTilesPerRowChange(Number(e.target.value))}
            className="bg-slate-700 p-2 rounded mx-2 text-center"
          />
        </label>
        <Button onClick={onAddRow}>+ Adicionar Linha</Button>
      </div>

      {rows.map((row, rowIndex) => (
        <MazeRowConfig
          key={rowIndex}
          row={row}
          rowIndex={rowIndex}
          tilesPerRow={tilesPerRow}
          totalRows={rows.length}
          onRemove={() => onRemoveRow(rowIndex)}
          onAlgorithmChange={(tileIndex, algorithm) =>
            onAlgorithmChange(rowIndex, tileIndex, algorithm)
          }
          onToggleConnection={(tileIndex, direction) =>
            onToggleConnection(rowIndex, tileIndex, direction)
          }
        />
      ))}
    </div>
  );
}
