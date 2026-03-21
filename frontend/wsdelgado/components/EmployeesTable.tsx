"use client";

import React, { useState } from 'react';
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
} from '@mui/material';
import { Plus } from 'lucide-react';
import CircularProgress from '@mui/material/CircularProgress';

interface Employee {
    id: string;
    employeeId: string;
    name: string;
    position: string;
    progress: number;
}

const initialEmployees: Employee[] = [
    {
        id: '1',
        employeeId: 'EMP-001',
        name: 'John Smith',
        position: 'Foreman',
        progress: 75,
    },
    {
        id: '2',
        employeeId: 'EMP-002',
        name: 'Alice Johnson',
        position: 'Civil Engineer',
        progress: 40,
    },
];

export function EmployeesTable() {
    const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
    const [open, setOpen] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        employeeId: '',
        name: '',
        position: '',
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setNewEmployee({ employeeId: '', name: '', position: '' });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewEmployee((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddEmployee = () => {
        const employee: Employee = {
            id: Math.random().toString(36).substr(2, 9),
            progress: 0,
            ...newEmployee,
        };
        setEmployees([...employees, employee]);
        handleClose();
    };

    return (
        <Box className="w-full">
            <Box className="flex justify-between items-center mb-4">
                <Typography variant="h6" component="h2" className="text-gray-800 font-semibold">
                    Employees List
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Plus size={18} />}
                    onClick={handleOpen}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    Add Employee
                </Button>
            </Box>

            <TableContainer component={Paper} className="shadow-sm border border-gray-200">
                <Table sx={{ minWidth: 650 }} aria-label="employees table">
                    <TableHead className="bg-gray-50">
                        <TableRow>
                            <TableCell className="font-semibold text-gray-600">Employee ID</TableCell>
                            <TableCell className="font-semibold text-gray-600">Name</TableCell>
                            <TableCell className="font-semibold text-gray-600">Position</TableCell>
                            <TableCell className="font-semibold text-gray-600">Progress</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employees.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <TableCell component="th" scope="row" className="font-medium">
                                    {row.employeeId}
                                </TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.position}</TableCell>
                                <TableCell>
                                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                        <CircularProgress variant="determinate" value={row.progress} />
                                        <Box
                                            sx={{
                                                top: 0,
                                                left: 0,
                                                bottom: 0,
                                                right: 0,
                                                position: 'absolute',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Typography
                                                variant="caption"
                                                component="div"
                                                sx={{ color: 'text.secondary', fontSize: '0.65rem' }}
                                            >{`${row.progress}%`}</Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                        {employees.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center" className="py-8 text-gray-500">
                                    No employees found. Click "Add Employee" to create one.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add Employee Modal */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle className="font-bold text-gray-800 border-b border-gray-100 mb-4">
                    Add New Employee
                </DialogTitle>
                <DialogContent>
                    <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <TextField
                            autoFocus
                            margin="dense"
                            name="employeeId"
                            label="Employee ID"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={newEmployee.employeeId}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="dense"
                            name="name"
                            label="Name"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={newEmployee.name}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="dense"
                            name="position"
                            label="Position"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={newEmployee.position}
                            onChange={handleInputChange}
                            className="col-span-1 md:col-span-2"
                        />
                    </Box>
                </DialogContent>
                <DialogActions className="p-4 border-t border-gray-100">
                    <Button onClick={handleClose} color="inherit" className="text-gray-600 hover:bg-gray-100">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddEmployee}
                        variant="contained"
                        color="primary"
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={!newEmployee.employeeId || !newEmployee.name || !newEmployee.position}
                    >
                        Add Employee
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
