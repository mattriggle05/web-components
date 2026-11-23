import React from "react";
import { Box, TextField } from "@mui/material";
import { BaseFilter, FilterComponent, FilterComponentProps } from "../types";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const addDays = (date: string, days: number) => {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

/** Both ends are inclusive, so To is stored as `lt` the day after it. */
export const DateRangeFilter = ({
  id,
  label,
  filters,
  onChange,
}: FilterComponentProps) => {
  const ge = filters.find((f) => f.operator === "ge")?.value;
  const lt = filters.find((f) => f.operator === "lt")?.value;
  const from = ge !== undefined && ISO_DATE.test(ge) ? ge : "";
  const before = lt !== undefined && ISO_DATE.test(lt) ? lt : undefined;
  const to = before ? addDays(before, -1) : "";

  const report = (nextFrom: string, nextTo: string) => {
    const next: BaseFilter[] = [];
    if (nextFrom) next.push({ operator: "ge", value: nextFrom });
    if (nextTo) next.push({ operator: "lt", value: addDays(nextTo, 1) });
    onChange(next);
  };

  return (
    <Box id={id} sx={{ display: "flex", gap: 1 }}>
      <TextField
        type="date"
        size="small"
        label={`${label} from`}
        value={from}
        onChange={(e) => report(e.target.value, to)}
        slotProps={{
          inputLabel: { shrink: true },
          htmlInput: { max: to || undefined },
        }}
        fullWidth
      />
      <TextField
        type="date"
        size="small"
        label="to"
        value={to}
        onChange={(e) => report(from, e.target.value)}
        slotProps={{
          inputLabel: { shrink: true },
          htmlInput: { min: from || undefined },
        }}
        fullWidth
      />
    </Box>
  );
};

export function dateRangeFilter(): FilterComponent {
  const Component = (props: FilterComponentProps) => (
    <DateRangeFilter {...props} />
  );
  Component.displayName = "DateRangeFilter";
  return Component;
}
