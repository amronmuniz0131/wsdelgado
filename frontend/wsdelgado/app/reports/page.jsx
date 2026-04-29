"use client";

import { DataGrid } from "@mui/x-data-grid";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { API_BASE_URL } from "@/lib/api";

import {
  Download,
  TrendingUp,
  Users,
  HardHat,
  Package,
  FileText,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";

// API data will be used instead of mock constants

const ProjectComparisonChart = ({ projects }) => {
  const [hiddenSeries, setHiddenSeries] = useState([]);

  const toggleSeries = (id) => {
    setHiddenSeries((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const chartData = projects.filter(p => !hiddenSeries.includes(p.id));

  return (
    <Box className="flex flex-col md:flex-row gap-6 w-full h-[400px]">
      <Box className="flex-1 min-w-0">
        <BarChart
          xAxis={[
            {
              data: chartData.map(p => p.name),
              scaleType: "band",
              tickLabelStyle: { fontSize: 10, fontWeight: 600, fill: "#94a3b8" },
            },
          ]}
          yAxis={[
            {
              tickLabelStyle: { fontSize: 11, fontWeight: 600, fill: "#94a3b8" },
              valueFormatter: (value) => `${value}%`,
              max: 100
            },
          ]}
          series={[
            {
              data: chartData.map(p => parseInt(p.progress || 0)),
              label: "Overall Progress",
              color: "#2563eb",
            }
          ]}
          height={380}
          margin={{ left: 50, right: 20, top: 20, bottom: 60 }}
          slotProps={{
            legend: { hidden: true },
          }}
        />
      </Box>

      {/* Custom Scrollable Legend Sidebar */}
      <Box className="w-full md:w-64 flex flex-col border border-gray-100 rounded-2xl bg-gray-50/50 overflow-hidden shrink-0">
        <Box className="p-3 border-b border-gray-100 bg-white">
          <Typography className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center">
            Toggle Projects ({projects.length - hiddenSeries.length}/{projects.length})
          </Typography>
        </Box>
        <Box className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {projects.map((project) => {
            const isHidden = hiddenSeries.includes(project.id);
            return (
              <Box
                key={project.id}
                onClick={() => toggleSeries(project.id)}
                className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${isHidden
                  ? "opacity-40 grayscale hover:grayscale-0 hover:opacity-70 bg-transparent"
                  : "bg-white shadow-sm hover:shadow-md border border-gray-200"
                  }`}
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: "#2563eb" }}
                ></div>
                <Typography
                  className={`text-xs font-bold truncate ${isHidden ? "text-gray-400" : "text-gray-700"
                    }`}
                >
                  {project.name}
                </Typography>
              </Box>
            );
          })}
        </Box>

        <Box className="p-3 bg-white border-t border-gray-100 flex justify-center gap-2">
          <Button
            size="small"
            variant="text"
            className="text-[10px] font-bold text-blue-600 hover:bg-blue-50 capitalize"
            onClick={() => setHiddenSeries([])}
          >
            Show All
          </Button>
          <Button
            size="small"
            variant="text"
            className="text-[10px] font-bold text-gray-500 hover:bg-gray-50 capitalize"
            onClick={() => setHiddenSeries(projects.map(p => p.id))}
          >
            Hide All
          </Button>
        </Box>

      </Box>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </Box>
  );
};

import RoleProtectedRoute from "@/components/RoleProtectedRoute";

export default function ReportsPage() {
  return (
    <RoleProtectedRoute allowedRoles={["admin"]}>
      <ReportsContent />
    </RoleProtectedRoute>
  );
}

function ReportsContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [projects, setProjects] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    if (!auth) {
      window.location.href = "/login";
    } else {
      setIsAuthenticated(true);
      fetchAllData();
    }
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [projRes, equipRes, matRes, empRes, assignRes, reqRes] = await Promise.all([
        fetch(`${API_BASE_URL}/projects`),
        fetch(`${API_BASE_URL}/equipments`),
        fetch(`${API_BASE_URL}/materials`),
        fetch(`${API_BASE_URL}/employees`),
        fetch(`${API_BASE_URL}/assign`),
        fetch(`${API_BASE_URL}/requests`),
      ]);

      const [projData, equipData, matData, empData, assignData, reqData] = await Promise.all([
        projRes.json(),
        equipRes.json(),
        matRes.json(),
        empRes.json(),
        assignRes.json(),
        reqRes.json(),
      ]);

      setProjects(projData.records || []);
      setEquipments(equipData.records || []);
      setMaterials(matData.records || []);
      setEmployees(empData.records || []);
      setAssignments(assignData?.records || []);
      setRequests(reqData.records || []);
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const equipmentColumns = [
    { field: "name", headerName: "Machine", flex: 1, minWidth: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => (
        <Box className="flex items-center h-full">
          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${params.value === 'In Use' ? 'bg-blue-100 text-blue-700' : params.value === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
            {params.value}
          </span>
        </Box>
      )
    },
    { field: "type", headerName: "Type", flex: 1 }
  ];

  const materialColumns = [
    { field: "name", headerName: "Item", flex: 1, minWidth: 150 },
    { field: "quantity", headerName: "Qty", width: 120, valueGetter: (value, row) => `${row.quantity} ${row.unit}` },
    {
      field: "stock_status",
      headerName: "Stock",
      width: 130,
      renderCell: (params) => {
        const row = params.row;
        const ratio = row.quantity / row.max_stock;
        return (
          <Box className="flex items-center h-full">
            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${ratio >= 0.2 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
              {ratio >= 0.2 ? 'In Stock' : ratio == 0 ? 'Out of Stock' : 'Low Stock'}
            </span>
          </Box>
        );
      }
    }
  ];

  const projectAssignColumns = [
    { field: "project_name", headerName: "Project", flex: 1, minWidth: 180, renderCell: (params) => <Typography className="font-medium text-blue-600 h-full flex items-center text-xs">{params.value || "N/A"}</Typography> },
    { field: "task_name", headerName: "Task", flex: 1, minWidth: 150, renderCell: (params) => <Typography className="h-full flex items-center text-xs">{params.value}</Typography> },
    { field: "employee_name", headerName: "Assigned To", flex: 1, minWidth: 150, renderCell: (params) => <Typography className="h-full flex items-center text-xs">{params.value}</Typography> },
    { field: "created_at", headerName: "Date", width: 120, renderCell: (params) => <Typography className="text-gray-400 text-[10px] h-full flex items-center">{new Date(params.value).toLocaleDateString()}</Typography> }
  ];

  const employeeAssignColumns = [
    { field: "employee_name", headerName: "Employee", flex: 1, minWidth: 150, renderCell: (params) => <Typography className="font-bold h-full flex items-center text-xs">{params.value}</Typography> },
    { field: "project_name", headerName: "Project", flex: 1, minWidth: 180, renderCell: (params) => <Typography className="text-gray-600 h-full flex items-center text-xs">{params.value || "N/A"}</Typography> },
    { field: "task_name", headerName: "Task Assigned", flex: 1, minWidth: 150, renderCell: (params) => <Typography className="text-blue-600 font-medium h-full flex items-center text-xs">{params.value}</Typography> }
  ];

  const requestColumns = [
    { field: "project_name", headerName: "Project Site", flex: 1, minWidth: 180, renderCell: (params) => <Typography className="font-bold text-gray-800 h-full flex items-center text-xs">{params.value}</Typography> },
    { field: "material_name", headerName: "Material Item", flex: 1, minWidth: 150, renderCell: (params) => <Typography className="h-full flex items-center text-xs">{params.value}</Typography> },
    { field: "quantity", headerName: "Qty", width: 80, align: 'center', headerAlign: 'center', renderCell: (params) => <Typography className="font-bold text-blue-600 h-full flex items-center justify-center text-xs">{params.value}</Typography> },
    { field: "engineer_name", headerName: "Requested By", flex: 1, minWidth: 150, renderCell: (params) => <Typography className="text-gray-600 text-[10px] h-full flex items-center">{params.value}</Typography> },
    {
      field: "is_approve",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Box className="flex items-center h-full">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${params.value === 'Approve' ? 'bg-green-100 text-green-700' : params.value === 'Reject' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
            {params.value || "Pending"}
          </span>
        </Box>
      )
    },
    { field: "request_date", headerName: "Date", width: 120, renderCell: (params) => <Typography className="text-gray-400 text-[10px] h-full flex items-center">{new Date(params.value).toLocaleDateString()}</Typography> }
  ];

  const downloadTableAsCSV = (data, filename) => {
    if (!data || !data.length) return;
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row) => Object.values(row).join(",")).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) return null;

  return (
    <Box className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Header Section */}
      <Box className="bg-white border-b border-gray-200 px-6 py-10 mb-8 shadow-sm">
        <Box className="w-full mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Box>
            <Typography variant="h4" className="font-bold text-gray-900 flex items-center gap-3">
              <FileText className="text-blue-600" size={32} />
              Operational Report
            </Typography>
            <Typography variant="body1" className="text-gray-500 mt-1">
              Comprehensive overview of projects, assets, and performance analytics.
            </Typography>
          </Box>
          <Box className="flex gap-3">
            <Button
              variant="contained"
              startIcon={<Download size={18} />}
              className="bg-blue-600 hover:bg-blue-700 capitalize py-2.5 px-6 rounded-xl shadow-md"
              onClick={() => {
                downloadTableAsCSV(projects, "all_reports_summary");
              }}
            >
              Export Full Report
            </Button>
          </Box>
        </Box>
      </Box>

      <Box className="mx-auto px-6">
        {/* Stats Grid */}
        <Grid container spacing={3} className="mb-8 w-full">
          {[
            { label: "Active Projects", value: projects.length, icon: TrendingUp, color: "bg-blue-50 text-blue-600 border-blue-100" },
            { label: "Machinery in Use", value: equipments.filter(e => e.status === "In Use").length, icon: HardHat, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
            { label: "Stock Alerts", value: materials.filter(m => (m.quantity / m.max_stock) < 0.2).length, icon: Package, color: "bg-amber-50 text-amber-600 border-amber-100" },
            { label: "Total Workforce", value: employees.length, icon: Users, color: "bg-violet-50 text-violet-600 border-violet-100" },
          ].map((stat, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card className="border-0 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`p-3 rounded-xl border ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                  <div>
                    <Typography variant="body2" className="text-gray-500 font-medium">
                      {stat.label}
                    </Typography>
                    <Typography variant="h5" className="font-bold text-gray-900">
                      {stat.value}
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Yearly Growth Comparison Chart */}
        <Grid container spacing={3} className="mb-8 w-full">
          <Grid item xs={12} className="w-full">
            <Paper className="p-8 rounded-3xl shadow-sm border border-gray-100 bg-white">
              <Box className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <Box>
                  <Typography variant="h6" className="font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp size={24} className="text-blue-600" />
                    Yearly Project Progress Velocity
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    Comparative monthly completion rates for major engineering sites.
                  </Typography>
                </Box>
                <Box className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                  <Typography variant="caption" className="text-blue-700 font-bold uppercase tracking-wider">Live FY2026 Tracking</Typography>
                </Box>
              </Box>

              <ProjectComparisonChart projects={projects} />
            </Paper>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} className="mb-8 w-full">
          {/* Project Progress Chart (Custom SVG/CSS) */}
          {/* <Grid item xs={12} lg={4}>
            <Paper className="p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
              <Box className="flex items-center justify-between mb-8">
                <Typography variant="h6" className="font-bold text-gray-800 flex items-center gap-2">
                  <BarChart3 size={20} className="text-blue-500" />
                  Project Deliverables & Progress
                </Typography>
              </Box>

              <Box className="space-y-6">
                {projects.slice(0, 5).map((project) => (
                  <Box key={project.id}>
                    <Box className="flex justify-between mb-2">
                      <Typography variant="body2" className="font-semibold text-gray-700">{project.name}</Typography>
                      <Typography variant="body2" className="font-bold text-blue-600">{project.progress}%</Typography>
                    </Box>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full transition-all duration-1000 ease-out rounded-full"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid> */}
          {/* Employee Efficiency Chart (Custom SVG/CSS) */}
          <Grid item xs={12} lg={4}>
            <Paper className="p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
              <Box className="flex items-center justify-between mb-6">
                <Typography variant="h6" className="font-bold text-gray-800 flex items-center gap-2">
                  <Users size={20} className="text-violet-500" />
                  Team Efficiency Scores
                </Typography>
              </Box>

              <Box className="flex flex-col items-center justify-center py-4">
                <Box className="relative w-48 h-48 flex items-center justify-center mb-6">
                  {/* Circular Progress Representation */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96" cy="96" r="80"
                      stroke="#F1F5F9" strokeWidth="12" fill="transparent"
                    />
                    <circle
                      cx="96" cy="96" r="80"
                      stroke="#8B5CF6" strokeWidth="12" fill="transparent"
                      strokeDasharray="502.4"
                      strokeDashoffset={502.4 * (1 - 0.84)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <Box className="absolute flex flex-col items-center">
                    <Typography variant="h3" className="font-bold text-gray-900">84%</Typography>
                    <Typography variant="caption" className="text-violet-600 font-bold tracking-wider">AVERAGE</Typography>
                  </Box>
                </Box>

                <Box className="w-full space-y-4 px-2">
                  {employees.slice(0, 4).map((emp, i) => (
                    <Box key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <Box className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold text-xs">
                          {emp.name.charAt(0)}
                        </div>
                        <Typography variant="body2" className="font-medium text-gray-700">{emp.name}</Typography>
                      </Box>
                      <Box className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-700`}>
                          {emp.position}
                        </span>
                        <Typography variant="body2" className="font-bold text-gray-900">{emp.status}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} lg={7}>
            <Card className="rounded-2xl w-full shadow-sm border border-gray-100 overflow-hidden">
              <Box className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                <Typography variant="h6" className="font-bold text-gray-800">Projects Detailed Report</Typography>
                <Button
                  size="small"
                  startIcon={<Download size={14} />}
                  className="text-blue-600 hover:bg-blue-50 capitalize"
                  onClick={() => downloadTableAsCSV(projects, "projects_report")}
                >
                  Download CSV
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead className="bg-[#FBFCFE]">
                    <TableRow>
                      <TableCell className="font-bold text-gray-600">ID</TableCell>
                      <TableCell className="font-bold text-gray-600">Project Name</TableCell>
                      <TableCell className="font-bold text-gray-600">Client</TableCell>
                      <TableCell className="font-bold text-gray-600">Lead</TableCell>
                      <TableCell className="font-bold text-gray-600" align="right">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {projects.map((row) => (
                      <TableRow key={row.id} className="hover:bg-blue-50/30 transition-colors">
                        <TableCell className="text-gray-500 font-mono text-xs">#{row.id}</TableCell>
                        <TableCell><Typography className="font-semibold text-gray-800">{row.name}</Typography></TableCell>
                        <TableCell className="text-gray-600">{row.clientName || row.client}</TableCell>
                        <TableCell className="text-gray-600">{row.engineerName || row.foremanName}</TableCell>
                        <TableCell align="right">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${row.progress > 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                            {row.progress}% Complete
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
        </Grid>

        {/* Data Tables */}
        <Grid container spacing={3}>

          {/* Equipment Table */}
          <Grid item xs={12} md={6}>
            <Card className="rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
              <Box className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                <Typography variant="h6" className="font-bold text-gray-800">Equipment Usage</Typography>
                <Button
                  size="small"
                  startIcon={<Download size={14} />}
                  className="text-blue-600 hover:bg-blue-50 capitalize"
                  onClick={() => downloadTableAsCSV(equipments, "equipment_report")}
                >
                  Download
                </Button>
              </Box>
              <Box className="p-4" sx={{ height: 400, width: '100%' }}>
                <DataGrid
                  rows={equipments}
                  columns={equipmentColumns}
                  pageSizeOptions={[5, 10, 20]}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 5 } },
                  }}
                  disableRowSelectionOnClick
                  sx={{
                    border: 'none',
                    '& .MuiDataGrid-cell:focus': { outline: 'none' },
                  }}
                />
              </Box>
            </Card>
          </Grid>

          {/* Materials Table */}
          <Grid item xs={12} md={6}>
            <Card className="rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
              <Box className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                <Typography variant="h6" className="font-bold text-gray-800">Inventory Status</Typography>
                <Button
                  size="small"
                  startIcon={<Download size={14} />}
                  className="text-blue-600 hover:bg-blue-50 capitalize"
                  onClick={() => downloadTableAsCSV(materials, "materials_report")}
                >
                  Download
                </Button>
              </Box>
              <Box className="p-4" sx={{ height: 400, width: '100%' }}>
                <DataGrid
                  rows={materials}
                  columns={materialColumns}
                  pageSizeOptions={[5, 10, 20]}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 5 } },
                  }}
                  disableRowSelectionOnClick
                  sx={{
                    border: 'none',
                    '& .MuiDataGrid-cell:focus': { outline: 'none' },
                  }}
                />
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Operations Analytics Section */}
        <Typography variant="h5" className="font-bold text-gray-900 mb-6 flex items-center gap-2 mt-12">
          <HardHat className="text-orange-600" size={28} />
          Workforce & Operations Analytics
        </Typography>

        <Grid container spacing={3} className="w-full">
          {/* Assignments by Project */}
          <Grid item xs={12} lg={6}>
            <Paper className="p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
              <Typography variant="h6" className="font-bold text-gray-800 mb-4">Task Assignments by Project</Typography>
              <Box className="p-4" sx={{ height: 400, width: '100%' }}>
                <DataGrid
                  rows={assignments}
                  columns={projectAssignColumns}
                  pageSizeOptions={[5, 10, 20]}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 5 } },
                  }}
                  disableRowSelectionOnClick
                  sx={{
                    border: 'none',
                    '& .MuiDataGrid-cell:focus': { outline: 'none' },
                  }}
                />
              </Box>
            </Paper>
          </Grid>

          {/* Assignments by Employee */}
          <Grid item xs={12} lg={6}>
            <Paper className="p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
              <Typography variant="h6" className="font-bold text-gray-800 mb-4">Workload by Employee</Typography>
              <Box className="p-4" sx={{ height: 400, width: '100%' }}>
                <DataGrid
                  rows={[...assignments].sort((a, b) => (a.employee_name || "").localeCompare(b.employee_name || ""))}
                  columns={employeeAssignColumns}
                  pageSizeOptions={[5, 10, 20]}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 5 } },
                  }}
                  disableRowSelectionOnClick
                  sx={{
                    border: 'none',
                    '& .MuiDataGrid-cell:focus': { outline: 'none' },
                  }}
                />
              </Box>
            </Paper>
          </Grid>

          {/* Material Requests by Project */}
          <Grid item xs={12}>
            <Paper className="p-6 rounded-2xl shadow-sm border border-gray-100 mt-6">
              <Typography variant="h6" className="font-bold text-gray-800 mb-4">Material Requests by Project Site</Typography>
              <Box className="p-4" sx={{ height: 500, width: '100%' }}>
                <DataGrid
                  rows={requests}
                  columns={requestColumns}
                  pageSizeOptions={[10, 20, 50]}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                  }}
                  disableRowSelectionOnClick
                  sx={{
                    border: 'none',
                    '& .MuiDataGrid-cell:focus': { outline: 'none' },
                  }}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
