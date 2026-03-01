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
    Typography,
    Box,
    Chip,
} from '@mui/material';

interface Material {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
    lastRestocked: string;
}

const initialMaterials: Material[] = [
    {
        id: '1',
        name: 'Portland Cement',
        quantity: 500,
        unit: 'bags',
        status: 'In Stock',
        lastRestocked: '2023-10-15',
    },
    {
        id: '2',
        name: 'Steel Rebar (12mm)',
        quantity: 50,
        unit: 'tons',
        status: 'Low Stock',
        lastRestocked: '2023-10-01',
    },
    {
        id: '3',
        name: 'Bricks (Standard)',
        quantity: 0,
        unit: 'pallets',
        status: 'Out of Stock',
        lastRestocked: '2023-09-20',
    },
];

const getStatusColor = (status: Material['status']) => {
    switch (status) {
        case 'In Stock':
            return 'success';
        case 'Low Stock':
            return 'warning';
        case 'Out of Stock':
            return 'error';
        default:
            return 'default';
    }
};

export function MaterialsTable() {
    const [materials] = useState<Material[]>(initialMaterials);

    return (
        <Box className="w-full">
            <Box className="mb-4">
                <Typography variant="h6" component="h2" className="text-gray-800 font-semibold">
                    Construction Materials Inventory
                </Typography>
            </Box>

            <TableContainer component={Paper} className="shadow-sm border border-gray-200">
                <Table sx={{ minWidth: 650 }} aria-label="materials table">
                    <TableHead className="bg-gray-50">
                        <TableRow>
                            <TableCell className="font-semibold text-gray-600">Item Name</TableCell>
                            <TableCell className="font-semibold text-gray-600">Quantity</TableCell>
                            <TableCell className="font-semibold text-gray-600">Unit</TableCell>
                            <TableCell className="font-semibold text-gray-600">Status</TableCell>
                            <TableCell className="font-semibold text-gray-600">Last Restocked</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {materials.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <TableCell component="th" scope="row" className="font-medium">
                                    {row.name}
                                </TableCell>
                                <TableCell>{row.quantity}</TableCell>
                                <TableCell>{row.unit}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={row.status}
                                        color={getStatusColor(row.status)}
                                        size="small"
                                        className="font-medium"
                                    />
                                </TableCell>
                                <TableCell>{row.lastRestocked}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
