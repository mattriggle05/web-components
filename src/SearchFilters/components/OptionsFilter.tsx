import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { FilterComponent, FilterComponentProps, FilterOption } from "../types";

export interface OptionsFilterComponentProps extends FilterComponentProps {
  options: FilterOption[];
}

/** A single choice from a fixed list, as an `eq` filter. */
export const OptionsFilter = ({
  id,
  label,
  filters,
  onChange,
  options,
}: OptionsFilterComponentProps) => {
  const value = filters.find((f) => f.operator === "eq")?.value ?? "";
  return (
    <FormControl size="small" fullWidth>
      {/* "All" is an empty value, so the label stays raised above it */}
      <InputLabel id={id} shrink>
        {label}
      </InputLabel>
      <Select
        labelId={id}
        label={label}
        displayEmpty
        notched
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value ? [{ operator: "eq", value: e.target.value }] : [],
          )
        }
      >
        <MenuItem value="">All</MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

// Each call creates a new component, and React remounts a filter whose component changes.
// Call factories where columns are defined (module scope or a memo), not in a render.

export function optionsFilter(options: FilterOption[]): FilterComponent {
  const Component = (props: FilterComponentProps) => (
    <OptionsFilter {...props} options={options} />
  );
  Component.displayName = "OptionsFilter";
  return Component;
}
