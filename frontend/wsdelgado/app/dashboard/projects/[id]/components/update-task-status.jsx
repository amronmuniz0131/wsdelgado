import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { API_BASE_URL } from "@/lib/api";

export default function UpdateTaskStatus({ isOpen, handleClose, task, onUpdate }) {
  const [finished, setFinished] = useState(0);

  useEffect(() => {
    if (task) {
      setFinished(0);
    }
  }, [task, isOpen]);

  const handleSubmit = async () => {
    if (Number(finished) > Number(task?.quantity)) {
      return; // Handled by UI feedback, but adding a guard here too
    }

    const newTotal = Number(task.finished || 0) + Number(finished);

    try {
      const payload = {
        id: task.id,
        finished: newTotal,
      };

      if (newTotal === Number(task.quantity)) {
        payload.end_date = new Date().toISOString().split('T')[0];
      }

      const response = await fetch(`${API_BASE_URL}/tasks/update.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Task progress updated successfully!");
        onUpdate();
        handleClose();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const remaining = Number(task?.quantity) - Number(task?.finished);
  const isError = Number(finished) > remaining;

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="xs" fullWidth PaperProps={{ className: "rounded-2xl" }}>
      <DialogTitle className="font-bold text-gray-800 border-b border-gray-100 pb-4">
        Update Task Progress
      </DialogTitle>
      <DialogContent className="pt-6 space-y-4">
        <Typography variant="body2" className="text-gray-600 !mb-4">
          Enter the quantity finished for: <span className="font-bold text-blue-600">{task?.name}</span>
        </Typography>
        <TextField
          label="Finished Quantity"
          type="number"
          fullWidth
          value={finished}
          onChange={(e) => setFinished(e.target.value)}
          inputProps={{ min: 0 }}
          error={isError}
          helperText={isError ? `Cannot exceed remaining quantity (${remaining})` : `Remaining to finish: ${remaining}`}
          variant="outlined"
          className="mt-4"
        />
      </DialogContent>
      <DialogActions className="p-4 border-t border-gray-100">
        <Button onClick={handleClose} className="text-gray-500 font-bold">Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isError}
          className={`${isError ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700'} rounded-lg px-6`}
        >
          Update Progress
        </Button>
      </DialogActions>
    </Dialog>
  );
}
