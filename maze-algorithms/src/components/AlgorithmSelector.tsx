import type { AlgorithmType } from "../types/maze";

interface AlgorithmSelectorProps {
  value: AlgorithmType;
  onChange: (algorithm: AlgorithmType) => void;
}

export function AlgorithmSelector({ value, onChange }: AlgorithmSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <label>Algoritmo:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as AlgorithmType)}
        className="bg-slate-700 p-2 rounded"
      >
        <option className="text-black" value="binary-tree">
          Binary Tree
        </option>
        <option className="text-black" value="recursive-backtracker">
          Recursive Backtracker
        </option>
      </select>
    </div>
  );
}
