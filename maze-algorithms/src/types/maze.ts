import type { MazeTile } from "./tiles";

// Representa uma célula individual do labirinto
export interface Cell {
  row: number;
  col: number;
  walls: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  visited: boolean;
}

// Representa o grid completo do labirinto
export type MazeGrid = Cell[][];

// Configuração para gerar um labirinto
export interface MazeConfig {
  rows: number;
  cols: number;
  algorithm: AlgorithmType;
}

// Tipos de algoritmos disponíveis
export type AlgorithmType =
  | "binary-tree"
  | "recursive-backtracker"
  | "prim"
  | "kruskal"
  | "eller"
  | "wilson"
  | "aldous-broder"
  | "growing-tree"
  | "hunt-and-kill"
  | "recursive-division"
  | "sidewinder";

// Informações sobre cada algoritmo para exibição
export interface AlgorithmInfo {
  id: AlgorithmType;
  name: string;
  description: string;
  complexity: {
    time: string;
    space: string;
  };
  characteristics: string[];
}

export type MazeLayout = (MazeTile | null)[][];
