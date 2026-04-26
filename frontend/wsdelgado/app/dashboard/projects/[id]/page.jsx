"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";
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
import { ArrowLeft, User, MapPin, Briefcase, CheckCircle2, Image as ImageIcon, Upload, Plus, X, Package } from "lucide-react";
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { EquipmentsTable } from "@/components/EquipmentsTable";
import { TaskModal } from "./components/task.jsx";
import CreateTask from "./components/create-task.jsx";
import StartProject from "./components/start-project.jsx";
import UpdateTaskStatus from "./components/update-task-status.jsx";
import AddMembers from "./components/add-members.jsx";


export default function ProjectDetailsPage() {
  const [selectedTask, setSelectedTask] = useState(null)
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssignTaskModalOpen, setAssignTaskModalOpen] = useState(false);
  const [isStatusModalOpen, setStatusModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [images, setImages] = useState([
    {
      id: "1",
      title: "Foundation Work",
      description: "Main foundation structure completed for the commercial base.",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzkRI8CW3pdN2wvKWLLAu1gzt5WNkobLV3sw&s",
      date: "2024-03-10"
    },
    {
      id: "2",
      title: "Site Overview",
      description: "Aerial view of the construction progress and surrounding logistics.",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgYaxGtkJWf7GaKYX829P0fdWXgewYbUxZCw&s",
      date: "2024-03-15"
    },
    {
      id: "3",
      title: "Steel Framing",
      description: "Initial framing phase for the second floor.",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfJtvxuAmXeskOkS1bMyzx7kQ4ybdNzF0L8A&s",
      date: "2024-03-22"
    }
  ]);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newImage, setNewImage] = useState({ title: "", description: "", url: "" });

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [allEquipments, setAllEquipments] = useState([]);
  const [requestData, setRequestData] = useState({
    material_id: "",
    quantity: "",
  });
  const [equipmentRequestData, setEquipmentRequestData] = useState({
    equipment_id: "",
    estimated_hours: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [team, setTeam] = useState([]);
  const [requests, setRequests] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [progress, setProgress] = useState(0)
  const [taskData, setTaskData] = useState({
    name: "",
    status: "Pending",
    severity: 1,
    start_date: "",
    end_date: "",
    quantity: ""
  });

  const materialRequestColumns = [
    {
      field: "material_name",
      headerName: "Material",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box className="flex flex-col justify-center h-full">
          <Typography variant="body2" className="font-bold text-gray-700 text-xs">{params.row.material_name}</Typography>
          <Typography className="text-[10px] text-gray-400">Requested by: {params.row.engineer_name}</Typography>
        </Box>
      )
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Typography className="h-full flex items-center justify-center font-bold text-gray-700 text-xs">{params.row.quantity}</Typography>
      )
    },
    {
      field: "request_date",
      headerName: "Date",
      width: 150,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Typography className="h-full flex items-center justify-center text-[11px] font-medium text-gray-600">{new Date(params.row.request_date).toLocaleDateString()}</Typography>
      )
    },
    {
      field: "is_approve",
      headerName: "Status",
      width: 120,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Chip
          label={params.row.is_approve}
          size="small"
          className={`h-5 text-[9px] font-black uppercase ${params.row.is_approve == "Approve" ? "!bg-green-100 !text-green-700" :
            params.row.is_approve == "Reject" ? "!bg-red-100 !text-red-700" :
              "!bg-orange-100 !text-orange-700"
            }`}
        />
      )
    }
  ];

  const teamColumns = [
    {
      field: "name",
      headerName: "Employee",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box className="flex flex-col justify-center h-full">
          <Typography variant="body2" className="font-bold text-gray-700 text-xs">{params.row.name}</Typography>
          <Typography className="text-[10px] text-gray-400 uppercase">{params.row.position}</Typography>
        </Box>
      )
    },
    {
      field: "contact",
      headerName: "Contact",
      flex: 1,
      minWidth: 150,
      align: 'center',
      headerAlign: 'center',
      valueGetter: (value, row) => row.phone || row.email || "-",
      renderCell: (params) => (
        <Typography className="text-[11px] h-full items-center justify-center flex font-medium text-gray-600">{params.value}</Typography>
      )
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Chip
          label={params.row.status}
          size="small"
          className={`h-5 text-[9px] font-black uppercase ${params.row.status === "Available" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}
        />
      )
    }
  ];

  const taskColumns = [
    {
      field: "name",
      headerName: "Task Name",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <Box className="flex flex-col justify-center h-full">
          <Typography variant="body2" className="font-bold text-gray-700 text-xs">{params.row.name}</Typography>
          <Typography className="text-[10px] text-gray-400">Qty: {params.row.quantity}</Typography>
        </Box>
      )
    },
    {
      field: "employees",
      headerName: "Employees Name",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <Box className="flex items-center h-full gap-2">
          {params.row.employees?.map((d, i) => {
            return (
              <Typography key={d + '-' + i} variant="body2" className="py-1 px-3 font-bold text-white text-xs bg-green-700 rounded-full">{d}</Typography>
            )
          })}
        </Box>
      )
    },
    {
      field: "dates",
      headerName: "Dates",
      width: 180,
      renderCell: (params) => (
        <Box className="flex flex-col justify-center h-full">
          <Typography className="text-[11px] font-medium text-gray-600">Start: {params.row.start_date}</Typography>
          <Typography className="text-[11px] font-medium text-gray-600">End: {params.row.end_date}</Typography>
        </Box>
      )
    },
    {
      field: "severity",
      headerName: "Severity",
      width: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip
          label={params.row.severity === 1 ? "Low" : params.row.severity === 2 ? "Medium" : "High"}
          size="small"
          className={`h-5 text-[9px] font-black uppercase ${params.row.severity === 1 ? "!bg-green-100 !text-green-700" : params.row.severity === 2 ? "!bg-yellow-100 !text-yellow-700" : "!bg-red-100 !text-red-700"}`}
        />
      )
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Chip
          label={params.row.status === 0 ? "Pending" : params.row.finished < params.row.quantity ? "In Progress" : "Completed"}
          size="small"
          className={`h-5 text-[9px] font-black uppercase ${params.row.status === 0 ? "!bg-red-100 !text-red-700" : params.row.finished < params.row.quantity ? "!bg-blue-100 !text-blue-700" : "!bg-green-100 !text-green-700"}`}
        />
      )
    },
    ...(userRole === "engineer" ? [{
      field: "actions",
      headerName: "Actions",
      width: 180,
      align: 'right',
      headerAlign: 'right',
      sortable: false,
      renderCell: (params) => (
        <Box className="flex gap-2 justify-end items-center h-full">
          <Button
            variant="outlined"
            size="small"
            onClick={() => { setAssignTaskModalOpen(true); setSelectedTask(params.row) }}
            className="rounded-lg border-gray-200 text-gray-600 font-bold px-3 hover:bg-white text-[10px] py-1 h-7"
          >
            Assign
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => { setStatusModalOpen(true); setSelectedTask(params.row) }}
            className="rounded-lg border-gray-200 text-gray-600 font-bold px-3 hover:bg-white text-[10px] py-1 h-7"
          >
            Done
          </Button>
        </Box>
      )
    }] : [])
  ];

  const fetchProjectDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/projects/single_read.php?id=${id}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data);
      } else {
        console.error("Failed to fetch project details");
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMaterials = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/materials/read.php`);
      if (response.ok) {
        const data = await response.json();
        setMaterials(data.records || []);
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const fetchEquipments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/equipments/read.php`);
      if (response.ok) {
        const data = await response.json();
        // Only show available equipment
        setAllEquipments((data.records || []).filter(e => e.status === "Available"));
      }
    } catch (error) {
      console.error("Error fetching equipments:", error);
    }
  };

  const fetchTeam = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/read.php`);
      if (response.ok) {
        const data = await response.json();
        // Filter employees assigned to this project
        const assignedEmployees = (data.records || []).filter(
          emp => String(emp.assignedProjectId) === String(id)
        );
        setTeam(assignedEmployees);
      }
    } catch (error) {
      console.error("Error fetching team:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/read.php`);
      if (response.ok) {
        const data = await response.json();
        const projectTasks = (data.records || []).filter(
          task => String(task.project_id) === String(id)
        );
        setTasks(projectTasks);
        let points = 0
        let total = 0
        projectTasks.map((d) => {
          total = total + (d.quantity * d.severity)
          if (d.finished > 0) {
            points = points + (d.finished * d.severity)
          }
        })
        await fetch(`${API_BASE_URL}/projects/update.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            id: id,
            progress: Math.round((points / total) * 10000) / 100
          })
        });
        setProgress(Math.round((points / total) * 10000) / 100);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchAssign = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/assign/read.php`);
      const data = await response.json();
      const assignments = data.records || [];

      setTasks(prevTasks =>
        prevTasks.map(task => {
          const taskAssignments = assignments.filter(a => String(a.task_id) === String(task.id));
          if (taskAssignments.length === 0) return { ...task, employees: [] };

          // Find the latest created_at timestamp for this task's assignments
          const latestDate = taskAssignments.reduce((max, a) =>
            new Date(a.created_at) > new Date(max) ? a.created_at : max,
            taskAssignments[0].created_at
          );

          const taskEmployees = taskAssignments
            .filter(a => a.created_at === latestDate)
            .map(a => a.employee_name);

          return { ...task, employees: taskEmployees };
        })
      );
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  useEffect(() => {
    setUserRole(localStorage.getItem("user")); // Use 'user' key as defined in login/page.jsx
    if (id) {
      fetchTasks();
      fetchProjectDetails();
      fetchMaterials();
      fetchEquipments();
      fetchTeam();
      fetchRequests();
      fetchAssign();
    }
  }, [id]);

  const fetchRequests = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/request/read.php`);
      if (response.ok) {
        const data = await response.json();
        const projectRequests = (data.records || []).filter(
          req => String(req.project_id) === String(id)
        );
        setRequests(projectRequests);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const handleOpenUpload = () => setIsUploadModalOpen(true);
  const handleCloseUpload = () => {
    setIsUploadModalOpen(false);
    setNewImage({ title: "", description: "", url: "" });
  };

  const handleUploadImage = () => {
    if (newImage.title && newImage.url) {
      const img = {
        id: Math.random().toString(36).substr(2, 9),
        ...newImage,
        date: new Date().toISOString().split('T')[0]
      };
      setImages([img, ...images]);
      handleCloseUpload();
    }
  };

  const handleOpenRequest = () => setIsRequestModalOpen(true);
  const handleCloseRequest = () => {
    setIsRequestModalOpen(false);
    setRequestData({ material_id: "", quantity: "" });
  };

  const handleOpenEquipmentRequest = () => setIsEquipmentModalOpen(true);
  const handleCloseEquipmentRequest = () => {
    setIsEquipmentModalOpen(false);
    setEquipmentRequestData({ equipment_id: "", estimated_hours: "" });
  };

  const handleEquipmentRequestSubmit = async () => {
    if (!equipmentRequestData.equipment_id || !equipmentRequestData.estimated_hours) {
      alert("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        id: equipmentRequestData.equipment_id,
        project_id: project.id,
        requested_by_id: project.engineer_id,
        estimated_hours: equipmentRequestData.estimated_hours,
        status: "Requested",
        is_approved: 0
      };

      const response = await fetch(`${API_BASE_URL}/equipments/update.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Equipment request submitted successfully!");
        handleCloseEquipmentRequest();
        fetchEquipments(); // Refresh list
      } else {
        const error = await response.json();
        alert(`Failed to submit request: ${error.message}`);
      }
    } catch (error) {
      console.error("Error submitting equipment request:", error);
      alert("An error occurred while submitting the request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenTask = () => setIsTaskModalOpen(true);
  const handleCloseTask = () => {
    setIsTaskModalOpen(false);
    setTaskData({
      name: "",
      status: "Pending",
      severity: 1,
      start_date: "",
      end_date: "",
      quantity: ""
    });
  };


  const handleTaskSubmit = async () => {
    if (!taskData.name || !taskData.quantity) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...taskData,
        project_id: project.id
      };

      const response = await fetch(`${API_BASE_URL}/tasks/create.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Task created successfully!");
        handleCloseTask();
        fetchTasks();
      } else {
        const error = await response.json();
        alert(`Failed to create task: ${error.message}`);
      }
    } catch (error) {
      console.error("Error creating task:", error);
      alert("An error occurred while creating the task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestSubmit = async () => {
    if (!requestData.material_id || !requestData.quantity) {
      alert("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        material_id: requestData.material_id,
        quantity: requestData.quantity,
        engineer_id: project.engineer_id,
        project_id: project.id,
        request_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        is_approve: "Pending"
      };

      const response = await fetch(`${API_BASE_URL}/request/create.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Material request submitted successfully!");
        handleCloseRequest();
        fetchRequests();
      } else {
        const error = await response.json();
        alert(`Failed to submit request: ${error.message}`);
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("An error occurred while submitting the request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTaskAssign = (taskId) => {
    console.log("Assign task:", taskId);
    // TODO: Implement task assignment logic
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/delete.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId }),
      });
      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  if (isLoading) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  if (!project) {
    return (
      <Box className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Typography variant="h5" color="error">Project not found</Typography>
        <Button onClick={() => router.back()} variant="outlined">Go Back</Button>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen bg-gray-50 p-6">
      <Button
        startIcon={<ArrowLeft size={20} />}
        onClick={() => router.back()}
        className="mb-6 text-gray-600 capitalize hover:bg-gray-200"
      >
        Back to Dashboard
      </Button>

      <Box className="max-w-6xl mx-auto space-y-6">
        {/* Header Section - Modern Slim */}
        <Box className="flex flex-col md:flex-row justify-between items-end gap-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
          <Box className="z-10 flex-1">
            <Typography variant="h3" className="font-black text-gray-900 mb-2 tracking-tight">
              {project.name}
            </Typography>
            <Box className="flex items-center gap-4">
              <Chip
                label={progress === 100 ? "Completed" : project.start_date !== null ? "In Progress" : "Pending"}
                color={progress === 100 ? "success" : project.start_date !== null ? "primary" : "default"}
                className="font-bold rounded-lg"
              />
              <Typography variant="body2" className="text-gray-400 font-medium">#{project.id} • Registered {new Date(project.created_at).toLocaleDateString()}</Typography>
            </Box>
          </Box>

          <Box className="z-10 flex items-center gap-8 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
            <Box className="text-right">

              <Typography variant="caption" className="text-gray-400 font-bold uppercase tracking-tighter">Progress</Typography>
            </Box>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress
                variant="determinate"
                value={100}
                size={80}
                sx={{ color: '#f3f4f6' }} // bg-gray-100 for the hollow track
              />
              <CircularProgress
                variant="determinate"
                value={progress || 0}
                size={80}
                sx={{
                  position: 'absolute',
                  left: 0,
                }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="caption"
                  component="div"
                  sx={{ color: "text.secondary", fontSize: "1rem", fontWeight: 'bold' }}
                >
                  {`${progress || 0}%`}
                </Typography>
              </Box>
            </Box>
            {
              project.start_date === null &&
              <StartProject project={project} setProject={setProject} />
            }
          </Box>
        </Box>
        <div className="grid grid-cols-12 gap-6">
          {/* Main Context - Left Column */}
          <div className="space-y-6 col-span-12">
            <Card className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <Box className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <Typography variant="subtitle1" className="font-bold text-gray-800 flex items-center gap-2">
                    <Briefcase size={18} className="text-blue-600" />
                    Overview & Logistics
                  </Typography>
                </Box>
                <Box className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Box className="space-y-4">
                    <Box>
                      <Typography variant="caption" className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Client</Typography>
                      <Typography variant="body1" className="font-bold text-gray-700">{project.client_name}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Primary Location</Typography>
                      <Box className="flex items-start gap-1 mt-1">
                        <MapPin size={14} className="text-red-500 mt-1" />
                        <Typography variant="body2" className="text-gray-700 leading-tight font-medium">
                          {project.location}<br />
                          <span className="text-gray-400 text-xs font-normal">{project.address}</span>
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box className="space-y-4">
                    <Box>
                      <Typography variant="caption" className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Field Leadership</Typography>
                      <Box className="space-y-2 mt-1">
                        <Box className="flex items-center gap-2">
                          <User size={14} className="text-blue-400" />
                          <Typography variant="body2" className="font-bold text-gray-700 text-xs">
                            {project.foreman_name || project.foreman || "Unassigned"} <span className="text-[10px] text-gray-400 font-normal ml-1">FOREMAN</span>
                          </Typography>
                        </Box>
                        <Box className="flex items-center gap-2">
                          <User size={14} className="text-green-400" />
                          <Typography variant="body2" className="font-bold text-gray-700 text-xs">
                            {project.engineer_name || project.engineer || "Unassigned"} <span className="text-[10px] text-gray-400 font-normal ml-1">ENGINEER</span>
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  <Box className="space-y-4 bg-blue-50/30 p-4 rounded-xl border border-blue-50">
                    <Box className="flex justify-between items-center border-b border-blue-100 pb-2">
                      <Typography variant="caption" className="text-blue-400 font-bold">TIMELINES</Typography>
                      <Chip
                        label={
                          progress === 100 ? "Completed" :
                            project.end_date && new Date() > new Date(project.end_date) ? "Overdue" : "On Schedule"
                        }
                        size="small"
                        className={`h-5 text-[10px] font-black ${progress === 100 ? "!bg-green-100 !text-green-700" :
                          project.end_date && new Date() > new Date(project.end_date) ? "!bg-red-100 !text-red-700" : "!bg-blue-100! text-blue-700"
                          }`}
                      />
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" className="text-gray-400 text-[9px] uppercase font-bold block">Start</Typography>
                        <Typography variant="body2" className="font-bold text-gray-700">{project.start_date || "N/A"}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" className="text-gray-400 text-[9px] uppercase font-bold block">Target</Typography>
                        <Typography variant="body2" className="font-bold text-blue-600">{project.end_date || "TBA"}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Project Team Members Table - Move up to reduce scrolling */}
            <Card className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
              <Box className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <Typography variant="subtitle1" className="font-bold text-gray-800 flex items-center gap-2">
                  <User size={18} className="text-blue-600" />
                  Execution Team
                </Typography>
                <div className="flex items-center gap-2">
                  <Chip label={`${team.length} Active`} size="small" variant="outlined" className="text-[10px] font-bold" />
                  {userRole === "engineer" && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setIsAddMemberModalOpen(true)}
                      className="rounded-lg border-gray-200 text-gray-600 font-bold px-3 hover:bg-white text-xs py-1"
                    >
                      Add Member
                    </Button>
                  )}
                </div>
              </Box>
              <Box className="p-4" sx={{ height: 350, width: '100%' }}>
                <DataGrid
                  rows={team}
                  columns={teamColumns}
                  pageSizeOptions={[5, 10, 20]}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 5 } },
                  }}
                  disableRowSelectionOnClick
                  sx={{
                    border: 'none',
                    '& .MuiDataGrid-cell:focus': { outline: 'none' },
                    '& .MuiDataGrid-columnHeader:focus': { outline: 'none' },
                  }}
                />
              </Box>
            </Card>

            {/* Tasks Table */}
            <Card className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden mt-6">
              <Box className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <Typography variant="subtitle1" className="font-bold text-gray-800 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-blue-600" />
                  Tasks
                </Typography>
                <Box className="flex items-center gap-2">
                  <Chip label={`${tasks.length} Total`} size="small" variant="outlined" className="text-[10px] font-bold mr-2" />
                  {userRole === "engineer" && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Plus size={14} />}
                      onClick={handleOpenTask}
                      className="rounded-lg border-gray-200 text-gray-600 font-bold px-3 hover:bg-white text-xs py-1"
                    >
                      Add Task
                    </Button>
                  )}
                </Box>
              </Box>
              <Box className="p-4" sx={{ height: 400, width: '100%' }}>
                <DataGrid
                  rows={tasks}
                  columns={taskColumns}
                  pageSizeOptions={[5, 10, 20]}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 5 } },
                  }}
                  disableRowSelectionOnClick
                  sx={{
                    border: 'none',
                    '& .MuiDataGrid-cell:focus': { outline: 'none' },
                    '& .MuiDataGrid-columnHeader:focus': { outline: 'none' },
                  }}
                />
              </Box>
            </Card>

            {/* Material Requests Table */}
            <Card className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden mt-6">
              <Box className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-2">
                <Typography variant="subtitle1" className="font-bold text-gray-800 flex items-center gap-2">
                  <Package size={18} className="text-blue-600" />
                  Material Requests
                </Typography>
                <div className="flex items-center gap-2">
                  <Chip label={`${requests.length} Requests`} size="small" variant="outlined" className="text-[10px] font-bold" />
                  {userRole === "engineer" && (
                    <Button
                      variant="outlined"
                      startIcon={<Package size={16} />}
                      onClick={handleOpenRequest}
                      className="rounded-lg border-gray-200 text-gray-600 font-bold px-3 hover:bg-white text-xs py-1"
                    >
                      Request Material
                    </Button>
                  )}
                </div>
              </Box>
              <Box className="p-4" sx={{ height: 400, width: '100%' }}>
                <DataGrid
                  rows={requests}
                  columns={materialRequestColumns}
                  pageSizeOptions={[5, 10, 20]}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 5 } },
                  }}
                  disableRowSelectionOnClick
                  sx={{
                    border: 'none',
                    '& .MuiDataGrid-cell:focus': { outline: 'none' },
                    '& .MuiDataGrid-columnHeader:focus': { outline: 'none' },
                  }}
                />
              </Box>
            </Card>

            {/* Project Equipments Table */}
            <Card className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden mt-6">
              <Box className="p-6">
                <div className="flex gap-2 justify-end w-full items-center">
                  {userRole === "engineer" && (
                    <Button
                      variant="outlined"
                      startIcon={<Briefcase size={16} />}
                      onClick={handleOpenEquipmentRequest}
                      className="rounded-lg border-gray-200 text-gray-600 font-bold px-3 hover:bg-white text-xs py-1"
                    >
                      Request Equipment
                    </Button>
                  )}
                </div>
                <EquipmentsTable projectId={id} user={userRole} />
              </Box>
            </Card>
          </div>
        </div>

        {/* Gallery - Now at the bottom with full width/grid transition */}
        <Box className="mt-8">
          <Box className="flex justify-between items-center mb-6">
            <Typography variant="h5" className="font-black text-gray-900 flex items-center gap-2">
              <ImageIcon size={22} className="text-blue-600" />
              Gallery <span className="text-gray-300 font-normal text-lg">({images.length})</span>
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Plus size={14} />}
              onClick={handleOpenUpload}
              className="rounded-lg border-gray-200 text-gray-600 font-bold px-4 hover:bg-white"
            >
              Add Photo
            </Button>
          </Box>

          <Grid container spacing={2}>
            {images.map((image) => (
              <Grid item xs={12} sm={6} md={4} key={image.id}>
                <Box className="group relative rounded-2xl overflow-hidden aspect-video shadow-sm border border-gray-100">
                  <img src={image.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <Box className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                    <Typography className="text-white font-bold text-sm leading-tight">{image.title}</Typography>
                    <Typography className="text-white/60 text-[10px]">{image.date}</Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Upload Image Modal */}
      <Dialog
        open={isUploadModalOpen}
        onClose={handleCloseUpload}
        maxWidth="xs"
        fullWidth
        PaperProps={{ className: "rounded-2xl" }}
      >
        <DialogTitle className="font-bold text-gray-800 border-b border-gray-100 pb-4">
          Upload Progress Photo
        </DialogTitle>
        <DialogContent className="pt-6 space-y-4">
          <TextField
            label="Image URL"
            placeholder="https://example.com/image.jpg"
            fullWidth
            variant="outlined"
            value={newImage.url}
            onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
          />
          <TextField
            label="Image Title"
            fullWidth
            variant="outlined"
            value={newImage.title}
            onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
          />
          <TextField
            label="Description"
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            value={newImage.description}
            onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions className="p-4 border-t border-gray-100">
          <Button onClick={handleCloseUpload} color="inherit">Cancel</Button>
          <Button
            onClick={handleUploadImage}
            variant="contained"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={!newImage.url || !newImage.title}
          >
            Add to Gallery
          </Button>
        </DialogActions>
      </Dialog>

      {/* Request Material Modal */}

      <Dialog
        open={isRequestModalOpen}
        onClose={handleCloseRequest}
        maxWidth="xs"
        fullWidth
        PaperProps={{ className: "rounded-2xl" }}
      >
        <DialogTitle className="font-bold text-gray-800 border-b border-gray-100 pb-4">
          Request Material
        </DialogTitle>
        <DialogContent className="pt-6 space-y-4">
          <FormControl fullWidth variant="outlined">
            <InputLabel id="material-select-label">Select Material</InputLabel>
            <Select
              labelId="material-select-label"
              value={requestData.material_id}
              onChange={(e) => setRequestData({ ...requestData, material_id: e.target.value })}
              label="Select Material"
            >
              {materials.map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  {m.name} ({m.quantity}/{m.max_stock})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Quantity"
            type="number"
            fullWidth
            variant="outlined"
            value={requestData.quantity}
            onChange={(e) => setRequestData({ ...requestData, quantity: e.target.value })}
            inputProps={{ min: 1 }}
          />
          <Box className="bg-gray-50 p-3 rounded-lg space-y-1">
            <Typography variant="caption" className="text-gray-400 block uppercase">Project</Typography>
            <Typography variant="body2" className="font-medium">{project.name}</Typography>

            <Typography variant="caption" className="text-gray-400 block uppercase mt-2">Engineer</Typography>
            <Typography variant="body2" className="font-medium">{project.engineer_name || "N/A"}</Typography>

            <Typography variant="caption" className="text-gray-400 block uppercase mt-2">Date</Typography>
            <Typography variant="body2" className="font-medium">{new Date().toLocaleDateString()}</Typography>
          </Box>
        </DialogContent>
        <DialogActions className="p-4 border-t border-gray-100">
          <Button onClick={handleCloseRequest} color="inherit">Cancel</Button>
          <Button
            onClick={handleRequestSubmit}
            variant="contained"
            className="bg-orange-500 hover:bg-orange-600 text-white"
            disabled={isSubmitting || !requestData.material_id || !requestData.quantity}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Submit Request"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Request Equipment Modal */}
      <Dialog
        open={isEquipmentModalOpen}
        onClose={handleCloseEquipmentRequest}
        maxWidth="xs"
        fullWidth
        PaperProps={{ className: "rounded-2xl" }}
      >
        <DialogTitle className="font-bold text-gray-800 border-b border-gray-100 pb-4">
          Request Equipment
        </DialogTitle>
        <DialogContent className="pt-6 space-y-4">
          <FormControl fullWidth variant="outlined">
            <InputLabel id="equipment-select-label">Select Equipment</InputLabel>
            <Select
              labelId="equipment-select-label"
              value={equipmentRequestData.equipment_id}
              onChange={(e) => setEquipmentRequestData({ ...equipmentRequestData, equipment_id: e.target.value })}
              label="Select Equipment"
            >
              {allEquipments.map((e) => (
                <MenuItem key={e.id} value={e.id}>
                  {e.name} ({e.type})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Estimated Usage Hours"
            type="number"
            fullWidth
            variant="outlined"
            placeholder="e.g. 16"
            value={equipmentRequestData.estimated_hours}
            onChange={(e) => setEquipmentRequestData({ ...equipmentRequestData, estimated_hours: e.target.value })}
            inputProps={{ min: 1 }}
          />
          <Box className="bg-gray-50 p-3 rounded-lg space-y-1">
            <Typography variant="caption" className="text-gray-400 block uppercase">Project</Typography>
            <Typography variant="body2" className="font-medium">{project.name}</Typography>

            <Typography variant="caption" className="text-gray-400 block uppercase mt-2">Engineer</Typography>
            <Typography variant="body2" className="font-medium">{project.engineer_name || "N/A"}</Typography>
          </Box>
        </DialogContent>
        <DialogActions className="p-4 border-t border-gray-100">
          <Button onClick={handleCloseEquipmentRequest} color="inherit">Cancel</Button>
          <Button
            onClick={handleEquipmentRequestSubmit}
            variant="contained"
            className="bg-blue-500 hover:bg-blue-600 text-white"
            disabled={isSubmitting || !equipmentRequestData.equipment_id || !equipmentRequestData.estimated_hours}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Submit Request"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Task Modal */}
      <CreateTask
        isTaskModalOpen={isTaskModalOpen}
        handleCloseTask={handleCloseTask}
        taskData={taskData}
        setTaskData={setTaskData}
        handleTaskSubmit={handleTaskSubmit}
        isSubmitting={isSubmitting}
      />
      <TaskModal isOpen={isAssignTaskModalOpen} setTasks={setTasks} tasks={tasks} selectedTask={selectedTask} handleClose={() => { setAssignTaskModalOpen(false) }} />
      <UpdateTaskStatus
        isOpen={isStatusModalOpen}
        handleClose={() => setStatusModalOpen(false)}
        task={selectedTask}
        onUpdate={() => {
          fetchTasks();
          fetchAssign();
          fetchProjectDetails();
        }}
      />
      <AddMembers
        isOpen={isAddMemberModalOpen}
        handleClose={() => setIsAddMemberModalOpen(false)}
        projectId={id}
        onUpdate={() => {
          fetchTeam();
        }}
      />

    </Box>
  );
}
