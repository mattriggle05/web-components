import React, { useEffect, useRef, useState } from "react";
import { TextField } from "@mui/material";
import { FilterComponent, FilterComponentProps } from "../types";

interface DebouncedTextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** How long typing has to pause before the value changes, in milliseconds. */
  delay?: number;
}

/** A text box that reports once typing pauses, so each keystroke doesn't start a search. */
const DebouncedTextField = ({
  id,
  label,
  value,
  onChange,
  delay = 300,
}: DebouncedTextFieldProps) => {
  const [input, setInput] = useState(value);

  // The timer reads the latest onChange through a ref, so a new callback doesn't restart it
  const latestOnChange = useRef(onChange);
  useEffect(() => {
    latestOnChange.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (input === value) return;
    const timer = setTimeout(() => latestOnChange.current(input), delay);
    return () => clearTimeout(timer);
  }, [input, value, delay]);

  return (
    <TextField
      id={id}
      label={label}
      size="small"
      fullWidth
      value={input}
      onChange={(e) => setInput(e.target.value)}
    />
  );
};

/** Free text the column should contain, as an `ilike` filter. */
export const TextFilter = ({
  id,
  label,
  filters,
  onChange,
}: FilterComponentProps) => {
  return (
    <DebouncedTextField
      id={id}
      label={label}
      value={filters.find((f) => f.operator === "ilike")?.value ?? ""}
      onChange={(text) =>
        onChange(text ? [{ operator: "ilike", value: text }] : [])
      }
    />
  );
};

/** A whole number the column should equal, typed into the same box, as an `eq` filter. */
export const NumberFilter = ({
  id,
  label,
  filters,
  onChange,
}: FilterComponentProps) => {
  return (
    <DebouncedTextField
      id={id}
      label={label}
      value={filters.find((f) => f.operator === "eq")?.value ?? ""}
      // Text that isn't a whole number filters nothing
      onChange={(text) =>
        onChange(/^-?\d+$/.test(text) ? [{ operator: "eq", value: text }] : [])
      }
    />
  );
};

export function textFilter(): FilterComponent {
  const Component = (props: FilterComponentProps) => <TextFilter {...props} />;
  Component.displayName = "TextFilter";
  return Component;
}

export function numberFilter(): FilterComponent {
  const Component = (props: FilterComponentProps) => (
    <NumberFilter {...props} />
  );
  Component.displayName = "NumberFilter";
  return Component;
}
