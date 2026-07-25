import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

interface Props {
  value: number;
  onChange: (value: number) => void;
  label: string;
  step?: number;
  disabled?: boolean;
  suffix?: string;
}

/**
 * Keeps its own text state while focused so half-typed values like "3." or "-"
 * survive long enough to finish typing.
 */
const NumberField = ({
  value,
  onChange,
  label,
  step,
  disabled,
  suffix,
}: Props) => {
  const [text, setText] = useState(String(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setText(String(value));
  }, [value, focused]);

  return (
    <div className="relative">
      <Input
        type="text"
        inputMode="decimal"
        aria-label={label}
        value={text}
        step={step}
        disabled={disabled}
        className={`h-10 tabular-nums ${suffix ? "pr-7" : ""}`}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          const parsed = Number(text);
          const next = Number.isFinite(parsed) ? parsed : value;
          onChange(next);
          setText(String(next));
        }}
        onChange={(event) => {
          const raw = event.target.value;
          setText(raw);
          const parsed = Number(raw);
          if (raw.trim() !== "" && Number.isFinite(parsed)) onChange(parsed);
        }}
      />
      {suffix ? (
        <span className="text-muted-foreground pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs">
          {suffix}
        </span>
      ) : null}
    </div>
  );
};

export default NumberField;
