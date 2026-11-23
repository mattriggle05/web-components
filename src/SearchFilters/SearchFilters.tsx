import React, { useId, useRef, useState } from "react";
import {
  Box,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Theme,
  Typography,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import { TableData } from "../Table/types";
import { BaseFilter, Filter, FilterColumn } from "./types";

export interface SearchFiltersProps<R extends TableData> {
  columnFilters: FilterColumn<R>[];
  /** Filters for columns without a row are kept as they are. */
  value: readonly Filter[];
  onChange: (next: Filter[]) => void;
}

interface FilterRow {
  key: number;
  columnId?: string;
}

const rowSx = {
  display: "flex",
  alignItems: "center",
  gap: 1.5,
  // A small field is 5 spacing units; the rest is room for its raised label
  height: (theme: Theme) => theme.spacing(7.5),
  px: 1.5,
  borderBottom: 1,
  borderColor: "divider",
  "&:last-child": { borderBottom: 0 },
};

const SearchFilters = <R extends TableData>({
  columnFilters,
  value,
  onChange,
}: SearchFiltersProps<R>) => {
  const baseId = useId();
  const nextKey = useRef(0);
  const newRow = (columnId?: string): FilterRow => ({
    key: nextKey.current++,
    columnId,
  });

  // Rows hold order and unchosen rows; the filters themselves stay in `value`
  const [rows, setRows] = useState<FilterRow[]>(() =>
    [...new Set(value.map((f) => f.id))]
      .filter((id) => columnFilters.some((c) => c.id === id))
      .map((id) => newRow(id)),
  );

  const without = (columnId: string): Filter[] =>
    value.filter((f) => f.id !== columnId);

  const chooseColumn = (row: FilterRow, columnId: string) => {
    setRows((current) =>
      current.map((r) => (r.key === row.key ? { ...r, columnId } : r)),
    );
    if (row.columnId !== undefined && row.columnId !== columnId)
      onChange(without(row.columnId));
  };

  const removeRow = (row: FilterRow) => {
    setRows((current) => current.filter((r) => r.key !== row.key));
    if (row.columnId !== undefined) onChange(without(row.columnId));
  };

  const setColumnFilters = (columnId: string, next: BaseFilter[]) => {
    onChange([
      ...without(columnId),
      ...next.map((f) => ({ ...f, id: columnId })),
    ]);
  };

  return (
    <Box sx={{ minWidth: 560, typography: "body1" }}>
      {rows.map((row) => {
        const column = columnFilters.find((c) => c.id === row.columnId);
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
                  id={`${baseId}-${row.key}`}
                  label={column.name}
                  filters={value.filter((f) => f.id === column.id)}
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
