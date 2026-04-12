"use client";

import React, { useState } from "react";
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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { Plus, Eye, Pencil, UserRound, Mail, Shield, ShieldCheck, UserCheck, Key, Trash2 } from "lucide-react";

export function AccountsTable() {
  const [accounts, setAccounts] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [newAccount, setNewAccount] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/read.php`);
      const data = await response.json();
      setAccounts(data.records || []);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAccounts();
  }, []);

  const handleOpenAdd = () => setOpenAddModal(true);
  const handleCloseAdd = () => {
    setOpenAddModal(false);
    setNewAccount({
      name: "",
      email: "",
      password: "",
      role: "user",
    });
  };

  const handleOpenEdit = (account) => {
    setEditingAccount({
      ...account,
      password: "", // Reset password field for security/clarity
    });
    setOpenEditModal(true);
  };

  const handleCloseEdit = () => {
    setOpenEditModal(false);
    setEditingAccount(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAccount((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingAccount((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAccount = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/create.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAccount),
      });
      if (response.ok) {
        fetchAccounts();
        handleCloseAdd();
      } else {
        const error = await response.json();
        alert(error.message || "Failed to add account");
      }
    } catch (error) {
      console.error("Error adding account:", error);
    }
  };

  const handleUpdateAccount = async () => {
    try {
      // Remove password if empty to not update it
      const payload = { ...editingAccount };
      if (!payload.password) delete payload.password;

      const response = await fetch(`${API_BASE_URL}/update.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        fetchAccounts();
        handleCloseEdit();
      } else {
        const error = await response.json();
        alert(error.message || "Failed to update account");
      }
    } catch (error) {
      console.error("Error updating account:", error);
    }
  };

  const handleDeleteAccount = async (id) => {
    if (!window.confirm("Are you sure you want to delete this account? This action cannot be undone.")) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/delete.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        fetchAccounts();
      } else {
        const error = await response.json();
        alert(error.message || "Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "error";
      case "engineer":
        return "primary";
      case "user":
        return "success";
      default:
        return "default";
    }
  };

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return <ShieldCheck size={14} className="mr-1" />;
      case "engineer":
        return <Shield size={14} className="mr-1" />;
      case "user":
        return <UserCheck size={14} className="mr-1" />;
      default:
        return null;
    }
  };

  return (
    <Box className="w-full">
      {/* Header section with gradient background */}
      <Box className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-xl border border-slate-700">
        <Box className="mb-4 md:mb-0">
          <Typography
            variant="h4"
            className="text-white font-bold tracking-tight mb-1 flex items-center gap-2"
          >
            <UserRound className="text-blue-400" /> Account Management
          </Typography>
          <Typography variant="body2" className="text-slate-400 font-medium">
            Create and manage administrative and user access levels
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 normal-case px-6 py-2.5 rounded-xl shadow-lg transition-all transform hover:scale-105"
        >
          Create New Account
        </Button>
      </Box>

      {/* Main Table Section */}
      <TableContainer
        component={Paper}
        className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100"
      >
        <Table sx={{ minWidth: 650 }} aria-label="accounts table">
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableCell className="font-bold text-gray-700 py-4">USER</TableCell>
              <TableCell className="font-bold text-gray-700 py-4">EMAIL</TableCell>
              <TableCell className="font-bold text-gray-700 py-4">ROLE</TableCell>
              <TableCell className="font-bold text-gray-700 py-4">CREATED AT</TableCell>
              <TableCell className="font-bold text-gray-700 py-4 text-center">ACTION</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map((row) => (
              <TableRow
                key={row.id}
                className="hover:bg-blue-50/30 transition-all group"
              >
                <TableCell className="py-4">
                  <Box className="flex items-center gap-3">
                    <Avatar className="bg-gradient-to-br from-slate-700 to-slate-900 shadow-md">
                      {row.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                        {row.name}
                      </Typography>
                      <Typography variant="caption" className="text-gray-400">
                        ID: #{row.id}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell className="py-4">
                  <Box className="flex items-center gap-2 text-gray-600">
                    <Mail size={14} className="text-gray-400" />
                    <Typography variant="body2" className="font-medium">
                      {row.email}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell className="py-4">
                  <Chip
                    icon={getRoleIcon(row.role)}
                    label={row.role?.toUpperCase() || "USER"}
                    color={getRoleColor(row.role)}
                    size="small"
                    className="font-bold text-[10px] tracking-widest px-1"
                  />
                </TableCell>
                <TableCell className="py-4 font-medium text-gray-500 text-sm">
                  {row.created_at ? new Date(row.created_at).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell className="py-4 text-center">
                  <Box className="flex justify-center gap-1">
                    <Tooltip title="Edit Account">
                      <IconButton 
                        size="small" 
                        className="text-amber-500 hover:bg-amber-100 transition-colors"
                        onClick={() => handleOpenEdit(row)}
                      >
                        <Pencil size={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Account">
                      <IconButton 
                        size="small" 
                        className="text-rose-500 hover:bg-rose-100 transition-colors"
                        onClick={() => handleDeleteAccount(row.id)}
                      >
                        <Trash2 size={18} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && accounts.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  className="py-16 text-gray-500"
                >
                  <Box className="flex flex-col items-center gap-2 opacity-60">
                    <UserRound size={48} className="text-gray-300" />
                    <Typography variant="h6">No Accounts Found</Typography>
                    <Typography variant="body2">Start by creating your first system account.</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Account Modal */}
      <Dialog open={openAddModal} onClose={handleCloseAdd} maxWidth="sm" fullWidth PaperProps={{ className: "rounded-3xl" }}>
        <DialogTitle className="font-extrabold text-2xl text-gray-800 px-8 pt-8">
          Create New Account
          <Typography className="text-gray-500 font-normal mt-1 border-b pb-4">Assign credentials and roles for new users</Typography>
        </DialogTitle>
        <DialogContent className="px-8 pb-4">
          <Box className="flex flex-col gap-4 mt-6">
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Full Name"
              fullWidth
              variant="outlined"
              value={newAccount.name}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="email"
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
              value={newAccount.email}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="password"
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              value={newAccount.password}
              onChange={handleInputChange}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Account Role</InputLabel>
              <Select
                name="role"
                value={newAccount.role}
                label="Account Role"
                onChange={handleInputChange}
              >
                <MenuItem value="admin">Administrator</MenuItem>
                <MenuItem value="engineer">Engineer</MenuItem>
                <MenuItem value="user">Standard User</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions className="p-8 pt-2">
          <Button onClick={handleCloseAdd} className="text-gray-500 font-bold">Cancel</Button>
          <Button
            onClick={handleAddAccount}
            variant="contained"
            className="bg-blue-600 hover:bg-blue-700 font-bold px-8 py-2.5 rounded-xl shadow-md"
            disabled={!newAccount.name || !newAccount.email || !newAccount.password}
          >
            Create Account
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Account Modal */}
      <Dialog open={openEditModal} onClose={handleCloseEdit} maxWidth="sm" fullWidth PaperProps={{ className: "rounded-3xl" }}>
        <DialogTitle className="font-extrabold text-2xl text-gray-800 px-8 pt-8">
          Update Account
          <Typography className="text-gray-500 font-normal mt-1 border-b pb-4">Modify user details and access privileges</Typography>
        </DialogTitle>
        <DialogContent className="px-8 pb-4">
          {editingAccount && (
            <Box className="flex flex-col gap-4 mt-6">
              <TextField
                margin="dense"
                name="name"
                label="Full Name"
                fullWidth
                variant="outlined"
                value={editingAccount.name}
                onChange={handleEditInputChange}
              />
              <TextField
                margin="dense"
                name="email"
                label="Email Address"
                type="email"
                fullWidth
                variant="outlined"
                value={editingAccount.email}
                onChange={handleEditInputChange}
              />
              <Box className="bg-amber-50 p-4 rounded-xl border border-amber-100 mt-2">
                <Typography variant="caption" className="text-amber-700 font-bold flex items-center gap-1 mb-2">
                  <Key size={14} /> SECURITY UPGRADE
                </Typography>
                <TextField
                  margin="dense"
                  name="password"
                  label="New Password"
                  type="password"
                  placeholder="Leave blank to keep current"
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={editingAccount.password}
                  onChange={handleEditInputChange}
                  className="bg-white"
                />
              </Box>
              <FormControl fullWidth margin="dense">
                <InputLabel>Account Role</InputLabel>
                <Select
                  name="role"
                  value={editingAccount.role}
                  label="Account Role"
                  onChange={handleEditInputChange}
                >
                  <MenuItem value="admin">Administrator</MenuItem>
                  <MenuItem value="engineer">Engineer</MenuItem>
                  <MenuItem value="user">Standard User</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions className="p-8 pt-2">
          <Button onClick={handleCloseEdit} className="text-gray-500 font-bold">Cancel</Button>
          <Button
            onClick={handleUpdateAccount}
            variant="contained"
            className="bg-amber-500 hover:bg-amber-600 font-bold px-8 py-2.5 rounded-xl text-white shadow-md"
            disabled={!editingAccount?.name || !editingAccount?.email}
          >
            Update Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
