import React, { useEffect, useRef, useState } from "react";
import { TextField } from "@mui/material";
import { FilterComponent, FilterComponentProps } from "../types";

interface DebouncedTextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

/** Reports once typing pauses, so each keystroke doesn't start a search. */
const DebouncedTextField = ({
  id,
  label,
  value,
  onChange,
}: DebouncedTextFieldProps) => {
  const [input, setInput] = useState(value);

  // Read through a ref so a new callback doesn't restart the timer
  const latestOnChange = useRef(onChange);
  useEffect(() => {
    latestOnChange.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (input === value) return;
    const timer = setTimeout(() => latestOnChange.current(input), 300);
    return () => clearTimeout(timer);
  }, [input, value]);

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

export const TextFilter = ({
  id,
  label,
  filters,
  onChange,
}: FilterComponentProps) => (
  <DebouncedTextField
    id={id}
    label={label}
    value={filters.find((f) => f.operator === "ilike")?.value ?? ""}
    onChange={(text) =>
      onChange(text ? [{ operator: "ilike", value: text }] : [])
    }
  />
);

/** Text that isn't a whole number filters nothing. */
export const NumberFilter = ({
  id,
  label,
  filters,
  onChange,
}: FilterComponentProps) => (
  <DebouncedTextField
    id={id}
    label={label}
    value={filters.find((f) => f.operator === "eq")?.value ?? ""}
    onChange={(text) =>
      onChange(/^-?\d+$/.test(text) ? [{ operator: "eq", value: text }] : [])
    }
  />
);

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
