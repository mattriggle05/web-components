import React from "react";
import { BaseColumn, TableData } from "../Table/types";

// `not` is left out for now
export const FILTER_OPERATORS = [
  "eq",
  "ne",
  "lt",
  "le",
  "gt",
  "ge",
  "like",
  "ilike",
  "in",
  "is",
] as const;

export type FilterOperator = (typeof FILTER_OPERATORS)[number];

/** Values are strings, as in a URL or API query; components convert the ones they show as numbers or dates. */
export interface BaseFilter {
  operator: FilterOperator;
  value: string;
}

export interface Filter extends BaseFilter {
  id: string;
}

export interface BaseFilterComponentProps {
  filters: readonly BaseFilter[];
  onChange: (filters: BaseFilter[]) => void;
}

export interface FilterComponentProps extends BaseFilterComponentProps {
  id: string;
  label: string;
}

export type FilterComponent = React.FC<FilterComponentProps>;

export interface FilterColumn<R extends TableData> extends BaseColumn<R> {
  FilterComponent: FilterComponent;
}

export interface FilterOption {
  value: string;
  label: string;
}
