import React from "react";
import {
    Button,
    CircularProgress,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";

export default function CreateTask(props) {
    return (

        <Dialog
            open={props.isTaskModalOpen}
            onClose={props.handleCloseTask}
            maxWidth="sm"
            fullWidth
            PaperProps={{ className: "rounded-2xl" }}
        >
            <DialogTitle className="font-bold text-gray-800 border-b border-gray-100 pb-4">
                Create New Task
            </DialogTitle>
            <DialogContent className="pt-6 my-4">
                <TextField
                    label="Task Name"
                    fullWidth
                    variant="outlined"
                    value={props.taskData.name}
                    onChange={(e) => props.setTaskData({ ...props.taskData, name: e.target.value })}
                />
                <div className="my-2 flex gap-2">
                    <div className="w-1/2">
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Severity</InputLabel>
                            <Select
                                value={props.taskData.severity}
                                onChange={(e) => props.setTaskData({ ...props.taskData, severity: e.target.value })}
                                label="Severity"
                            >
                                <MenuItem value={1}>Low</MenuItem>
                                <MenuItem value={2}>Medium</MenuItem>
                                <MenuItem value={3}>High</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className="w-1/2">
                        <TextField
                            label="Quantity / Details"
                            fullWidth
                            variant="outlined"
                            value={props.taskData.quantity}
                            onChange={(e) => props.setTaskData({ ...props.taskData, quantity: e.target.value })}
                        />
                    </div>
                </div>
            </DialogContent>
            <DialogActions className="p-4 border-t border-gray-100">
                <Button onClick={props.handleCloseTask} color="inherit">Cancel</Button>
                <Button
                    onClick={props.handleTaskSubmit}
                    variant="contained"
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-none"
                    disabled={props.isSubmitting || !props.taskData.name}
                >
                    {props.isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Create Task"}
                </Button>
            </DialogActions>
        </Dialog>
    )

}