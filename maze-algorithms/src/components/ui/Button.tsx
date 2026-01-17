import type React from "react";
import type { HTMLAttributes } from "react";

type ButtonRequiredProps =
  | { label: string; children?: React.ReactNode }
  | { label?: string; children: React.ReactNode };
type ButtonOptionalProps = {
  bgColor?: "blue" | "purple";
};
type ButtonProps = ButtonRequiredProps &
  ButtonOptionalProps &
  HTMLAttributes<HTMLButtonElement>;

export function Button({
  label,
  children,
  bgColor = "blue",
  ...attrs
}: ButtonProps) {
  return (
    <button
      {...attrs}
      className={`px-4 py-2 bg-${bgColor}-600 hover:bg-${bgColor}-700 text-white font-medium rounded-md transition-colors`}
    >
      {label ?? children}
    </button>
  );
}
