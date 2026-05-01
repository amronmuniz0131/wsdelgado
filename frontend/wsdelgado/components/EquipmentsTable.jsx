"use client";

import React, { useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import { SuccessToast, DangerToast } from "@/components/useToast";
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
  FormControl,
  InputLabel,
} from "@mui/material";
import SearchableSelect from "@/components/SearchableSelect";
import MenuItem from "@mui/material/MenuItem";
import { DataGrid, getGridStringOperators } from "@mui/x-data-grid";
import { Plus } from "lucide-react";


const getStatusColor = (status) => {
  switch (status) {
    case "Available":
      return "success";
    case "In Use":
      return "primary";
    case "Maintenance":
    case "Overdue":
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
    id: null,
    name: "",
    type: "",
    status: "Available",
    projectId: "",
    projectName: "",
    operatorId: "",
    operator: "",
    requestedById: "",
    requestedBy: "",
    estimatedHours: 0,
    borrowDate: "",
    returnDate: "",
    is_approved: 0
  });

  const fetchEquipments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/equipments`);
      const data = await response.json();
      let records = data.records || [];
      if (props.projectId) {
        records = data.records.filter(e => String(e.projectId) === String(props.projectId));
      }
      setEquipments(records);
    } catch (error) {
      console.error("Error fetching equipments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchEquipments();
  }, [props.projectId]);
  const handleOpen = (equipment) => {
    if (equipment && equipment.id) {
      setEquipmentRequest({
        id: equipment.id,
        name: equipment.name || "",
        type: equipment.type || "",
        status: equipment.status || "Available",
        projectId: equipment.projectId || "",
        projectName: equipment.projectName || "",
        operatorId: equipment.operatorId || "",
        operator: equipment.operator || "",
        requestedById: equipment.requestedById || "",
        requestedBy: equipment.requestedBy || "",
        estimatedHours: equipment.estimatedHours || 0,
        borrowDate: equipment.borrowDate || "",
        returnDate: equipment.returnDate || "",
        is_approved: equipment.is_approved || 0
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
      projectId: "",
      projectName: "",
      operatorId: "",
      operator: "",
      requestedById: "",
      requestedBy: "",
      estimatedHours: 0,
      borrowDate: "",
      returnDate: "",
      is_approved: 0
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEquipmentRequest((prev) => ({ ...prev, [name]: value }));
  };

  const submitEquipment = async (overrideData = {}) => {
    const data = { ...equipmentRequest, ...overrideData };

    // Convert to snake_case for API
    const payload = {
      id: data.id,
      name: data.name,
      type: data.type,
      status: data.status,
      project_id: data.projectId,
      operator_id: data.operatorId,
      requested_by_id: data.requestedById,
      estimated_hours: data.estimatedHours,
      borrow_date: data.borrowDate,
      return_date: data.returnDate,
      is_approved: data.is_approved
    };

    if (!payload.status) {
      payload.status = "Available";
    }

    const isUpdate = !!payload.id;
    const endpoint = isUpdate ? `${API_BASE_URL}/equipments/${payload.id}` : `${API_BASE_URL}/equipments`;

    try {
      const response = await fetch(endpoint, {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        fetchEquipments();
        handleClose();
        SuccessToast(isUpdate ? "Equipment updated successfully" : "Equipment added successfully");
      } else {
        const error = await response.json();
        DangerToast(error.message || "Operation failed.");
      }
    } catch (error) {
      console.error("Error submitting equipment:", error);
    }
  }

  const handleMaintenance = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/equipments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Maintenance",
          is_approved: 1
        }),
      });

      if (response.ok) {
        fetchEquipments();
        SuccessToast("Equipment set to maintenance");
      } else {
        const error = await response.json();
        DangerToast(error.message || "Failed to set maintenance status");
      }
    } catch (error) {
      console.error("Error setting maintenance:", error);
    }
  };

  const handleEndMaintenance = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/equipments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Available",
          is_approved: 1
        }),
      });

      if (response.ok) {
        fetchEquipments();
        SuccessToast("Equipment set to available");
      } else {
        const error = await response.json();
        DangerToast(error.message || "Failed to end maintenance status");
      }
    } catch (error) {
      console.error("Error ending maintenance:", error);
    }
  };

  const handleReturn = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/equipments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Available",
          project_id: null,
          requested_by_id: null,
          borrow_date: null,
          return_date: null,
          estimated_hours: 0,
          is_approved: 1
        }),
      });

      if (response.ok) {
        fetchEquipments();
        SuccessToast("Equipment set to available");
      } else {
        const error = await response.json();
        DangerToast(error.message || "Failed to return equipment");
      }
    } catch (error) {
      console.error("Error returning equipment:", error);
    }
  };

  const handleApprove = async () => {
    const today = new Date();
    // Assuming 8 working hours per day for estimation
    const hours = parseFloat(equipmentRequest.estimatedHours || 0);
    const daysToAdd = hours > 0 ? Math.ceil(hours / 24) : 0;

    const returnDay = new Date(today);
    returnDay.setDate(today.getDate() + daysToAdd);

    await submitEquipment({
      status: "In Use",
      is_approved: 1,
      borrowDate: today.toISOString().split('T')[0],
      returnDate: returnDay.toISOString().split('T')[0]
    });
  };

  const handleDecline = async () => {
    await submitEquipment({
      status: "Available",
      is_approved: 0,
      projectId: null,
      requestedById: null,
      borrowDate: null,
      returnDate: null
    });
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
      renderCell: (params) => {
        let status = params.row.status;
        if (status === "In Use" && params.row.returnDate) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const rDate = new Date(params.row.returnDate);
          if (rDate < today) {
            status = "Overdue";
          }
        }
        return (
          <Chip
            label={status}
            color={getStatusColor(status)}
            size="small"
            className="font-medium"
          />
        );
      },
    },
    {
      field: "projectName",
      headerName: "Project",
      flex: 1,
      minWidth: 150,
      filterOperators: filteredOperators,
      valueGetter: (value, row) => row.projectName || "N/A"
    },
    // {
    //   field: "operator",
    //   headerName: "Operator",
    //   flex: 1,
    //   minWidth: 150,
    //   filterOperators: filteredOperators
    // },
    ...(!props.projectId ? [{
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box className="flex gap-2 items-center h-full">
          <Button
            variant="contained"
            onClick={() => handleOpen(params.row)}
            className="bg-blue-600 !text-2xs hover:bg-blue-700"
            size="small"
            disabled={props.user !== "admin"}
          >
            Edit
          </Button>
          {params.row.status !== "Maintenance" && props.user === "admin" && (
            <Button
              variant="outlined"
              onClick={() => handleMaintenance(params.row.id)}
              className="border-red-600 text-red-600 hover:bg-red-50 !text-2xs"
              size="small"
              disabled={params.row.status === "In Use"}
            >
              Maint.
            </Button>
          )}
          {params.row.status === "Maintenance" && props.user === "admin" && (
            <Button
              variant="outlined"
              onClick={() => handleEndMaintenance(params.row.id)}
              className="border-green-600 text-green-600 hover:bg-green-50 !text-2xs"
              size="small"
            >
              End Maint.
            </Button>
          )}
          {params.row.status === "In Use" && props.user === "admin" && (
            <Button
              variant="outlined"
              onClick={() => handleReturn(params.row.id)}
              className="border-green-600 text-green-600 hover:bg-green-50 !text-2xs"
              size="small"
            >
              Return
            </Button>
          )}
        </Box>
      ),
    }] : []),
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
        {props.user === "admin" && !props.projectId && (
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
            {!equipmentRequest.requestedById && (
              <FormControl fullWidth margin="dense">
                <InputLabel>Status</InputLabel>
                <SearchableSelect
                  name="status"
                  label="Status"
                  value={equipmentRequest.status || "Available"}
                  onChange={handleInputChange}
                >
                  <MenuItem value="Available">Available</MenuItem>
                </SearchableSelect>
              </FormControl>
            )}
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
            {/* <TextField
              margin="dense"
              name="operator"
              label="Assigned Operator"
              type="text"
              fullWidth
              variant="outlined"
              value={equipmentRequest.operator}
              onChange={handleInputChange}
            /> */}
            <TextField
              margin="dense"
              name="borrowDate"
              label="Borrow Date"
              type="date"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={equipmentRequest.borrowDate}
              onChange={handleInputChange}
              disabled
            />
            <TextField
              margin="dense"
              name="returnDate"
              label="Return Date"
              type="date"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={equipmentRequest.returnDate}
              onChange={handleInputChange}
            />
            <Box className="col-span-1 md:col-span-2 bg-blue-50 p-4 rounded-xl space-y-4">
              <Box className="space-y-2">
                <Typography variant="subtitle2" className="font-bold text-blue-800">Requesting Info</Typography>
                <Box className="grid grid-cols-2 gap-4">
                  <Box>
                    <Typography variant="caption" className="text-gray-400 block uppercase">Project</Typography>
                    <Typography variant="body2" className="font-medium text-gray-700">{equipmentRequest.projectName || "None"}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" className="text-gray-400 block uppercase">Engineer</Typography>
                    <Typography variant="body2" className="font-medium text-gray-700">{equipmentRequest.requestedBy || "None"}</Typography>
                  </Box>
                </Box>
              </Box>

              {equipmentRequest.status === "Requested" && props.user === "admin" && (
                <Box className="flex gap-2 pt-2 border-t border-blue-100">
                  <Button
                    onClick={handleApprove}
                    variant="contained"
                    color="success"
                    fullWidth
                    className="bg-green-600 hover:bg-green-700 py-2 font-bold"
                  >
                    Approve & Deploy
                  </Button>
                  <Button
                    onClick={handleDecline}
                    variant="outlined"
                    color="error"
                    fullWidth
                    className="border-red-600 text-red-600 hover:bg-red-50 py-2 font-bold"
                  >
                    Reject
                  </Button>
                </Box>
              )}
            </Box>
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
                    {equipmentRequest.status !== "Requested" && (
                      <Button
                        onClick={() => submitEquipment()}
                        variant="contained"
                        color="success"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Save Changes
                      </Button>
                    )}
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
