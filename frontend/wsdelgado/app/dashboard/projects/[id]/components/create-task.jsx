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
            <DialogContent className="pt-6 space-y-4">
                <TextField
                    label="Task Name"
                    fullWidth
                    variant="outlined"
                    value={props.taskData.name}
                    onChange={(e) => props.setTaskData({ ...props.taskData, name: e.target.value })}
                />
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={props.taskData.status}
                                onChange={(e) => props.setTaskData({ ...props.taskData, status: e.target.value })}
                                label="Status"
                            >
                                <MenuItem value="Pending">Pending</MenuItem>
                                <MenuItem value="In Progress">In Progress</MenuItem>
                                <MenuItem value="Completed">Completed</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
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
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Start Date"
                            type="date"
                            fullWidth
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            value={props.taskData.start_date}
                            onChange={(e) => props.setTaskData({ ...props.taskData, start_date: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="End Date"
                            type="date"
                            fullWidth
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            value={props.taskData.end_date}
                            onChange={(e) => props.setTaskData({ ...props.taskData, end_date: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Quantity / Details"
                            fullWidth
                            variant="outlined"
                            value={props.taskData.quantity}
                            onChange={(e) => props.setTaskData({ ...props.taskData, quantity: e.target.value })}
                        />
                    </Grid>
                </Grid>
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