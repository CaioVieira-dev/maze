export interface GameState {
  playerPosition: Position;
  startPosition: Position;
  endPosition: Position;
  checkpoints: Position[];
  visitedCheckpoints: Set<number>;
  path: Position[];
  isComplete: boolean;
  isPlaying: boolean;
}

export interface Position {
  row: number;
  col: number;
}

export interface GameConfig {
  numCheckpoints?: number; // Número de pontos de interesse
  playerSize?: number; // Tamanho do jogador em pixels
  playerColor?: string;
  startColor?: string;
  endColor?: string;
  checkpointColor?: string;
  pathColor?: string;
  pathWidth?: number;
}

export type Direction = "up" | "down" | "left" | "right";
