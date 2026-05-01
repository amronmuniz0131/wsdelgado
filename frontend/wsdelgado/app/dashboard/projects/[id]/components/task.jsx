import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import { SuccessToast, DangerToast } from "@/components/useToast";

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
export function TaskModal(props) {
    const [tasks, setTasks] = useState([]);
    const [taskData, setTaskData] = useState({
        employee_id: [],
        task_id: props.selectedTask?.id
    })
    const handleChange = (event) => {
        const { target: { value } } = event;
        setTaskData({ ...taskData, employee_id: typeof value === 'string' ? value.split(',') : value })
    }
    const [employees, setEmployees] = useState([])
    const fetchEmployees = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/employees`);
            const data = await response.json();
            setEmployees(data.records || []);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                task_id: props.selectedTask?.id,
                employee_id: taskData.employee_id
            };
            const response = await fetch(`${API_BASE_URL}/assign`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            const result = await response.json();
            if (response.ok) {
                SuccessToast("Employees assigned successfully!");
                props.handleClose();
            } else {
                DangerToast(`Error: ${result.message}`);
            }
            const res = await fetch(`${API_BASE_URL}/tasks/${props.selectedTask?.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: props.selectedTask?.id,
                    status: 1,
                    start_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
                }),
            });
            window.location.reload();
        } catch (error) {
            console.error("Error creating task:", error);
        }
    }
    useEffect(() => {
        setTaskData({ ...taskData, employee_id: [] })
        fetchEmployees();
    }, [props.isOpen])
    return (
        <Dialog
            open={props.isOpen}
            onClose={props.handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{ className: "rounded-2xl" }}
        >
            <DialogTitle className="font-bold text-gray-800 border-b border-gray-100 pb-4">
                Assign Task for: {props.selectedTask?.name}
            </DialogTitle>
            <DialogContent className="pt-6 space-y-4">
                <FormControl fullWidth variant="outlined">
                    <InputLabel>Employee Name</InputLabel>
                    <Select
                        multiple
                        value={taskData.employee_id || []}
                        onChange={handleChange}
                        label="Employee Name"
                        renderValue={(selected) =>
                            selected.map(id => employees.find(emp => emp.id === id)?.name || id).join(', ')
                        }
                    >
                        {employees
                            .filter(emp =>
                                (emp.position?.toLowerCase() !== "engineer" && emp.position?.toLowerCase() !== "foreman" && emp.position?.toLowerCase() !== "admin" && emp.project_id_task === null) ||
                                emp.is_finished !== 0
                            )
                            .map((employee, index) => (
                                employee.position.toLowerCase() !== 'engineer' &&
                                employee.position.toLowerCase() !== 'foreman' &&
                                employee.position.toLowerCase() !== 'admin' && (
                                    <MenuItem key={index + '-employee'} value={employee.id}>
                                        {employee.name} ({employee.position})
                                    </MenuItem>
                                )
                            ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions className="p-4 border-t border-gray-100">
                <Button variant="outlined" onClick={() => { handleSubmit() }}>Submit</Button>
            </DialogActions>
        </Dialog>
    )
}
