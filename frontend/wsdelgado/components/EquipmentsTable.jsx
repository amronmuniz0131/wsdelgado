"use client";

import React, { useState } from "react";
import { API_BASE_URL } from "@/lib/api";
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
import { DataGrid, getGridStringOperators } from "@mui/x-data-grid";
import { Plus } from "lucide-react";


const getStatusColor = (status) => {
  switch (status) {
    case "Available":
      return "success";
    case "In Use":
      return "primary";
    case "Maintenance":
      return "error";
    case "Pending":
    case "Requested":
      return "warning";
    default:
      return "default";
  }
};

export function EquipmentsTable(props) {
  const [equipments, setEquipments] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [equipmentRequest, setEquipmentRequest] = useState({
    name: "",
    type: "",
    status: "",
    currentLocation: "",
    operator: "",
    requestedBy: "",
    estimatedHours: "",
  });

  const fetchEquipments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/equipments/read.php`);
      const data = await response.json();
      setEquipments(data.records || []);
    } catch (error) {
      console.error("Error fetching equipments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchEquipments();
  }, []);
  const handleOpen = (equipment) => {
    if (equipment && equipment.id) {
      setEquipmentRequest({
        name: equipment.name || "",
        type: equipment.type || "",
        status: equipment.status || "",
        currentLocation: equipment.currentLocation || "",
        operator: equipment.operator || "",
        requestedBy: equipment.requestedBy || "",
        estimatedHours: equipment.estimatedHours || "",
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEquipmentRequest({
      id: null,
      name: "",
      type: "",
      status: "Available",
      currentLocation: "",
      operator: "",
      requestedBy: "",
      estimatedHours: "",
      is_approved: 0
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEquipmentRequest((prev) => ({ ...prev, [name]: value }));
  };

  const submitEquipment = async (overrideData = {}) => {
    const payload = { ...equipmentRequest, ...overrideData };
    if (!payload.status) {
      payload.status = "Available";
    }

    const endpoint = payload.id ? `${API_BASE_URL}/equipments/update.php` : `${API_BASE_URL}/equipments/create.php`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        fetchEquipments();
        handleClose();
      } else {
        const error = await response.json();
        alert(error.message || "Operation failed.");
      }
    } catch (error) {
      console.error("Error submitting equipment:", error);
    }
  }

  const handleDecline = async () => {
    if (equipmentRequest.id) {
      await submitEquipment({ is_approved: 0, status: "Declined" });
    } else {
      handleClose();
    }
  };

  const filteredOperators = getGridStringOperators().filter((operator) =>
    ["contains", "startsWith", "equals"].includes(operator.value)
  );

  const columns = [
    {
      field: "name",
      headerName: "Equipment Name",
      flex: 1,
      minWidth: 180,
      filterOperators: filteredOperators
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 120,
      filterOperators: filteredOperators,
      renderCell: (params) => (
        <Chip
          label={params.row.status}
          color={getStatusColor(params.value)}
          size="small"
          className="font-medium"
        />
      ),
    },
    {
      field: "currentLocation",
      headerName: "Current Location",
      flex: 1,
      minWidth: 150,
      filterOperators: filteredOperators
    },
    {
      field: "operator",
      headerName: "Operator",
      flex: 1,
      minWidth: 150,
      filterOperators: filteredOperators
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          onClick={() => handleOpen(params.row)}
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
          Equipment Request Details
        </DialogTitle>
        <DialogContent>
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Equipment Name"
              type="text"
              fullWidth
              variant="outlined"
              value={equipmentRequest.name}
              onChange={handleInputChange}
              className="col-span-1 md:col-span-2"
            />
            <TextField
              margin="dense"
              name="type"
              label="Equipment Type"
              type="text"
              fullWidth
              variant="outlined"
              value={equipmentRequest.type}
              onChange={handleInputChange}
            />
            <TextField
              select
              margin="dense"
              name="status"
              label="Status"
              fullWidth
              variant="outlined"
              value={equipmentRequest.status || "Available"}
              onChange={handleInputChange}
              SelectProps={{
                native: true,
              }}
            >
              <option value="Available">Available</option>
              <option value="In Use">In Use</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Pending">Pending</option>
            </TextField>
            <TextField
              margin="dense"
              name="estimatedHours"
              label="Estimated Hours"
              type="number"
              fullWidth
              variant="outlined"
              value={equipmentRequest.estimatedHours}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="operator"
              label="Assigned Operator"
              type="text"
              fullWidth
              variant="outlined"
              value={equipmentRequest.operator}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="requestedBy"
              label="Requested By"
              type="text"
              fullWidth
              variant="outlined"
              value={equipmentRequest.requestedBy}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="currentLocation"
              label="Site Location"
              type="text"
              fullWidth
              variant="outlined"
              value={equipmentRequest.currentLocation}
              onChange={handleInputChange}
              className="col-span-1 md:col-span-2"
            />
          </Box>
        </DialogContent>
        <DialogActions className="p-4 border-t border-gray-100 flex justify-between">
          <Button
            onClick={handleClose}
            color="inherit"
            className="text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </Button>

          <Box className="flex gap-2">
            {props.user === "admin" ? (
              <>
                {equipmentRequest.id ? (
                  <>
                    <Button
                      onClick={handleDecline}
                      variant="outlined"
                      color="error"
                      className="border-red-600 text-red-600 hover:bg-red-50"
                    >
                      Decline
                    </Button>
                    <Button
                      onClick={() => submitEquipment({ is_approved: 1 })}
                      variant="contained"
                      color="success"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Approve & Save
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => submitEquipment({ is_approved: 1 })}
                    variant="contained"
                    color="success"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Add Equipment
                  </Button>
                )}
              </>
            ) : (
              <Button
                onClick={() => submitEquipment({ is_approved: 0 })}
                variant="contained"
                color="primary"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Submit Request
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
