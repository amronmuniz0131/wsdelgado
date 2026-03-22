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
} from "@mui/material";
import { Plus } from "lucide-react";

const initialProjects = [
  {
    id: "1",
    name: "Downtown Commercial Base",
    foreman: "John Smith",
    engineer: "Alice Johnson",
    location: "Sector 4",
    client: "Acme Corp",
    address: "123 Main St, Cityville",
  },
  {
    id: "2",
    name: "Riverside Residential",
    foreman: "Mike Davis",
    engineer: "Bob Wilson",
    location: "Sector 7",
    client: "Riverside Devs",
    address: "456 River Rd, Townsville",
  },
];

export function ProjectsTable() {
  const [projects, setProjects] = useState(initialProjects);
  const [open, setOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    foreman: "",
    engineer: "",
    location: "",
    client: "",
    address: "",
  });

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

  return (
    <Box className="w-full">
      <Box className="flex justify-between items-center mb-4">
        <Typography
          variant="h6"
          component="h2"
          className="text-gray-800 font-semibold"
        >
          Ongoing Projects
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Plus size={18} />}
          onClick={handleOpen}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Add Project
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        className="shadow-sm border border-gray-200"
      >
        <Table sx={{ minWidth: 650 }} aria-label="projects table">
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableCell className="font-semibold text-gray-600">
                Name
              </TableCell>
              <TableCell className="font-semibold text-gray-600">
                Foreman
              </TableCell>
              <TableCell className="font-semibold text-gray-600">
                Engineer
              </TableCell>
              <TableCell className="font-semibold text-gray-600">
                Location
              </TableCell>
              <TableCell className="font-semibold text-gray-600">
                Client
              </TableCell>
              <TableCell className="font-semibold text-gray-600">
                Address
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell component="th" scope="row" className="font-medium">
                  {row.name}
                </TableCell>
                <TableCell>{row.foreman}</TableCell>
                <TableCell>{row.engineer}</TableCell>
                <TableCell>{row.location}</TableCell>
                <TableCell>{row.client}</TableCell>
                <TableCell>{row.address}</TableCell>
              </TableRow>
            ))}
            {projects.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  className="py-8 text-gray-500"
                >
                  No projects found. Click "Add Project" to create one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Project Modal */}
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
