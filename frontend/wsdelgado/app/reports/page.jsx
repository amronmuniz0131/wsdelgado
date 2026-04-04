"use client";

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

// Mock data based on existing components
const projectsData = [
  { id: "1", name: "Downtown Commercial Base", foreman: "John Smith", progress: 50, client: "Acme Corp" },
  { id: "2", name: "Riverside Residential", foreman: "Mike Davis", progress: 85, client: "Riverside Devs" },
  { id: "3", name: "Dionela Project", foreman: "Test Foreman", progress: 30, client: "Riverside Devs" },
  { id: "4", name: "Atillano Site", foreman: "Mike Jords", progress: 65, client: "Riverside Devs" },
  { id: "5", name: "Baldicano Residential", foreman: "Trial Foreman", progress: 95, client: "Riverside Devs" },
];

const equipmentData = [
  { id: "1", name: "Excavator CAT 320", status: "In Use", operator: "Tom Harris" },
  { id: "2", name: "Bulldozer D8T", status: "Available", operator: "Unassigned" },
  { id: "3", name: "Crane Tower TG-20", status: "Maintenance", operator: "N/A" },
];

const materialsData = [
  { id: "1", name: "Portland Cement", quantity: 500, unit: "bags", status: "In Stock" },
  { id: "2", name: "Steel Rebar (12mm)", quantity: 50, unit: "tons", status: "Low Stock" },
  { id: "3", name: "Bricks (Standard)", quantity: 0, unit: "pallets", status: "Out of Stock" },
];

const employeeEfficiency = [
  { name: "John Smith", efficiency: 92, status: "Peak" },
  { name: "Alice Johnson", efficiency: 88, status: "High" },
  { name: "Mike Davis", efficiency: 75, status: "Stable" },
  { name: "Tom Harris", efficiency: 82, status: "High" },
];

