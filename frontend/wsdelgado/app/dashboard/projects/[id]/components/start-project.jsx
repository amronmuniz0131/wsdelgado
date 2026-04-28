import { useState, useEffect } from 'react';
import {
    Paper,
    Button,
    Typography,
    Box,
    CircularProgress,
    Grid,
    Card,
    CardContent,
    Chip,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
} from "@mui/material";
import { API_BASE_URL } from "@/lib/api";
import { SuccessToast, DangerToast } from "@/components/useToast";


export default function StartProject({ project, setProject }) {
    const [endDate, setEndDate] = useState("");

    const handleStart = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/projects/update.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: project.id,
                    start_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
                    end_date: endDate,
                }),
            });

            if (response.ok) {
                SuccessToast("Project started successfully!");
                window.location.reload();
                // fetchProject();
            } else {
                const error = await response.json();
                DangerToast(`Failed to start project: ${error.message}`);
            }
        } catch (error) {
            console.error("Error starting project:", error);
            DangerToast("An error occurred while starting the project.");
        }
    }
    const [isOpen, setOpen] = useState(false)
    const user = localStorage.getItem('user')
    return (
        <div>
            {user === "engineer" && (
                <Button variant="contained" onClick={() => setOpen(true)}>Start Project</Button>
            )}
            <Dialog
                open={isOpen}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ className: "rounded-2xl" }}
            >
                <DialogTitle className="font-bold text-gray-800 border-b border-gray-100 pb-4">
                    Start Project
                </DialogTitle>
                <DialogContent className="pt-6 space-y-4">
                    <TextField
                        label="End Date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        fullWidth
                        required
                    />
                </DialogContent>
                <DialogActions className="p-4 border-t border-gray-100">
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={() => handleStart()}>Start Project</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
