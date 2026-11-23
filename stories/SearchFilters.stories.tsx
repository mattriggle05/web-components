import { Box, Typography } from "@mui/material";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";

import SearchFilters, {
  Filter,
  FilterColumn,
  booleanFilter,
  dateRangeFilter,
  optionsFilter,
  rangeFilter,
  textFilter,
  numberFilter,
} from "../src/SearchFilters";

type Application = {
  status: string;
  role: string;
  active: boolean;
  cpus: number;
  memory: number;
  submitted: string;
  pi: string;
  gid: number;
};

// Built once at module scope, the way a page defines its columns
const columnFilters: FilterColumn<Application>[] = [
  {
    id: "status",
    name: "Status",
    FilterComponent: optionsFilter([
      { value: "PENDING", label: "Pending" },
      { value: "APPROVED", label: "Approved" },
      { value: "DENIED", label: "Denied" },
      { value: "WITHDRAWN", label: "Withdrawn" },
    ]),
  },
  {
    id: "role",
    name: "Role",
    FilterComponent: optionsFilter([
      { value: "pi", label: "PI" },
      { value: "student", label: "Student" },
      { value: "postdoc", label: "Postdoc" },
      { value: "staff", label: "Staff" },
      { value: "faculty", label: "Faculty" },
      { value: "external", label: "External Collaborator" },
    ]),
  },
  {
    id: "active",
    name: "Active",
    FilterComponent: booleanFilter("Active", "Inactive"),
  },
  { id: "submitted", name: "Submitted", FilterComponent: dateRangeFilter() },
  { id: "pi", name: "PI", FilterComponent: textFilter() },
  { id: "gid", name: "GID", FilterComponent: numberFilter() },
  {
    id: "cpus",
    name: "CPUs",
    FilterComponent: rangeFilter({ min: 0, max: 10 }),
  },
  {
    id: "memory",
    name: "Memory (MB)",
    FilterComponent: rangeFilter({ min: 500, max: 1000, step: 50 }),
  },
];

/** SearchFilters is controlled: this holds the value the way ServerTable would, and shows it. */
const ControlledSearchFilters = ({
  initialValue = [],
}: {
  initialValue?: Filter[];
}) => {
  const [value, setValue] = useState<Filter[]>(initialValue);
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <SearchFilters
        columnFilters={columnFilters}
        value={value}
        onChange={setValue}
      />
      <Typography
        component="pre"
        variant="body2"
        sx={{ fontFamily: "monospace" }}
      >
        {JSON.stringify(value, null, 2)}
      </Typography>
    </Box>
  );
};

const meta: Meta<typeof ControlledSearchFilters> = {
  title: "Components/SearchFilters",
  component: ControlledSearchFilters,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithInitialFilters: Story = {
  args: {
    initialValue: [
      { id: "status", operator: "eq", value: "APPROVED" },
      { id: "memory", operator: "ge", value: "600" },
      { id: "memory", operator: "le", value: "900" },
      { id: "submitted", operator: "ge", value: "2026-10-01" },
    ],
  },
};
