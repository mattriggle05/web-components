import React, { useId, useRef, useState } from "react";
import {
  Box,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import { TableData } from "../Table/types";
import { BaseFilter, Filter, FilterColumn } from "./types";

export const DEFAULT_FILTER_ROW_HEIGHT = 56;

export interface SearchFiltersProps<R extends TableData> {
  /** Columns that can be chosen in a row's dropdown. */
  columnFilters: FilterColumn<R>[];
  /** Every filter for the table. Filters for columns without a row are kept as they are. */
  value: readonly Filter[];
  onChange: (next: Filter[]) => void;
  rowHeight?: number;
  sx?: SxProps<Theme>;
}

interface FilterRow {
  key: number;
  columnId?: string;
}

const SearchFilters = <R extends TableData>({
  columnFilters,
  value,
  onChange,
  rowHeight = DEFAULT_FILTER_ROW_HEIGHT,
  sx,
}: SearchFiltersProps<R>) => {
  const baseId = useId();
  const nextKey = useRef(0);
  const newRow = (columnId?: string): FilterRow => ({
    key: nextKey.current++,
    columnId,
  });

  // Rows hold order and not-yet-chosen rows, which the filter list can't; filters themselves stay in `value`
  const [rows, setRows] = useState<FilterRow[]>(() =>
    [...new Set(value.map((f) => f.id))]
      .filter((id) => columnFilters.some((c) => c.id === id))
      .map((id) => newRow(id)),
  );

  const without = (columnId: string | undefined): Filter[] =>
    value.filter((f) => f.id !== columnId);

  /** The column's filters without their id, for its component. */
  const filtersOf = (columnId: string): BaseFilter[] =>
    value
      .filter((f) => f.id === columnId)
      .map(({ operator, value }) => ({ operator, value }));

  const chooseColumn = (row: FilterRow, columnId: string) => {
    setRows((current) =>
      current.map((r) => (r.key === row.key ? { ...r, columnId } : r)),
    );
    // The old column's value doesn't apply to the new one
    if (row.columnId !== columnId) onChange(without(row.columnId));
  };

  const removeRow = (row: FilterRow) => {
    setRows((current) => current.filter((r) => r.key !== row.key));
    onChange(without(row.columnId));
  };

  /** Replaces exactly this column's filters and leaves the rest of the list alone. */
  const setColumnFilters = (columnId: string, next: BaseFilter[]) => {
    onChange([
      ...without(columnId),
      ...next.map((f) => ({ ...f, id: columnId })),
    ]);
  };

  const rowSx = {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    height: rowHeight,
    px: 1.5,
    borderBottom: 1,
    borderColor: "divider",
    "&:last-child": { borderBottom: 0 },
  };

  return (
    <Box
      sx={[
        { minWidth: 560, border: 1, borderColor: "divider", borderRadius: 1 },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {rows.map((row) => {
        const column = columnFilters.find((c) => c.id === row.columnId);
        const inputId = `${baseId}-${row.key}`;
        return (
          <Box key={row.key} sx={rowSx}>
            <FormControl size="small" sx={{ width: 200, flexShrink: 0 }}>
              <Select
                value={row.columnId ?? ""}
                displayEmpty
                inputProps={{ "aria-label": "Filter column" }}
                renderValue={(selected) =>
                  selected ? (
                    columnFilters.find((c) => c.id === selected)?.name
                  ) : (
                    <Typography component="span" color="text.secondary">
                      Select a column
                    </Typography>
                  )
                }
                onChange={(e) => chooseColumn(row, e.target.value)}
              >
                {columnFilters.map((c) => (
                  <MenuItem
                    key={c.id}
                    value={c.id}
                    // A column can only be filtered by one row
                    disabled={
                      c.id !== row.columnId &&
                      rows.some((r) => r.columnId === c.id)
                    }
                  >
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {column && (
                <column.FilterComponent
                  id={inputId}
                  label={column.name}
                  filters={filtersOf(column.id)}
                  onChange={(next) => setColumnFilters(column.id, next)}
                />
              )}
            </Box>
            <IconButton
              size="small"
              aria-label="Remove filter"
              onClick={() => removeRow(row)}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
        );
      })}
      {/* Every column already has a row, so there is nothing left to add */}
      {rows.length < columnFilters.length && (
        <Box sx={rowSx}>
          <IconButton
            aria-label="Add filter"
            onClick={() => setRows((current) => [...current, newRow()])}
          >
            <Add />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default SearchFilters;
