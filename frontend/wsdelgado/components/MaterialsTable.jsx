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

export function MaterialsTable(props) {
  const [materials, setMaterials] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [materialRequest, setMaterialRequest] = useState({
    name: "",
    quantity: "",
    requestingEngineer: "",
    siteLocation: "",
    price: "",
  });

  const fetchMaterials = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/materials/read.php`);
      const data = await response.json();
      setMaterials(data.records || []);
    } catch (error) {
      console.error("Error fetching materials:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchMaterials();
  }, []);

  const handleOpen = (material) => {
    if (material && material.id) {
      setMaterialRequest({
        name: material.name || "",
        quantity: material.quantity || "",
        requestingEngineer: material.requestingEngineer || "",
        siteLocation: material.siteLocation || "",
        price: material.price || "",
      });
    }
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setMaterialRequest({
      name: "",
      quantity: "",
      requestingEngineer: "",
      siteLocation: "",
      price: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMaterialRequest((prev) => ({ ...prev, [name]: value }));
  };

  const handleApprove = () => {
    console.log("Approved material request:", materialRequest);
    handleClose();
  };

  const handleDecline = () => {
    console.log("Declined material request:", materialRequest);
    handleClose();
  };

  const filteredOperators = getGridStringOperators().filter((operator) =>
    ["contains", "startsWith", "equals"].includes(operator.value)
  );

  const columns = [
    {
      field: "name",
      headerName: "Item Name",
      flex: 1,
      minWidth: 150,
      filterOperators: filteredOperators
    },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 1,
      minWidth: 100,
      type: 'number'
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 1,
      minWidth: 100,
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
          label={params.value}
          color={getStatusColor(params.value)}
          size="small"
          className="font-medium"
        />
      ),
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
            Construction Materials Inventory
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
            Add Materials
          </Button>
        )}
      </div>

      <Paper className="shadow-sm border border-gray-200 w-full" sx={{ width: '100%' }}>
        <DataGrid
          rows={materials}
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
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle className="font-bold text-gray-800 border-b border-gray-100 mb-4">
          Material Request Details
        </DialogTitle>
        <DialogContent>
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Material Name"
              type="text"
              fullWidth
              variant="outlined"
              value={materialRequest.name}
              onChange={handleInputChange}
              className="col-span-1 md:col-span-2"
            />
            <TextField
              margin="dense"
              name="quantity"
              label="Quantity"
              type="text"
              fullWidth
              variant="outlined"
              value={materialRequest.quantity}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="price"
              label="Price"
              type="number"
              fullWidth
              variant="outlined"
              value={materialRequest.price}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="requestingEngineer"
              label="Requesting Engineer"
              type="text"
              fullWidth
              variant="outlined"
              value={materialRequest.requestingEngineer}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="siteLocation"
              label="Site Location"
              type="text"
              fullWidth
              variant="outlined"
              value={materialRequest.siteLocation}
              onChange={handleInputChange}
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
            <Button
              onClick={handleDecline}
              variant="outlined"
              color="error"
              className="border-red-600 text-red-600 hover:bg-red-50"
            >
              Decline
            </Button>
            <Button
              onClick={handleApprove}
              variant="contained"
              color="success"
              className="bg-green-600 hover:bg-green-700"
            >
              Approve
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
