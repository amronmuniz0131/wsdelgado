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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { Plus } from "lucide-react";

const initialMaterials = [
  {
    id: "1",
    name: "Portland Cement",
    quantity: 500,
    unit: "bags",
    status: "In Stock",
    lastRestocked: "2023-10-15",
  },
  {
    id: "2",
    name: "Steel Rebar (12mm)",
    quantity: 50,
    unit: "tons",
    status: "Low Stock",
    lastRestocked: "2023-10-01",
  },
  {
    id: "3",
    name: "Bricks (Standard)",
    quantity: 0,
    unit: "pallets",
    status: "Out of Stock",
    lastRestocked: "2023-09-20",
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case "In Stock":
      return "success";
    case "Low Stock":
      return "warning";
    case "Out of Stock":
      return "error";
    default:
      return "default";
  }
};

export function MaterialsTable() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewProject({
      name: "",
      foreman: "",
      engineer: "",
      location: "",
      client: "",
      address: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProject = () => {
    const project = {
      id: Math.random().toString(36).substr(2, 9),
      ...newProject,
    };
    setProjects([...projects, project]);
    handleClose();
  };
  const [materials] = useState(initialMaterials);
  const [newProject, setNewProject] = useState({
    name: "",
    foreman: "",
    engineer: "",
    location: "",
    client: "",
    address: "",
  });

  return (
    <Box className="w-full">
      <Box className="mb-4">
        <Typography
          variant="h6"
          component="h2"
          className="text-gray-800 font-semibold"
        >
          Construction Materials Inventory
        </Typography>
      </Box>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Plus size={18} />}
        onClick={handleOpen}
        className="bg-blue-600 hover:bg-blue-700"
      >
        Add Project
      </Button>

      <TableContainer
        component={Paper}
        className="shadow-sm border border-gray-200"
      >
        <Table sx={{ minWidth: 650 }} aria-label="materials table">
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableCell className="font-semibold text-gray-600">
                Item Name
              </TableCell>
              <TableCell className="font-semibold text-gray-600">
                Quantity
              </TableCell>
              <TableCell className="font-semibold text-gray-600">
                Unit
              </TableCell>
              <TableCell className="font-semibold text-gray-600">
                Status
              </TableCell>
              <TableCell className="font-semibold text-gray-600">
                Last Restocked
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {materials.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell component="th" scope="row" className="font-medium">
                  {row.name}
                </TableCell>
                <TableCell>{row.quantity}</TableCell>
                <TableCell>{row.unit}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    color={getStatusColor(row.status)}
                    size="small"
                    className="font-medium"
                  />
                </TableCell>
                <TableCell>{row.lastRestocked}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle className="font-bold text-gray-800 border-b border-gray-100 mb-4">
          Create New Project
        </DialogTitle>
        <DialogContent>
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Project Name"
              type="text"
              fullWidth
              variant="outlined"
              value={newProject.name}
              onChange={handleInputChange}
              className="col-span-1 md:col-span-2"
            />

            <TextField
              margin="dense"
              name="client"
              label="Client"
              type="text"
              fullWidth
              variant="outlined"
              value={newProject.client}
              onChange={handleInputChange}
            />

            <TextField
              margin="dense"
              name="location"
              label="Location"
              type="text"
              fullWidth
              variant="outlined"
              value={newProject.location}
              onChange={handleInputChange}
            />

            <TextField
              margin="dense"
              name="foreman"
              label="Foreman"
              type="text"
              fullWidth
              variant="outlined"
              value={newProject.foreman}
              onChange={handleInputChange}
            />

            <TextField
              margin="dense"
              name="engineer"
              label="Engineer"
              type="text"
              fullWidth
              variant="outlined"
              value={newProject.engineer}
              onChange={handleInputChange}
            />

            <TextField
              margin="dense"
              name="address"
              label="Full Address"
              type="text"
              fullWidth
              variant="outlined"
              value={newProject.address}
              onChange={handleInputChange}
              className="col-span-1 md:col-span-2"
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions className="p-4 border-t border-gray-100">
          <Button
            onClick={handleClose}
            color="inherit"
            className="text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddProject}
            variant="contained"
            color="primary"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={!newProject.name || !newProject.client}
          >
            Create Project
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
