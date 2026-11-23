import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { FilterComponent, FilterComponentProps, FilterOption } from "../types";

export interface OptionsFilterComponentProps extends FilterComponentProps {
  options: FilterOption[];
}

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
      {/* Keeps the label raised over the empty "All" value */}
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

// A new component per call: call factories at module scope or in a memo, not in a render
export function optionsFilter(options: FilterOption[]): FilterComponent {
  const Component = (props: FilterComponentProps) => (
    <OptionsFilter {...props} options={options} />
  );
  Component.displayName = "OptionsFilter";
  return Component;
}
