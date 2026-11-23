import React from "react";
import { BaseColumn, TableData } from "../Table/types";

/** The API's operators, used because they are a good representative set. `not` is left out for now. */
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

/**
 * One condition with no field attached. Components use it, since they don't know their column.
 * Values are strings, as they are in a URL or an API query; a component converts the ones it shows as numbers or dates.
 */
export interface BaseFilter {
  operator: FilterOperator;
  value: string;
}

/** A condition on a column. */
export interface Filter extends BaseFilter {
  id: string;
}

/** What every filter component gets: its filters and a way to report a new list (more, fewer or none). */
export interface BaseFilterComponentProps {
  filters: readonly BaseFilter[];
  onChange: (filters: BaseFilter[]) => void;
}

/** Shared by every filter component SearchFilters renders. */
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
