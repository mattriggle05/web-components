import React from "react";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { FilterComponent, FilterComponentProps } from "../types";

export interface BooleanFilterComponentProps extends FilterComponentProps {
  trueLabel: string;
  falseLabel: string;
}

export const BooleanFilter = ({
  id,
  label,
  filters,
  onChange,
  trueLabel,
  falseLabel,
}: BooleanFilterComponentProps) => {
  const is = filters.find((f) => f.operator === "is")?.value;
  const value = is === "true" || is === "false" ? is : "";
  return (
    <RadioGroup
      id={id}
      aria-label={label}
      row
      value={value}
      onChange={(e) =>
        onChange(
          e.target.value ? [{ operator: "is", value: e.target.value }] : [],
        )
      }
    >
      <FormControlLabel value="" control={<Radio size="small" />} label="All" />
      <FormControlLabel
        value="true"
        control={<Radio size="small" />}
        label={trueLabel}
      />
      <FormControlLabel
        value="false"
        control={<Radio size="small" />}
        label={falseLabel}
      />
    </RadioGroup>
  );
};

export function booleanFilter(
  trueLabel = "Yes",
  falseLabel = "No",
): FilterComponent {
  const Component = (props: FilterComponentProps) => (
    <BooleanFilter {...props} trueLabel={trueLabel} falseLabel={falseLabel} />
  );
  Component.displayName = "BooleanFilter";
  return Component;
}
