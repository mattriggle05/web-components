import React from "react";
import { Box, Slider, Typography } from "@mui/material";
import { BaseFilter, FilterComponent, FilterComponentProps } from "../types";

export interface RangeFilterComponentProps extends FilterComponentProps {
  min: number;
  max: number;
  step?: number;
}

/** An end left at its limit has no filter. */
export const RangeFilter = ({
  id,
  label,
  filters,
  onChange,
  min,
  max,
  step,
}: RangeFilterComponentProps) => {
  const ge = filters.find((f) => f.operator === "ge")?.value;
  const le = filters.find((f) => f.operator === "le")?.value;
  const lo = ge !== undefined && Number.isFinite(Number(ge)) ? Number(ge) : min;
  const hi = le !== undefined && Number.isFinite(Number(le)) ? Number(le) : max;

  const report = (range: number | number[]) => {
    if (!Array.isArray(range)) return;
    const [nextLo, nextHi] = range;
    const next: BaseFilter[] = [];
    if (nextLo !== min) next.push({ operator: "ge", value: String(nextLo) });
    if (nextHi !== max) next.push({ operator: "le", value: String(nextHi) });
    onChange(next);
  };

  return (
    <Box id={id} sx={{ display: "flex", alignItems: "center", gap: 2, px: 1 }}>
      <Slider
        getAriaLabel={(index) =>
          `${label} ${index === 0 ? "minimum" : "maximum"}`
        }
        value={[lo, hi]}
        min={min}
        max={max}
        step={step}
        size="small"
        valueLabelDisplay="auto"
        onChange={(_event, next) => report(next)}
      />
      <Typography
        variant="body2"
        sx={{ whiteSpace: "nowrap", minWidth: 80, textAlign: "right" }}
      >
        {lo} – {hi}
      </Typography>
    </Box>
  );
};

export function rangeFilter({
  min,
  max,
  step,
}: {
  min: number;
  max: number;
  step?: number;
}): FilterComponent {
  const Component = (props: FilterComponentProps) => (
    <RangeFilter {...props} min={min} max={max} step={step} />
  );
  Component.displayName = "RangeFilter";
  return Component;
}
