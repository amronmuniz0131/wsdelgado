"use client";

import React, { useState } from "react";
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
  Chip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Plus } from "lucide-react";


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

export function EquipmentsTable(props) {
  const [equipments] = useState(initialEquipments);
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

  const columns = [
    { field: "name", headerName: "Equipment Name", flex: 1, minWidth: 180 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value)}
          size="small"
          className="font-medium"
        />
      ),
    },
    { field: "currentLocation", headerName: "Current Location", flex: 1, minWidth: 150 },
    { field: "operator", headerName: "Operator", flex: 1, minWidth: 150 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 120,
      sortable: false,
      renderCell: () => (
        <Button
          variant="contained"
          onClick={handleOpen}
          className="bg-blue-600 !text-2xs hover:bg-blue-700"
          size="small"
        >
          View More
        </Button>
      ),
    },
  ];

  return (
    <Box className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Box className="flex items-center">
          <Typography
            variant="h6"
            component="h2"
            className="text-gray-800 font-semibold"
          >
            Construction Equipments
          </Typography>
        </Box>
        {props.user === "admin" && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Plus size={18} />}
            onClick={handleOpen}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add Equipment
          </Button>
        )}
      </div>

      <Paper className="shadow-sm border border-gray-200 w-full" sx={{ width: '100%' }}>
        <DataGrid
          rows={equipments}
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
            height: '40vh',
            '& .MuiDataGrid-cell:focus': { outline: 'none' },
            '& .MuiDataGrid-cell:focus-within': { outline: 'none' }
          }}
        />
      </Paper>
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
