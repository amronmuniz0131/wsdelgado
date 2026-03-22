"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
} from "@mui/material";

const initialEquipments = [
  {
    id: "1",
    name: "Excavator CAT 320",
    type: "Heavy Machinery",
    status: "In Use",
    currentLocation: "Sector 4",
    operator: "Tom Harris",
  },
  {
    id: "2",
    name: "Bulldozer D8T",
    type: "Heavy Machinery",
    status: "Available",
    currentLocation: "Equipment Yard A",
    operator: "Unassigned",
  },
  {
    id: "3",
    name: "Crane Tower TG-20",
    type: "Lifting Equipment",
    status: "Maintenance",
    currentLocation: "Repair Shop",
    operator: "N/A",
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case "Available":
      return "success";
    case "In Use":
      return "primary";
    case "Maintenance":
      return "error";
    default:
      return "default";
  }
};

export function EquipmentsTable() {
  const [equipments] = useState(initialEquipments);

  return (
    <Box className="w-full">
      <Box className="mb-4">
        <Typography
          variant="h6"
          component="h2"
          className="text-gray-800 font-semibold"
        >
          Construction Equipments
        </Typography>
      </Box>

      <TableContainer
        component={Paper}
        className="shadow-sm border border-gray-200"
      >
        <Table sx={{ minWidth: 650 }} aria-label="equipments table">
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableCell className="font-semibold text-gray-600">
                Equipment Name
              </TableCell>
              <TableCell className="font-semibold text-gray-600">
                Type
              </TableCell>
              <TableCell className="font-semibold text-gray-600">
                Status
              </TableCell>
              <TableCell className="font-semibold text-gray-600">
                Current Location
              </TableCell>
              <TableCell className="font-semibold text-gray-600">
                Operator
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {equipments.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell component="th" scope="row" className="font-medium">
                  {row.name}
                </TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    color={getStatusColor(row.status)}
                    size="small"
                    className="font-medium"
                  />
                </TableCell>
                <TableCell>{row.currentLocation}</TableCell>
                <TableCell>{row.operator}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
