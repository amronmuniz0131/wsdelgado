import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Typography,
  Box,
  Avatar,
} from "@mui/material";
import { API_BASE_URL } from "@/lib/api";
import { SuccessToast, DangerToast } from "@/components/useToast";

export default function AddMembers({ isOpen, handleClose, projectId, onUpdate }) {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAvailableEmployees();
    }
  }, [isOpen]);

  const fetchAvailableEmployees = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`);
      if (response.ok) {
        const data = await response.json();
        // Filter employees:
        // 1. Without assignedProjectId
        // 2. Not engineer or admin
        const available = (data.records || []).filter(
          (emp) =>
            !emp.assignedProjectId &&
            emp.position?.toLowerCase() !== "engineer" &&
            emp.position?.toLowerCase() !== "admin"
        );
        setEmployees(available);
      }
    } catch (error) {
      console.error("Error fetching available employees:", error);
    }
  };

  const handleAdd = async () => {
    if (!selectedEmployeeId) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${selectedEmployeeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedEmployeeId,
          assignedProjectId: projectId,
        }),
      });

      if (response.ok) {
        onUpdate();
        handleClose();
        setSelectedEmployeeId("");
        SuccessToast("Member added successfully");
      } else {
        const error = await response.json();
        DangerToast(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error adding member:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ className: "rounded-2xl shadow-2xl" }}>
      <DialogTitle className="font-extrabold text-gray-800 border-b border-gray-100 pb-4">
        Add Team Member
      </DialogTitle>
      <DialogContent className="pt-6">
        <Typography variant="body2" className="text-gray-500 mb-6">
          Search and select an available employee to join the project workforce. Only employees without current assignments are listed.
        </Typography>
        <TextField
          select
          label="Select Available Employee"
          fullWidth
          value={selectedEmployeeId}
          onChange={(e) => setSelectedEmployeeId(e.target.value)}
          variant="outlined"
          className="mt-2"
        >
          {employees.length === 0 ? (
            <MenuItem disabled>No available employees found</MenuItem>
          ) : (
            employees.map((emp) => (
              emp.position.toLowerCase() !== 'engineer' && emp.position.toLowerCase() !== 'foreman' && emp.position.toLowerCase() !== 'admin' &&
              <MenuItem key={emp.id} value={emp.id} className="py-3 px-4">
                <Box className="flex items-center gap-4">
                  <Avatar className="bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm text-sm w-9 h-9">
                    {emp.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" className="font-bold text-gray-800">{emp.name}</Typography>
                    <Typography variant="caption" className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">{emp.position}</Typography>
                  </Box>
                </Box>
              </MenuItem>

            ))
          )}
        </TextField>
      </DialogContent>
      <DialogActions className="p-6 border-t border-gray-100 bg-gray-50/50">
        <Button onClick={handleClose} className="text-gray-500 font-bold hover:bg-gray-100 px-6">Cancel</Button>
        <Button
          variant="contained"
          onClick={handleAdd}
          disabled={!selectedEmployeeId || isLoading}
          className="bg-blue-600 hover:bg-blue-700 rounded-xl px-8 font-bold shadow-none py-2.5"
        >
          {isLoading ? "Adding..." : "Add to Team"}
        </Button>
      </DialogActions>
    </Dialog >
  );
}
