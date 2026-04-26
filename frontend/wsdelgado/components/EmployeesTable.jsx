"use client";

import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/api";
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
  MenuItem,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Plus, Eye, Pencil, Briefcase, Calendar, MapPin, Phone, Mail, UserRound, ArrowRight } from "lucide-react";

export function EmployeesTable() {
  const [employees, setEmployees] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [count, setCount] = useState(0)
  const [positions, setPositions] = useState([]);
  const [prevProject, setPrevProject] = useState(null);
  const user = localStorage.getItem("user")

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/employees/read.php`);
      const data = await response.json();
      setEmployees(data.records || []);
      setCount(data.records.length)
      setNewEmployee((prev) => ({ ...prev, employeeId: "EMP-" + (data.records.length + 1) }));
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/read.php`);
      const data = await response.json();
      setProjects(data.records || []);
      console.log(data.records)
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  React.useEffect(() => {
    fetchEmployees();
    fetchPositions();
    fetchProjects();
  }, []);

  const [newEmployee, setNewEmployee] = useState({
    employeeId: "EMP-" + (count),
    name: "",
    position: "",
    assignedProject: "",
    dateOfEmployment: "",
    status: "available",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  const fetchPositions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/positions/read.php`);
      const data = await response.json();
      setPositions(data.records || []);
      console.log(data.records)
    } catch (error) {
      console.error("Error fetching positions:", error);
    }
  };

  useEffect(() => {
    setCount(employees.length + 1)
  }, [employees])

  const handleOpenAdd = () => setOpenAddModal(true);
  const handleCloseAdd = () => {
    setOpenAddModal(false);
    setNewEmployee({
      employeeId: "EMP-" + (count),
      name: "",
      position: "",
      assignedProject: "",
      dateOfEmployment: "",
      status: "available",
      email: "",
      phone: "",
      address: "",
      notes: "",
    });
  };

  const handleOpenView = (employee) => {
    setSelectedEmployee(employee);
    setOpenViewModal(true);
  };

  const handleCloseView = () => {
    setOpenViewModal(false);
    setSelectedEmployee(null);
  };

  const handleOpenEdit = (employee) => {
    setEditingEmployee(employee);
    setPrevProject(employee.assignedProjectId);
    setOpenEditModal(true);
  };

  const handleCloseEdit = () => {
    setOpenEditModal(false);
    setEditingEmployee(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEmployee = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/create.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmployee),
      });
      if (response.ok) {
        fetchEmployees();
        handleCloseAdd();
      } else {
        const error = await response.json();
        alert(error.message || "Failed to add employee");
      }
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  const handleUpdateEmployee = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/update.php`, {
        method: "POST", // Using POST for convenience as per PHP implementation
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingEmployee),
      });
      if (response.ok) {
        // Sync project assignment for Engineers and Foremen
        const pos = editingEmployee.position?.toLowerCase();
        if ((pos === "engineer" || pos === "foreman") && editingEmployee.assignedProjectId !== prevProject) {
          // 1. Clear from previous project
          if (prevProject) {
            try {
              const clearPayload = { id: prevProject };
              if (pos === "engineer") clearPayload.engineer_id = null;
              if (pos === "foreman") clearPayload.foreman_id = null;

              await fetch(`${API_BASE_URL}/projects/update.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(clearPayload),
              });
            } catch (clearError) {
              console.error("Error clearing old project assignment:", clearError);
            }
          }

          // 2. Assign to new project
          if (editingEmployee.assignedProjectId) {
            try {
              const targetProject = projects.find(p => String(p.id) === String(editingEmployee.assignedProjectId));
              // If the project already has an engineer, unassign the old one
              const oldEngineer = employees.find((d) => {
                return d.assignedProjectId === targetProject.id && d.position === "engineer"
              });
              console.log(oldEngineer)
              if (oldEngineer) {
                await fetch(`${API_BASE_URL}/employees/update.php`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    ...oldEngineer,
                    assignedProjectId: null,
                    assigned_project_id: null,
                  }),
                });
              }

              const projectUpdatePayload = { id: editingEmployee.assignedProjectId };
              if (pos === "engineer") projectUpdatePayload.engineer_id = editingEmployee.id;
              if (pos === "foreman") projectUpdatePayload.foreman_id = editingEmployee.id;

              await fetch(`${API_BASE_URL}/projects/update.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(projectUpdatePayload),
              });
            } catch (projError) {
              console.error("Error updating project lead:", projError);
            }
          }
        }

        fetchEmployees();
        handleCloseEdit();
      } else {
        const error = await response.json();
        alert(error.message || "Failed to update employee");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "EMPLOYEE",
      flex: 1,
      minWidth: 120,
      align: "start",
      headerAlign: "start",
      renderCell: (params) => (
        <Box className="flex items-center justify-start w-full gap-3 h-full">
          <Avatar className="bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
            {params.row.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography className="font-bold text-gray-800 text-sm leading-tight">
              {params.row.name}
            </Typography>
            <Typography variant="caption" className="text-gray-400 block">
              {params.row.employeeId}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "position",
      headerName: "POSITION",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "assignedProject",
      headerName: "ASSIGNED PROJECT",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "dateOfEmployment",
      headerName: "EMPLOYMENT DATE",
      width: 180,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: "STATUS",
      width: 130,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box className="flex items-center justify-center h-full">
          <Chip
            label={getStatusLabel(!params.row.assignedProject ? "available" : "ongoing")}
            color={getStatusColor(!params.row.assignedProject ? "available" : "ongoing")}
            size="small"
            className="font-bold text-[11px] uppercase tracking-wider"
          />
        </Box>
      ),
    },
    ...(user === "admin" ? [{
      field: "actions",
      headerName: "ACTION",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box className="flex items-center h-full justify-center w-full gap-1">
          <Tooltip title="View Profile">
            <IconButton
              size="small"
              className="text-blue-500 hover:bg-blue-100 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenView(params.row);
              }}
            >
              <Eye size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Information">
            <IconButton
              size="small"
              className="text-amber-500 hover:bg-amber-100 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenEdit(params.row);
              }}
            >
              <Pencil size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    }] : [])
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "success";
      case "ongoing":
        return "primary";
      case "on leave":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "available":
        return "Available";
      case "ongoing":
        return "Ongoing";
      case "on leave":
        return "On Leave";
      default:
        return status;
    }
  };

  return (
    <Box className="w-full">
      {/* Header section with gradient background */}
      <Box className="flex justify-between items-center mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-sm border border-blue-100">
        <Box>
          <Typography
            variant="h4"
            className="text-gray-800 font-bold tracking-tight mb-1"
          >
            Workforce Portal
          </Typography>
          <Typography variant="body2" className="text-gray-500 font-medium">
            Manage and monitor your project teams and employee availability
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 normal-case px-6 py-2.5 rounded-xl shadow-lg transition-all transform hover:scale-105"
        >
          Add New Employee
        </Button>
      </Box>

      {/* Main Table Section */}
      <Box className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-white h-[600px]">
        <DataGrid
          rows={employees}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
          rowHeight={70}
          className="border-none"
          sx={{
            '& .MuiDataGrid-cell:focus': { outline: 'none' },
            '& .MuiDataGrid-columnHeader:focus': { outline: 'none' },
            '& .MuiDataGrid-row:hover': { backgroundColor: '#f0f7ff' },
          }}
          components={{
            NoRowsOverlay: () => (
              <Box className="flex flex-col items-center justify-center h-full gap-2 opacity-60">
                <UserRound size={48} className="text-gray-300" />
                <Typography variant="h6">No Employees Records</Typography>
                <Typography variant="body2">Get started by adding your first employee to the database.</Typography>
              </Box>
            )
          }}
        />
      </Box>

      {/* View Employee Details Modal */}
      <Dialog
        open={openViewModal}
        onClose={handleCloseView}
        maxWidth="md"
        fullWidth
        PaperProps={{
          className: "rounded-3xl overflow-hidden",
          sx: { boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }
        }}
      >
        {selectedEmployee && (
          <Box className="flex flex-col md:flex-row h-full">
            {/* Left Column / Header Background */}
            <Box className="bg-gradient-to-br from-blue-600 to-indigo-800 text-white p-10 md:w-1/3 flex flex-col items-center justify-center relative overflow-hidden">
              <Box className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <Box className="absolute bottom-[-20%] right-[-20%] w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl" />

              <Avatar sx={{ width: 120, height: 120, mb: 3 }} className="bg-white text-blue-700 text-4xl font-bold shadow-2xl border-4 border-white/20">
                {selectedEmployee.name.charAt(0)}
              </Avatar>
              <Typography variant="h5" className="font-extrabold text-center">
                {selectedEmployee.name}
              </Typography>
              <Typography variant="body2" className="opacity-80 font-medium tracking-widest uppercase mb-6">
                {selectedEmployee.employeeId}
              </Typography>

              <Chip
                label={getStatusLabel(!selectedEmployee.assignedProject ? "available" : "ongoing")}
                className="bg-white/20 text-white border border-white/30 backdrop-blur-md px-4 py-1.5 font-bold uppercase text-[10px]"
              />
            </Box>

            {/* Right Column / Content */}
            <Box className="flex-1 p-8 bg-white overflow-y-auto">
              <Box className="flex justify-between items-start mb-6">
                <Typography variant="h6" className="text-gray-800 font-bold flex items-center gap-2">
                  <Briefcase size={20} className="text-blue-600" /> Professional Details
                </Typography>
                <IconButton onClick={handleCloseView} className="hover:rotate-90 transition-transform">
                  <ArrowRight size={24} className="text-gray-400 rotate-180 md:rotate-0" />
                </IconButton>
              </Box>

              <Box className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
                <Box>
                  <Typography variant="caption" className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Current Position</Typography>
                  <Typography className="text-gray-800 font-bold">{selectedEmployee.position}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Assigned Project</Typography>
                  <Typography className="text-gray-800 font-bold text-blue-600 italic underline decoration-blue-200 decoration-4 underline-offset-4">{selectedEmployee.assignedProject}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Employment Date</Typography>
                  <Box className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    <Typography className="text-gray-800 font-bold">{selectedEmployee.dateOfEmployment}</Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Experience Level</Typography>
                  <Typography className="text-gray-800 font-bold">Senior Associate</Typography>
                </Box>
              </Box>

              <Divider className="mb-8" />

              <Typography variant="h6" className="text-gray-800 font-bold mb-6 flex items-center gap-2">
                <MapPin size={20} className="text-blue-600" /> Contact Information
              </Typography>

              <Box className="grid grid-cols-1 md:grid-cols-2 gap-y-6 mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <Box className="flex items-start gap-3">
                  <Box className="bg-blue-100 p-2 rounded-lg"><Mail size={16} className="text-blue-600" /></Box>
                  <Box>
                    <Typography variant="caption" className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Email Address</Typography>
                    <Typography className="text-gray-800 font-bold truncate max-w-[200px]">{selectedEmployee.email}</Typography>
                  </Box>
                </Box>
                <Box className="flex items-start gap-3">
                  <Box className="bg-blue-100 p-2 rounded-lg"><Phone size={16} className="text-blue-600" /></Box>
                  <Box>
                    <Typography variant="caption" className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Contact Number</Typography>
                    <Typography className="text-gray-800 font-bold">{selectedEmployee.phone}</Typography>
                  </Box>
                </Box>
                <Box className="flex items-start gap-3 col-span-1 md:col-span-2">
                  <Box className="bg-blue-100 p-2 rounded-lg"><MapPin size={16} className="text-blue-600" /></Box>
                  <Box>
                    <Typography variant="caption" className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Home Address</Typography>
                    <Typography className="text-gray-800 font-bold">{selectedEmployee.address}</Typography>
                  </Box>
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" className="text-gray-400 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 mb-2">
                  Internal Notes
                </Typography>
                <Typography variant="body2" className="text-gray-600 italic bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg leading-relaxed">
                  "{selectedEmployee.notes}"
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Dialog>

      {/* Add Employee Modal */}
      <Dialog open={openAddModal} onClose={handleCloseAdd} maxWidth="sm" fullWidth PaperProps={{ className: "rounded-3xl" }}>
        <DialogTitle className="font-extrabold text-2xl text-gray-800 px-8 pt-8">
          Register New Employee
          <Typography className="text-gray-500 font-normal mt-1 border-b pb-4">Fill in the professional profile details</Typography>
        </DialogTitle>
        <DialogContent className="px-8 pb-4">
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <TextField
              autoFocus
              margin="dense"
              name="employeeId"
              label="Employee ID"
              fullWidth
              disabled
              variant="outlined"
              value={"EMP-" + count}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="name"
              label="Full Name"
              fullWidth
              variant="outlined"
              value={newEmployee.name}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="position"
              label="Position"
              fullWidth
              select
              variant="outlined"
              value={newEmployee.position}
              onChange={handleInputChange}
            >
              {positions.map((position) => (
                position.position.toLowerCase() !== "admin" && position.position.toLowerCase() !== "engineer" && (
                  <MenuItem key={position.id} value={position.position}>
                    {position.position}
                  </MenuItem>
                )
              ))}
            </TextField>
            <TextField
              margin="dense"
              name="assignedProject"
              label="Assigned Project"
              fullWidth
              select
              variant="outlined"
              value={newEmployee.assignedProject}
              onChange={handleInputChange}
            >
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.name}>
                  {project.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="dense"
              name="dateOfEmployment"
              label="Employment Date"
              type="date"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={newEmployee.dateOfEmployment}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="email"
              label="Email"
              fullWidth
              variant="outlined"
              value={newEmployee.email}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="phone"
              label="Phone"
              fullWidth
              variant="outlined"
              value={newEmployee.phone}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="address"
              label="Address"
              multiline
              rows={2}
              fullWidth
              variant="outlined"
              value={newEmployee.address}
              onChange={handleInputChange}
              className="col-span-1 md:col-span-2"
            />
          </Box>
        </DialogContent>
        <DialogActions className="p-8 pt-2">
          <Button onClick={handleCloseAdd} className="text-gray-500 font-bold">Cancel</Button>
          <Button
            onClick={handleAddEmployee}
            variant="contained"
            className="bg-blue-600 hover:bg-blue-700 font-bold px-8 py-2.5 rounded-xl"
            disabled={!newEmployee.name || !newEmployee.employeeId}
          >
            Create Profile
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Employee Modal */}
      <Dialog open={openEditModal} onClose={handleCloseEdit} maxWidth="sm" fullWidth PaperProps={{ className: "rounded-3xl" }}>
        <DialogTitle className="font-extrabold text-2xl text-gray-800 px-8 pt-8">
          Edit Employee Information
          <Typography className="text-gray-500 font-normal mt-1 border-b pb-4">Update professional profile details</Typography>
        </DialogTitle>
        <DialogContent className="px-8 pb-4">
          {editingEmployee && (
            <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <TextField
                margin="dense"
                name="employeeId"
                label="Employee ID"
                fullWidth
                variant="outlined"
                value={editingEmployee.employeeId}
                onChange={handleEditInputChange}
              />
              <TextField
                margin="dense"
                name="name"
                label="Full Name"
                fullWidth
                variant="outlined"
                value={editingEmployee.name}
                onChange={handleEditInputChange}
              />
              {editingEmployee.position.toLowerCase() !== "admin" && editingEmployee.position.toLowerCase() !== "engineer" && (
                <TextField
                  margin="dense"
                  name="position"
                  label="Position"
                  fullWidth
                  select
                  variant="outlined"
                  value={editingEmployee.position}
                  onChange={handleEditInputChange}
                >
                  {positions.map((position) => (
                    position.position.toLowerCase() !== "admin" && position.position.toLowerCase() !== "engineer" && (
                      <MenuItem key={position.id} value={position.position}>
                        {position.position}
                      </MenuItem>
                    )
                  ))}
                </TextField>
              )}
              {editingEmployee.position.toLowerCase() !== "admin" && (
                <TextField
                  margin="dense"
                  name="assignedProjectId"
                  label="Assigned Project"
                  select
                  fullWidth
                  variant="outlined"
                  value={editingEmployee.assignedProjectId || ""}
                  onChange={handleEditInputChange}
                >
                  {projects.map((project) => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
              <TextField
                margin="dense"
                name="dateOfEmployment"
                label="Employment Date"
                type="date"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={editingEmployee.dateOfEmployment}
                onChange={handleEditInputChange}
              />
              <TextField
                margin="dense"
                name="email"
                label="Email"
                fullWidth
                variant="outlined"
                value={editingEmployee.email}
                onChange={handleEditInputChange}
              />
              <TextField
                margin="dense"
                name="phone"
                label="Phone"
                fullWidth
                variant="outlined"
                value={editingEmployee.phone}
                onChange={handleEditInputChange}
              />
              <TextField
                margin="dense"
                name="address"
                label="Address"
                multiline
                rows={2}
                fullWidth
                variant="outlined"
                value={editingEmployee.address}
                onChange={handleEditInputChange}
                className="col-span-1 md:col-span-2"
              />
              <TextField
                margin="dense"
                name="notes"
                label="Internal Notes"
                multiline
                rows={2}
                fullWidth
                variant="outlined"
                value={editingEmployee.notes}
                onChange={handleEditInputChange}
                className="col-span-1 md:col-span-2"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions className="p-8 pt-2">
          <Button onClick={handleCloseEdit} className="text-gray-500 font-bold">Cancel</Button>
          <Button
            onClick={handleUpdateEmployee}
            variant="contained"
            className="bg-amber-500 hover:bg-amber-600 font-bold px-8 py-2.5 rounded-xl text-white"
            disabled={!editingEmployee?.name || !editingEmployee?.employeeId}
          >
            Update Profile
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
