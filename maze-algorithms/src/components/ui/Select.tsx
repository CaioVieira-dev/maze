import type { ChangeEvent, SelectHTMLAttributes } from "react";

type SelectRequiredProps = {
  label: string;
  value: string;
  options: { value: string; label: string }[];
};

// Omit 'onChange' porque vamos sobrescrever com a tipagem correta
type SelectProps = SelectRequiredProps &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> & {
    onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
  };

export function Select({
  label,
  value,
  onChange,
  options,
  ...attrs
}: SelectProps) {
  return (
    <div className="flex items-center gap-2">
      <label>{label}</label>
      <select
        {...attrs}
        value={value}
        onChange={onChange}
        className="bg-slate-700 p-2 rounded"
      >
        {options.map((opt, i) => (
          <option key={`${opt.value}-${i}`} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
