import type { MazeGrid } from "./maze";
import type { Position } from "./game";

export interface Exit {
  direction: "right" | "left" | "up" | "down";
  neighborTileId: string;
  localPosition: Position;
  neighborPosition: Position;
}

export interface MazeTile {
  id: string;
  grid: MazeGrid;
  exits: Exit[];
}
