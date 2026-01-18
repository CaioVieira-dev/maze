import { useState } from "react";
import type { AlgorithmType } from "../types/maze";
import type { Direction } from "../types/game";
import { getRandomGeneratorId } from "../utils/tileFactory";

export interface TileConfig {
  id: string;
  algorithm: AlgorithmType;
  connections: {
    direction: Direction;
    targetId: string;
  }[];
}

export interface RowConfig {
  tiles: TileConfig[];
}

// Função auxiliar para criar conexões automáticas
function createAutoConnectedTile(
  id: string,
  rowIndex: number,
  tileIndex: number,
  tilesPerRow: number,
  existingRows: RowConfig[],
): TileConfig {
  const connections: TileConfig["connections"] = [];

  // Conectar à esquerda (se não for o primeiro da linha)
  if (tileIndex > 0) {
    const leftId = String.fromCharCode(
      65 + rowIndex * tilesPerRow + tileIndex - 1,
    );
    connections.push({ direction: "left", targetId: leftId });
  }

  // Conectar à direita (se não for o último da linha)
  if (tileIndex < tilesPerRow - 1) {
    const rightId = String.fromCharCode(
      65 + rowIndex * tilesPerRow + tileIndex + 1,
    );
    connections.push({ direction: "right", targetId: rightId });
  }

  // Conectar para cima (se não for a primeira linha)
  if (rowIndex > 0 && existingRows[rowIndex - 1]?.tiles[tileIndex]) {
    const upId = existingRows[rowIndex - 1].tiles[tileIndex].id;
    connections.push({ direction: "up", targetId: upId });
  }

  // Conectar para baixo (se já existir linha abaixo)
  if (
    rowIndex < existingRows.length &&
    existingRows[rowIndex]?.tiles[tileIndex]
  ) {
    const downId = existingRows[rowIndex].tiles[tileIndex].id;
    connections.push({ direction: "down", targetId: downId });
  }

  return {
    id,
    algorithm: getRandomGeneratorId(),
    connections,
  };
}

// Função para adicionar conexão "up" aos tiles da linha anterior
function addUpConnectionsToPreviousRow(
  rows: RowConfig[],
  newRowIndex: number,
  newRowTiles: TileConfig[],
): RowConfig[] {
  if (newRowIndex === 0) return rows;

  return rows.map((row, rIdx) => {
    if (rIdx !== newRowIndex - 1) return row;

    return {
      ...row,
      tiles: row.tiles.map((tile, tIdx) => {
        // Adiciona conexão "down" para o tile correspondente na nova linha
        const newTile = newRowTiles[tIdx];
        if (!newTile) return tile;

        const hasDownConnection = tile.connections.some(
          (conn) => conn.direction === "down" && conn.targetId === newTile.id,
        );

        if (hasDownConnection) return tile;

        return {
          ...tile,
          connections: [
            ...tile.connections,
            { direction: "down", targetId: newTile.id },
          ],
        };
      }),
    };
  });
}

