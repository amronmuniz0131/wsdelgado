"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { DataGrid, getGridStringOperators } from "@mui/x-data-grid";
import { Plus } from "lucide-react";

const initialProjects = [
  {
    id: "1",
    name: "Downtown Commercial Base",
    foreman: "John Smith",
    engineer: "Alice Johnson",
    location: "Bacoor",
    client: "Acme Corp",
    address: "123 Main St, Cityville",
    progress: 50,
  },
  {
    id: "2",
    name: "Riverside Residential",
    foreman: "Mike Davis",
    engineer: "Test Watson",
    location: "Sector 7",
    client: "Riverside Devs",
    address: "456 River Rd, Townsville",
    progress: Math.floor(Math.random() * 100),
  },
  {
    id: "3",
    name: "Dionela",
    foreman: "Test Foreman",
    engineer: "Test Engineer",
    location: "Imus",
    client: "Riverside Devs",
    address: "456 River Rd, Townsville",
    progress: Math.floor(Math.random() * 100),
  },
  {
    id: "4",
    name: "Atillano",
    foreman: "Mike Jords",
    engineer: "Bob the builder",
    location: "Dasmarinas",
    client: "Riverside Devs",
    address: "456 River Rd, Townsville",
    progress: Math.floor(Math.random() * 100),
  },
  {
    id: "5",
    name: "Baldicano Residential",
    foreman: "Trial Foreman",
    engineer: "Train Wreck",
    location: "Sector 27",
    client: "Riverside Devs",
    address: "456 River Rd, Townsville",
    progress: Math.floor(Math.random() * 100),
  },
  {
    id: "6",
    name: "Riverside Residential",
    foreman: "Mike Davis",
    engineer: "Bob Wilson",
    location: "Sector 457",
    client: "Riverside Devs",
    address: "456 River Rd, Townsville",
    progress: Math.floor(Math.random() * 100),
  },
];

export function ProjectsTable(props) {
  const router = useRouter();
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

  const filteredOperators = getGridStringOperators().filter((operator) =>
    ["contains", "startsWith", "equals"].includes(operator.value)
  );

  const columns = [
    { 
      field: "name", 
      headerName: "Name", 
      flex: 1, 
      minWidth: 180,
      filterOperators: filteredOperators
    },
    { 
      field: "foreman", 
      headerName: "Foreman", 
      flex: 1, 
      minWidth: 130,
      filterOperators: filteredOperators
    },
    { 
      field: "engineer", 
      headerName: "Engineer", 
      flex: 1, 
      minWidth: 130,
      filterOperators: filteredOperators
    },
    { 
      field: "location", 
      headerName: "Location", 
      flex: 1, 
      minWidth: 120,
      filterOperators: filteredOperators
    },
    { 
      field: "client", 
      headerName: "Client", 
      flex: 1, 
      minWidth: 150,
      filterOperators: filteredOperators
    },
    { 
      field: "address", 
      headerName: "Address", 
      flex: 1.5, 
      minWidth: 200,
      filterOperators: filteredOperators
    },
    {
      field: "progress",
      headerName: "Progress",
      minWidth: 20,
      type: 'number',
      renderCell: (params) => (
        <Box sx={{ position: "relative", display: "inline-flex" }}>
          <CircularProgress
            variant="determinate"
            value={params.value}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="caption"
              component="div"
              sx={{ color: "text.secondary", fontSize: "0.65rem" }}
            >
              {`${params.value}%`}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 120,
      filterable: false,
      renderCell: (params) => (
        <Box className="flex items-center h-full">
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => router.push(`/dashboard/projects/${params.row.id}`)}
            className="bg-blue-600 hover:bg-blue-700 capitalize"
          >
            Details
          </Button>
        </Box>
      ),
    }
  ];

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
        {props.user === "admin" && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Plus size={18} />}
            onClick={handleOpen}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add Project
          </Button>
        )}
      </Box>

      <Paper className="shadow-sm border border-gray-200 w-full" sx={{ width: '100%' }}>
        <DataGrid
          rows={projects}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          isRowSelectable={() => false}
          sx={{
            border: 0,
            maxHeight: '50vh',
            '& .MuiDataGrid-cell:focus': { outline: 'none' },
            '& .MuiDataGrid-cell:focus-within': { outline: 'none' }
          }}
        />
      </Paper>

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
