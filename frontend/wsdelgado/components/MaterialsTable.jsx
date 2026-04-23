"use client";

import React, { useState, useEffect } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
    case "Pending":
    case "Requested":
      return "warning";
    default:
      return "default";
  }
};

export function MaterialsTable(props) {
  const [materials, setMaterials] = useState([]);
  const [currentMaterial, setCurrentMaterial] = useState(null);
  const [open, setOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [materialRequest, setMaterialRequest] = useState({
    id: null,
    name: "",
    quantity: "",
    requestingEngineer: "",
    max_stock: "",
    siteLocation: "",
    status: "In Stock",
    price: "",
    is_approved: 0
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

  const [requestCount, setCount] = useState({})

  useEffect(() => {
    if (props.user === "admin") {
      let obj = {}
      materials.map((data) => {
        let count = 0;
        requests.map((req) => {
          if (req.material_id === data.id && req.is_approve === "Pending") {
            count++;
          }
        })
        obj = { ...obj, [data.name]: count }
      })
      setCount(obj)
      console.log(obj)
    }
  }, [materials, requests])

  React.useEffect(() => {
    fetchMaterials();
    fetchRequests();
  }, []);

  const handleOpen = (material) => {
    if (material && material.id) {
      setMaterialRequest({
        id: material.id,
        name: material.name || "",
        quantity: material.quantity || "",
        max_stock: material.max_stock || "",
        requestingEngineer: material.requestingEngineer || "",
        siteLocation: material.siteLocation || "",
        status: material.status || "",
        price: material.price || "",
        is_approved: material.is_approved || 0
      });
    } else {
      setMaterialRequest({
        id: null,
        name: "",
        quantity: "",
        max_stock: "",
        requestingEngineer: "",
        siteLocation: "",
        status: "In Stock",
        price: "",
        is_approved: 0
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setMaterialRequest({
      id: null,
      name: "",
      quantity: "",
      max_stock: "",
      requestingEngineer: "",
      siteLocation: "",
      status: "In Stock",
      price: "",
      is_approved: 0
    });
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMaterialRequest((prev) => ({ ...prev, [name]: value }));
  };

  const submitMaterial = async (overrideData = {}) => {
    const payload = { ...materialRequest, ...overrideData };
    if (!payload.status) {
      payload.status = "In Stock";
    }

    const endpoint = payload.id ? `${API_BASE_URL}/materials/update.php` : `${API_BASE_URL}/materials/create.php`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        fetchMaterials();
        handleClose();
      } else {
        const error = await response.json();
        alert(error.message || "Operation failed.");
      }
    } catch (error) {
      console.error("Error submitting material:", error);
    }
  };

  const handleDecline = async () => {
    if (materialRequest.id) {
      await submitMaterial({ is_approved: 0, status: "Declined" });
    } else {
      handleClose();
    }
  };

  const [table, openTable] = useState(false);

  const fetchRequests = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/request/read.php`);
      const data = await response.json();
      setRequests(data.records || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  React.useEffect(() => {
    if (table) {
      fetchRequests();
    }
  }, [table]);

  const handleApproveRequest = async (req) => {
    try {
      // 1. Update request status to "Approve"
      const updateReqResponse = await fetch(`${API_BASE_URL}/request/update.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...req,
          is_approve: "Approve"
        }),
      });

      if (updateReqResponse.ok) {
        // 2. Deduct quantity from material
        const material = materials.find(m => m.id === req.material_id);
        if (material) {
          const newQuantity = Math.max(0, parseInt(material.quantity) - parseInt(req.quantity));
          const updateMatResponse = await fetch(`${API_BASE_URL}/materials/update.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...material,
              quantity: newQuantity
            }),
          });

          if (updateMatResponse.ok) {
            alert("Request approved and inventory updated!");
          } else {
            console.error("Failed to update material quantity");
          }
        }
        fetchRequests();
        fetchMaterials();
      }
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleRejectRequest = async (req) => {
    try {
      const response = await fetch(`${API_BASE_URL}/request/update.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...req,
          is_approve: "Reject"
        }),
      });

      if (response.ok) {
        alert("Request rejected.");
        fetchRequests();
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
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
          label={params.row.quantity / params.row.max_stock >= 0.2 ? "In Stock" : params.row.quantity / params.row.max_stock == 0 ? "Out of stock" : "Low Stock"}
          color={params.row.quantity / params.row.max_stock >= 0.2 ? getStatusColor("In Stock") : params.row.quantity / params.row.max_stock == 0 ? getStatusColor("Out of Stock") : getStatusColor("Low Stock")}
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
        <div className="h-full gap-2 flex items-center justify-between">
          <Button
            variant="contained"
            onClick={() => { openTable(true); setCurrentMaterial(params.row.id) }}
            disabled={props.user === "engineer"}
            className="relative bg-blue-600 !text-2xs hover:bg-blue-700"
            size="small"
          >
            View More
            {props.user === "admin" && requestCount[params.row.name] !== 0 &&
              <span className="absolute -top-1 -right-2 h-4 w-4 text-xs animate-bounce rounded-full bg-red-400">{requestCount[params.row.name]}</span>
            }
          </Button>
          <Button
            variant="contained"
            onClick={() => handleOpen(params.row)}
            disabled={props.user === "engineer"}
            className="bg-blue-600 !text-2xs hover:bg-blue-700"
            size="small"
          >
            Edit
          </Button>
        </div>
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
        {(props.user === "admin") && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Plus size={18} />}
            onClick={() => handleOpen()}
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
            height: '40vh',
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
              name="max_stock"
              label="Max Stock"
              type="text"
              fullWidth
              variant="outlined"
              value={materialRequest.max_stock}
              onChange={handleInputChange}
            />
            <TextField
              select
              margin="dense"
              name="status"
              label="Status"
              fullWidth
              variant="outlined"
              value={materialRequest.status || "In Stock"}
              onChange={handleInputChange}
              SelectProps={{
                native: true,
              }}
            >
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Pending">Pending</option>
            </TextField>
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
                {materialRequest.id ? (
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
                      onClick={() => submitMaterial({ is_approved: 1 })}
                      variant="contained"
                      color="success"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Approve & Save
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => submitMaterial({ is_approved: 1 })}
                    variant="contained"
                    color="success"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Add Material
                  </Button>
                )}
              </>
            ) : (
              <Button
                onClick={() => submitMaterial({ is_approved: 0, status: "Pending" })}
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

      {/* Material Request Modal */}
      <Dialog open={table} onClose={() => openTable(false)} maxWidth="md" fullWidth>
        <DialogTitle className="font-bold text-gray-800 border-b border-gray-100 mb-4">
          Material Request
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead className="bg-gray-50">
                <TableRow>
                  <TableCell className="font-bold">Project</TableCell>
                  <TableCell className="font-bold">Engineer</TableCell>
                  <TableCell className="font-bold">Material</TableCell>
                  <TableCell className="font-bold text-right">Qty</TableCell>
                  <TableCell className="font-bold">Date</TableCell>
                  <TableCell className="font-bold">Status</TableCell>
                  <TableCell className="font-bold text-center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" className="py-8">
                      No material requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((req) => (

                    req.material_id === currentMaterial && (
                      <TableRow key={req.id} hover>
                        <TableCell>{req.project_name || req.project_id}</TableCell>
                        <TableCell>{req.engineer_name || req.engineer_id}</TableCell>
                        <TableCell>{req.material_name || req.material_id}</TableCell>
                        <TableCell align="right">{req.quantity}</TableCell>
                        <TableCell>{new Date(req.request_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Chip
                            label={req.is_approve}
                            size="small"
                            color={req.is_approve === "Approve" ? "success" : req.is_approve === "Reject" ? "error" : "warning"}
                          />
                        </TableCell>
                        <TableCell align="center">
                          {req.is_approve === "Pending" && localStorage.getItem('user') === "admin" && (
                            <Box className="flex gap-1 justify-center">
                              {(() => {
                                let isInsufficient = false;
                                const currentMat = materials.find(m => m.id === req.material_id);
                                if (currentMat) {
                                  isInsufficient = parseInt(currentMat.quantity) < parseInt(req.quantity);
                                }
                                return (
                                  <Button
                                    size="small"
                                    variant="contained"
                                    color="success"
                                    className={`${isInsufficient ? "bg-gray-400" : "bg-green-600"} !text-3xs`}
                                    onClick={() => handleApproveRequest({ ...req, engineer_id: req.engineer_id })}
                                    disabled={isInsufficient}
                                  >
                                    Approve
                                  </Button>
                                );
                              })()}
                              <Button
                                size="small"
                                variant="contained"
                                color="error"
                                className="bg-red-600 !text-3xs"
                                onClick={() => handleRejectRequest(req)}
                              >
                                Reject
                              </Button>
                            </Box>
                          )}
                        </TableCell>
                      </TableRow>
                    )

                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => openTable(false)} color="inherit">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>

  );
}
