"use client";

import { useEffect, useState } from "react";
import { Badge } from "@mui/material";
import { API_BASE_URL } from "@/lib/api";
import { Mail } from "lucide-react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { ProjectsTable } from "@/components/ProjectsTable";
import { MaterialsTable } from "@/components/MaterialsTable";
import { EquipmentsTable } from "@/components/EquipmentsTable";
import { InquiriesList } from "@/components/InquiriesList";

export default function DashboardPage() {
  const [user, setUser] = useState("");
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    setUser(localStorage.getItem("user"));
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      window.location.href = "/login";
    }
  }, []);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleOpenAdd = () => {
    setOpenAddModal(true);
  };

  const handleCloseAdd = () => {
    setOpenAddModal(false);
  };

  const handleInputChange = (e) => {
    setNewAccount({
      ...newAccount,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddAccount = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/create.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAccount),
      });
      if (response.ok) {
        handleCloseAdd();
      } else {
        const error = await response.json();
        alert(error.message || "Failed to add account");
      }
    } catch (error) {
      console.error("Error adding account:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-6 space-y-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-gray-900 capitalize">{user} Dashboard</h1>
        {user === "admin" && (
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
            <span className="text-sm font-medium text-gray-700">Messages:</span>
            <Badge badgeContent={unreadMessages} color="error" max={99}>
              <Mail className="text-gray-600" size={24} />
            </Badge>
          </div>
        )}
      </div>

      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <ProjectsTable user={user} />
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <MaterialsTable user={user} />
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <EquipmentsTable user={user} />
        </section>
      </div>

      {user === "admin" && (
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-8">
          <InquiriesList openModal={handleOpenAdd} setNewAccount={setNewAccount} user={user} onUnreadCountChange={setUnreadMessages} />
        </section>
      )}
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
              disabled
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
              disabled
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
                disabled
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
    </div>
  );
}
