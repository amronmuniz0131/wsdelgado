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
  Typography,
  Box,
  Chip,
  Badge,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Mail, MailOpen } from "lucide-react";

export function InquiriesList({ openModal, setNewAccount, user, onUnreadCountChange }) {
  const [inquiries, setInquiries] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/inquiries/read`);
      const data = await response.json();
      setInquiries(data.records || []);
      if (onUnreadCountChange) {
        onUnreadCountChange(data.unread_count || 0);
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user === "admin") {
      fetchInquiries();
    }
  }, [user]);

  const handleOpen = async (inquiry) => {
    setSelectedInquiry(inquiry);
    setOpen(true);

    if (inquiry.is_read == 0) {
      try {
        await fetch(`${API_BASE_URL}/inquiries/mark_read`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: inquiry.id }),
        });
        // Refetch to update the unread status
        fetchInquiries();
      } catch (error) {
        console.error("Error marking inquiry as read:", error);
      }
    }
  };

  const handleCreateAccount = () => {
    setNewAccount({
      name: selectedInquiry.name,
      email: selectedInquiry.email,
      password: "",
      role: "user",
    });
    setOpen(false);
    openModal();
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedInquiry(null);
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 150 },
    { field: "subject", headerName: "Subject", flex: 1.5, minWidth: 200 },
    {
      field: "is_read",
      headerName: "Status",
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <Chip
          label={params.value == 1 ? "Read" : "Unread"}
          color={params.value == 1 ? "default" : "primary"}
          size="small"
          className="font-medium"
        />
      ),
    },
    {
      field: "created_at",
      headerName: "Date",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => new Date(params.value).toLocaleString(),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.8,
      minWidth: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          onClick={() => handleOpen(params.row)}
          size="small"
          startIcon={params.row.is_read == 1 ? <MailOpen size={14} /> : <Mail size={14} />}
        >
          View
        </Button>
      ),
    },
  ];

  if (user !== "admin") return null;

  return (
    <Box className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Typography variant="h6" component="h2" className="text-gray-800 font-semibold flex items-center gap-2">
          Contact Inquiries
        </Typography>
      </div>

      <Paper className="shadow-sm border border-gray-200 w-full" sx={{ width: '100%' }}>
        <DataGrid
          rows={inquiries}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          loading={isLoading}
          sx={{
            border: 0,
            maxHeight: '50vh',
            height: '40vh',
            '& .MuiDataGrid-row:hover': {
              cursor: 'pointer'
            }
          }}
          onRowClick={(params) => handleOpen(params.row)}
        />
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle className="font-bold text-gray-800 border-b border-gray-100 flex justify-between items-center">
          <span>Inquiry Message</span>
          <span className="text-sm font-normal text-gray-500">
            {selectedInquiry?.created_at && new Date(selectedInquiry.created_at).toLocaleString()}
          </span>
        </DialogTitle>
        <DialogContent dividers>
          <div className="space-y-4 pt-2">
            <div>
              <span className="font-semibold text-gray-700">From: </span>
              <span className="text-gray-900">{selectedInquiry?.name} ({selectedInquiry?.email})</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Subject: </span>
              <span className="text-gray-900">{selectedInquiry?.subject}</span>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <span className="font-semibold text-gray-700 block mb-2">Message: </span>
              <p className="text-gray-800 whitespace-pre-wrap bg-gray-50 p-4 rounded-md border border-gray-100">
                {selectedInquiry?.message}
              </p>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateAccount} variant="contained" color="primary">
            Create Account
          </Button>
          <Button onClick={handleClose} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