const yearlyProgressData = [
  {
    name: "Downtown Commercial",
    color: "#2563eb",
    data: [5, 12, 18, 28, 35, 42, 50, 58, 65, 78, 88, 100]
  },
  {
    name: "Riverside Residential",
    color: "#10b981",
    data: [2, 8, 15, 22, 30, 45, 55, 62, 70, 75, 82, 90]
  },
  {
    name: "Atillano Site",
    color: "#f59e0b",
    data: [0, 2, 6, 7, 9, 10, 18, 25, 32, 40, 45, 75]
  },
  {
    name: "Baldicano North",
    color: "#6366f1",
    data: [10, 18, 25, 30, 40, 50, 55, 60, 68, 72, 85, 95]
  },
  {
    name: "Sector 7 Expansion",
    color: "#ec4899",
    data: [0, 5, 8, 12, 15, 20, 25, 30, 38, 45, 50, 60]
  },
  {
    name: "Cityville Bridge",
    color: "#8b5cf6",
    data: [0, 0, 5, 10, 18, 25, 35, 42, 50, 60, 75, 85]
  },
  {
    name: "Oceanic Port",
    color: "#06b6d4",
    data: [20, 25, 32, 40, 45, 50, 58, 62, 70, 78, 85, 90]
  },
  {
    name: "Metro Subway Ph. 1",
    color: "#ef4444",
    data: [5, 8, 10, 12, 18, 22, 28, 32, 38, 42, 48, 55]
  },
  {
    name: "Industrial Zone C",
    color: "#14b8a6",
    data: [0, 10, 20, 35, 50, 65, 80, 90, 100, 100, 100, 100]
  },
  {
    name: "Greenbelt Park",
    color: "#f97316",
    data: [15, 22, 30, 38, 45, 52, 60, 70, 80, 85, 92, 98]
  },
  {
    name: "Lakeside Marina",
    color: "#d946ef",
    data: [5, 12, 15, 18, 22, 28, 30, 35, 42, 50, 55, 65]
  },
  {
    name: "Highland Hospital",
    color: "#84cc16",
    data: [0, 0, 10, 22, 35, 48, 60, 72, 81, 88, 94, 100]
  },
  {
    name: "Tech Park Plaza",
    color: "#71717a",
    data: [8, 15, 22, 28, 35, 40, 45, 52, 58, 65, 70, 80]
  }
];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const ProjectComparisonChart = () => {
  const [hiddenSeries, setHiddenSeries] = useState([]);

  const toggleSeries = (name) => {
    setHiddenSeries((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  return (
    <Box className="flex flex-col md:flex-row gap-6 w-full h-[400px]">
      <Box className="flex-1 min-w-0">
        <LineChart
          xAxis={[
            {
              data: months,
              scaleType: "point",
              tickLabelStyle: { fontSize: 11, fontWeight: 600, fill: "#94a3b8" },
            },
          ]}
          yAxis={[
            {
              tickLabelStyle: { fontSize: 11, fontWeight: 600, fill: "#94a3b8" },
              valueFormatter: (value) => `${value}%`,
            },
          ]}
          series={yearlyProgressData
            .filter((p) => !hiddenSeries.includes(p.name))
            .map((project) => ({
              data: project.data,
              label: project.name,
              color: project.color,
              showMark: true,
            }))}
          height={380}
          margin={{ left: 50, right: 20, top: 20, bottom: 40 }}
          slotProps={{
            legend: { hidden: true },
          }}
        />
      </Box>

      {/* Custom Scrollable Legend Sidebar */}
      <Box className="w-full md:w-64 flex flex-col border border-gray-100 rounded-2xl bg-gray-50/50 overflow-hidden shrink-0">
        <Box className="p-3 border-b border-gray-100 bg-white">
          <Typography className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center">
            Toggle Projects ({yearlyProgressData.length - hiddenSeries.length}/{yearlyProgressData.length})
          </Typography>
        </Box>
        <Box className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {yearlyProgressData.map((project) => {
            const isHidden = hiddenSeries.includes(project.name);
            return (
              <Box
                key={project.name}
                onClick={() => toggleSeries(project.name)}
                className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${isHidden
                  ? "opacity-40 grayscale hover:grayscale-0 hover:opacity-70 bg-transparent"
                  : "bg-white shadow-sm hover:shadow-md border border-gray-200"
                  }`}
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: project.color }}
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
            onClick={() => setHiddenSeries(yearlyProgressData.map(p => p.name))}
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

export default function ReportsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    if (!auth) {
      window.location.href = "/login";
    } else {
      setIsAuthenticated(true);
    }
  }, []);

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
        <Box className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                downloadTableAsCSV(projectsData, "all_reports_summary");
              }}
            >
              Export Full Report
            </Button>
          </Box>
        </Box>
      </Box>

      <Box className="max-w-7xl mx-auto px-6">
        {/* Stats Grid */}
        <Grid container spacing={3} className="mb-8">
          {[
            { label: "Active Projects", value: projectsData.length, icon: TrendingUp, color: "bg-blue-50 text-blue-600 border-blue-100" },
            { label: "Machinery in Use", value: equipmentData.filter(e => e.status === "In Use").length, icon: HardHat, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
            { label: "Stock Alerts", value: materialsData.filter(m => m.status !== "In Stock").length, icon: Package, color: "bg-amber-50 text-amber-600 border-amber-100" },
            { label: "Avg. Efficiency", value: "84%", icon: Users, color: "bg-violet-50 text-violet-600 border-violet-100" },
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

              <ProjectComparisonChart />
            </Paper>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} className="mb-8">
          {/* Project Progress Chart (Custom SVG/CSS) */}
          <Grid item xs={12} lg={7}>
            <Paper className="p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
              <Box className="flex items-center justify-between mb-8">
                <Typography variant="h6" className="font-bold text-gray-800 flex items-center gap-2">
                  <BarChart3 size={20} className="text-blue-500" />
                  Project Deliverables & Progress
                </Typography>
              </Box>

              <Box className="space-y-6">
                {projectsData.map((project) => (
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
          </Grid>

          {/* Employee Efficiency Chart (Custom SVG/CSS) */}
          <Grid item xs={12} lg={5}>
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
                  {employeeEfficiency.map((emp, i) => (
                    <Box key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <Box className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold text-xs">
                          {emp.name.charAt(0)}
                        </div>
                        <Typography variant="body2" className="font-medium text-gray-700">{emp.name}</Typography>
                      </Box>
                      <Box className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${emp.status === 'Peak' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                          {emp.status}
                        </span>
                        <Typography variant="body2" className="font-bold text-gray-900">{emp.efficiency}%</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Data Tables */}
        <Grid container spacing={3}>
          {/* Projects Table */}
          <Grid item xs={12}>
            <Card className="rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <Box className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                <Typography variant="h6" className="font-bold text-gray-800">Projects Detailed Report</Typography>
                <Button
                  size="small"
                  startIcon={<Download size={14} />}
                  className="text-blue-600 hover:bg-blue-50 capitalize"
                  onClick={() => downloadTableAsCSV(projectsData, "projects_report")}
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
                      <TableCell className="font-bold text-gray-600">Foreman</TableCell>
                      <TableCell className="font-bold text-gray-600" align="right">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {projectsData.map((row) => (
                      <TableRow key={row.id} className="hover:bg-blue-50/30 transition-colors">
                        <TableCell className="text-gray-500 font-mono text-xs">{row.id}</TableCell>
                        <TableCell><Typography className="font-semibold text-gray-800">{row.name}</Typography></TableCell>
                        <TableCell className="text-gray-600">{row.client}</TableCell>
                        <TableCell className="text-gray-600">{row.foreman}</TableCell>
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

          {/* Equipment Table */}
          <Grid item xs={12} md={6}>
            <Card className="rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
              <Box className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                <Typography variant="h6" className="font-bold text-gray-800">Equipment Usage</Typography>
                <Button
                  size="small"
                  startIcon={<Download size={14} />}
                  className="text-blue-600 hover:bg-blue-50 capitalize"
                  onClick={() => downloadTableAsCSV(equipmentData, "equipment_report")}
                >
                  Download
                </Button>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead className="bg-gray-50">
                    <TableRow>
                      <TableCell className="font-bold text-gray-600 py-4">Machine</TableCell>
                      <TableCell className="font-bold text-gray-600">Status</TableCell>
                      <TableCell className="font-bold text-gray-600">Operator</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {equipmentData.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="py-4 font-medium">{row.name}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${row.status === 'In Use' ? 'bg-blue-100 text-blue-700' : row.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {row.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-600">{row.operator}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
                  onClick={() => downloadTableAsCSV(materialsData, "materials_report")}
                >
                  Download
                </Button>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead className="bg-gray-50">
                    <TableRow>
                      <TableCell className="font-bold text-gray-600 py-4">Item</TableCell>
                      <TableCell className="font-bold text-gray-600">Qty</TableCell>
                      <TableCell className="font-bold text-gray-600">Stock</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {materialsData.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="py-4 font-medium">{row.name}</TableCell>
                        <TableCell className="text-gray-600">{row.quantity} {row.unit}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${row.status === 'In Stock' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {row.status}
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
      </Box>
    </Box>
  );
}
