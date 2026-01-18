import { algorithmsData } from "../data/algorithms";
import type { AlgorithmType } from "../types/maze";
import { Select } from "./ui/Select";

interface AlgorithmSelectorProps {
  value: AlgorithmType;
  onChange: (algorithm: AlgorithmType) => void;
}

const options = algorithmsData.map((algorithm) => ({
  label: algorithm.name,
  value: algorithm.id,
}));
export function AlgorithmSelector({ value, onChange }: AlgorithmSelectorProps) {
  return (
    <Select
      label="Algoritmo:"
      options={options}
      value={value}
      onChange={(e) => onChange(e.target.value as AlgorithmType)}
    />
  );
}