export function useMazeConfig(initialTilesPerRow = 2) {
  const [rows, setRows] = useState<RowConfig[]>([
    {
      tiles: [
        {
          id: "A",
          algorithm: getRandomGeneratorId(),
          connections: [{ direction: "right", targetId: "B" }],
        },
        {
          id: "B",
          algorithm: getRandomGeneratorId(),
          connections: [{ direction: "left", targetId: "A" }],
        },
      ],
    },
  ]);
  const [tilesPerRow, setTilesPerRow] = useState(initialTilesPerRow);

  const onAddRow = () => {
    const newRowIndex = rows.length;
    const newTiles: TileConfig[] = [];

    // Criar novos tiles com conexões automáticas
    for (let i = 0; i < tilesPerRow; i++) {
      const nextIdIndex = 65 + newRowIndex * tilesPerRow + i;
      const id = String.fromCharCode(nextIdIndex);

      const tile = createAutoConnectedTile(
        id,
        newRowIndex,
        i,
        tilesPerRow,
        rows,
      );
      newTiles.push(tile);
    }

    // Adicionar conexões "down" na linha anterior
    const updatedRows = addUpConnectionsToPreviousRow(
      rows,
      newRowIndex,
      newTiles,
    );

    setRows([...updatedRows, { tiles: newTiles }]);
  };

  const onRemoveRow = (rowIndex: number) => {
    if (rows.length <= 1) return;

    setRows((prevRows) => {
      const newRows = prevRows.filter((_, index) => index !== rowIndex);

      // Remover conexões "down" da linha anterior que apontam para a linha removida
      return newRows.map((row, rIdx) => {
        if (rIdx !== rowIndex - 1) return row;

        return {
          ...row,
          tiles: row.tiles.map((tile) => ({
            ...tile,
            connections: tile.connections.filter(
              (conn) => conn.direction !== "down",
            ),
          })),
        };
      });
    });
  };

  const onAlgorithmChange = (
    rowIndex: number,
    tileIndex: number,
    algorithm: AlgorithmType,
  ) => {
    setRows((prevRows) => {
      const newRows = [...prevRows];
      newRows[rowIndex] = {
        ...newRows[rowIndex],
        tiles: [...newRows[rowIndex].tiles],
      };
      newRows[rowIndex].tiles[tileIndex] = {
        ...newRows[rowIndex].tiles[tileIndex],
        algorithm,
      };
      return newRows;
    });
  };

  const onTilesPerRowChange = (count: number) => {
    if (count < 1 || count > 10) return;

    setTilesPerRow(count);

    setRows((prevRows) => {
      return prevRows.map((row, rowIndex) => {
        const currentTiles = row.tiles.length;
        const tiles = [...row.tiles];

        if (count > currentTiles) {
          // Adicionar novos tiles
          for (let i = currentTiles; i < count; i++) {
            const nextIdIndex = 65 + rowIndex * count + i;
            const id = String.fromCharCode(nextIdIndex);

            const newTile = createAutoConnectedTile(
              id,
              rowIndex,
              i,
              count,
              prevRows,
            );
            tiles.push(newTile);
          }

          // Atualizar conexões "right" do último tile antigo
          if (currentTiles > 0) {
            tiles[currentTiles - 1] = {
              ...tiles[currentTiles - 1],
              connections: [
                ...tiles[currentTiles - 1].connections,
                { direction: "right", targetId: tiles[currentTiles].id },
              ],
            };
          }
        } else {
          // Remover tiles excedentes
          tiles.splice(count);

          // Remover conexão "right" do último tile restante
          if (tiles.length > 0) {
            tiles[tiles.length - 1] = {
              ...tiles[tiles.length - 1],
              connections: tiles[tiles.length - 1].connections.filter(
                (conn) => conn.direction !== "right",
              ),
            };
          }
        }

        return { tiles };
      });
    });
  };

  const onToggleConnection = (
    rowIndex: number,
    tileIndex: number,
    direction: Direction,
  ) => {
    setRows((prevRows) => {
      return prevRows.map((row, rIdx) => {
        if (rIdx !== rowIndex) return row;

        return {
          ...row,
          tiles: row.tiles.map((tile, tIdx) => {
            if (tIdx !== tileIndex) return tile;

            const existingIndex = tile.connections.findIndex(
              (conn) => conn.direction === direction,
            );

            let newConnections: typeof tile.connections;

            if (existingIndex >= 0) {
              // Remove conexão
              newConnections = tile.connections.filter(
                (_, idx) => idx !== existingIndex,
              );
            } else {
              // Adiciona conexão
              let targetId = "";

              if (direction === "right" && tileIndex < tilesPerRow - 1) {
                targetId = row.tiles[tileIndex + 1].id;
              } else if (direction === "left" && tileIndex > 0) {
                targetId = row.tiles[tileIndex - 1].id;
              } else if (
                direction === "down" &&
                rowIndex < prevRows.length - 1
              ) {
                targetId = prevRows[rowIndex + 1].tiles[tileIndex]?.id || "";
              } else if (direction === "up" && rowIndex > 0) {
                targetId = prevRows[rowIndex - 1].tiles[tileIndex]?.id || "";
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
    });
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
