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
  MenuItem,
} from "@mui/material";
import { DataGrid, getGridStringOperators } from "@mui/x-data-grid";
import { Plus } from "lucide-react";

export function ProjectsTable(props) {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newProject, setNewProject] = useState({
    name: "",
    foremanId: "",
    engineerId: "",
    location: "",
    client: "",
    address: "",
  });

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost/api/projects/read.php");
      const data = await response.json();
      setProjects(data.records || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost/api/employees/read.php");
      const data = await response.json();
      setEmployees(data.records || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  React.useEffect(() => {
    fetchProjects();
    fetchEmployees();
  }, []);

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
      filterOperators: filteredOperators,
      valueGetter: (value, row) => row?.foremanName || row?.foreman || ""
    },
    { 
      field: "engineer", 
      headerName: "Engineer", 
      flex: 1, 
      minWidth: 130,
      filterOperators: filteredOperators,
      valueGetter: (value, row) => row?.engineerName || row?.engineer || ""
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
            value={params.value || 0}
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
              {`${params.value || 0}%`}
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
      foremanId: "",
      engineerId: "",
      location: "",
      client: "",
      address: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProject = async () => {
    try {
      const response = await fetch("http://localhost/api/projects/create.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });
      if (response.ok) {
        fetchProjects();
        handleClose();
      } else {
        const error = await response.json();
        alert(error.message || "Failed to create project");
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
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
          loading={isLoading}
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
              name="foremanId"
              label="Foreman"
              select
              fullWidth
              variant="outlined"
              value={newProject.foremanId}
              onChange={handleInputChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {employees
                .filter((emp) =>
                  emp.position?.toLowerCase().includes("foreman")
                )
                .map((emp) => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {emp.name} ({emp.position})
                  </MenuItem>
                ))}
            </TextField>

            <TextField
              margin="dense"
              name="engineerId"
              label="Engineer"
              select
              fullWidth
              variant="outlined"
              value={newProject.engineerId}
              onChange={handleInputChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {employees
                .filter((emp) =>
                  emp.position?.toLowerCase().includes("engineer")
                )
                .map((emp) => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {emp.name} ({emp.position})
                  </MenuItem>
                ))}
            </TextField>

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
