import { useState } from "react";

export type Algorithm = "binary-tree" | "recursive-backtracker";
export type Direction = "right" | "down" | "left" | "up";

export interface TileConfig {
  id: string;
  algorithm: Algorithm;
  connections: {
    direction: Direction;
    targetId: string;
  }[];
}

export interface RowConfig {
  tiles: TileConfig[];
}

export function useMazeConfig(initialTilesPerRow = 2) {
  const [rows, setRows] = useState<RowConfig[]>([
    {
      tiles: [
        { id: "A", algorithm: "binary-tree", connections: [] },
        { id: "B", algorithm: "recursive-backtracker", connections: [] },
      ],
    },
  ]);
  const [tilesPerRow, setTilesPerRow] = useState(initialTilesPerRow);

  const onAddRow = () => {
    const newRowIndex = rows.length;
    const newTiles: TileConfig[] = [];

    for (let i = 0; i < tilesPerRow; i++) {
      const id = String.fromCharCode(65 + newRowIndex * tilesPerRow + i);
      newTiles.push({
        id,
        algorithm: "recursive-backtracker",
        connections: [],
      });
    }

    setRows([...rows, { tiles: newTiles }]);
  };

  const onRemoveRow = (rowIndex: number) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, index) => index !== rowIndex));
    }
  };

  const onAlgorithmChange = (
    rowIndex: number,
    tileIndex: number,
    algorithm: Algorithm
  ) => {
    const newRows = [...rows];
    newRows[rowIndex].tiles[tileIndex].algorithm = algorithm;
    setRows(newRows);
  };

  const onTilesPerRowChange = (count: number) => {
    if (count < 1 || count > 10) return;

    setTilesPerRow(count);
    const newRows = rows.map((row, rowIndex) => {
      const currentTiles = row.tiles.length;
      const tiles = [...row.tiles];

      if (count > currentTiles) {
        for (let i = currentTiles; i < count; i++) {
          const id = String.fromCharCode(65 + rowIndex * count + i);
          tiles.push({
            id,
            algorithm: "recursive-backtracker",
            connections: [],
          });
        }
      } else {
        tiles.splice(count);
      }

      return { tiles };
    });

    setRows(newRows);
  };

  const onToggleConnection = (
    rowIndex: number,
    tileIndex: number,
    direction: Direction
  ) => {
    const newRows = rows.map((row, rIdx) => {
      if (rIdx !== rowIndex) return row;

      return {
        ...row,
        tiles: row.tiles.map((tile, tIdx) => {
          if (tIdx !== tileIndex) return tile;

          const existingIndex = tile.connections.findIndex(
            (conn) => conn.direction === direction
          );

          let newConnections: typeof tile.connections;

          if (existingIndex >= 0) {
            // Remove conexão
            newConnections = tile.connections.filter(
              (_, idx) => idx !== existingIndex
            );
          } else {
            // Adiciona conexão
            let targetId = "";

            if (direction === "right" && tileIndex < tilesPerRow - 1) {
              targetId = row.tiles[tileIndex + 1].id;
            } else if (direction === "down" && rowIndex < rows.length - 1) {
              targetId = rows[rowIndex + 1].tiles[tileIndex]?.id || "";
            }

            if (targetId) {
              newConnections = [...tile.connections, { direction, targetId }];
            } else {
              newConnections = tile.connections;
            }
          }

          return {
            ...tile,
            connections: newConnections,
          };
        }),
      };
    });

    setRows(newRows);
  };

  return {
    rows,
    tilesPerRow,
    onAddRow,
    onRemoveRow,
    onAlgorithmChange,
    onTilesPerRowChange,
    onToggleConnection,
  };
}
