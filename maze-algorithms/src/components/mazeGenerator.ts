import type { RowConfig } from "../hooks/useMazeConfig";
import { mergeTileLayout } from "../utils/gridMerger";
import { connectTiles, createTile } from "../utils/tileFactory";

// Tipo para representar um tile criado (ajuste conforme sua implementação real)
type Tile = ReturnType<typeof createTile>;

// Tipo para uma célula do layout que pode ser um Tile ou null
type LayoutCell = Tile | null;

// Tipo para uma linha do layout
type LayoutRow = LayoutCell[];

// Tipo para o layout completo
type MazeLayout = LayoutRow[];

export function generateMazeFromConfig(rows: RowConfig[], tilesPerRow: number) {
  const tileMap = new Map<string, Tile>();
  const layout: MazeLayout = [];

  // Cria todos os tiles e popula o mapa
  rows.forEach((row) => {
    const layoutRow: LayoutRow = [];

    row.tiles.forEach((tileConfig) => {
      const tile = createTile(tileConfig.id, tileConfig.algorithm);
      tileMap.set(tileConfig.id, tile);
      layoutRow.push(tile);
    });

    // Preenche o restante da linha com null
    while (layoutRow.length < tilesPerRow) {
      layoutRow.push(null);
    }

    layout.push(layoutRow);
  });

  // Conecta os tiles conforme configuração
  rows.forEach((row) => {
    row.tiles.forEach((tileConfig) => {
      const sourceTile = tileMap.get(tileConfig.id);

      tileConfig.connections.forEach((conn) => {
        const targetTile = tileMap.get(conn.targetId);
        if (sourceTile && targetTile) {
          connectTiles(sourceTile, targetTile, conn.direction);
        }
      });
    });
  });

  return mergeTileLayout(layout);
}
