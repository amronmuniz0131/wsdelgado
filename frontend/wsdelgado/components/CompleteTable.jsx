"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";
import { SuccessToast, DangerToast } from "@/components/useToast";
import {
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { DataGrid, getGridStringOperators } from "@mui/x-data-grid";
import { Plus, Check } from "lucide-react";

export function ProjectsTable(props) {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newProject, setNewProject] = useState({
    name: "",
    foremanId: "",
    engineerId: "",
    location: "",
    client: "",
    address: "",
  });
  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/projects/read.php`);
      const data = await response.json();
      setProjects(data.records || []);
      let count = 0
      let not_done = 0
      let overdue = 0
      data?.records.map((d) => {
        if (d.progress == 100) {
          count++;

        } else if (d.progress < 100 && new Date() < new Date(d.end_date)) {
          not_done++
        } else {
          overdue++
        }
      })
      props.setTotalProgress({ "done": count, "ongoing": not_done, "overdue": overdue })
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const [engineers, setEngineers] = useState([]);

  const fetchEmployees = async () => {
    try {
      let count = 0
      const response = await fetch(`${API_BASE_URL}/employees/read.php`);
      const data = await response.json();
      let arr = []
      setEmployees(data.records || []);
      data.records.map((d) => {
        if (d.position?.toLowerCase() === "engineer") {
          arr.push(d)
        }
        if (d.project_id === null || d.is_finished) {
          count = count + 1
        }
      })
      props.employee_count(count)
      setEngineers(arr);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/read.php`);
      const data = await response.json();
      setUsers(data.records || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  React.useEffect(() => {
    fetchProjects();
    fetchEmployees();
    fetchUsers();

    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      try {
        setUserData(JSON.parse(storedUserData));
      } catch (e) {
        console.error("Failed to parse userData:", e);
      }
    }
  }, []);


  useEffect(() => {
    if (props.userData) {
      users.map((d) => {
        if (props.userData.email === d.email) {
          setNewProject((prev) => ({ ...prev, client: d.id }));
        }
      })
    }
  }, [props.userData])


  const filteredOperators = getGridStringOperators().filter((operator) =>
    ["contains", "startsWith", "equals"].includes(operator.value)
  );

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 180,
      filterOperators: filteredOperators
    },
    {
      field: "foreman",
      headerName: "Foreman",
      flex: 1,
      minWidth: 130,
      filterOperators: filteredOperators,
      valueGetter: (value, row) => row?.foremanName || row?.foreman || ""
    },
    {
      field: "engineer",
      headerName: "Engineer",
      flex: 1,
      minWidth: 130,
      filterOperators: filteredOperators,
      valueGetter: (value, row) => row?.engineerName || row?.engineer || ""
    },
    {
      field: "client",
      headerName: "Client",
      flex: 1,
      minWidth: 150,
      filterOperators: filteredOperators,
      valueGetter: (value, row) => row?.clientName || row?.client || ""
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1.5,
      minWidth: 200,
      filterOperators: filteredOperators
    },
    {
      field: "progress",
      headerName: "Progress",
      minWidth: 100,
      type: 'number',
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.row.completion_date && params.row.completion_date !== "0000-00-00") {
          return (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  backgroundColor: "#47B04C",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  boxShadow: "0 2px 4px rgba(71, 176, 76, 0.3)",
                }}
              >
                <Check size={18} />
              </Box>
            </Box>
          );
        }
        return (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
            <Box sx={{ position: "relative", display: "inline-flex" }}>
              <CircularProgress
                variant="determinate"
                value={params.value || 0}
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
                  sx={{ color: "text.secondary", fontSize: "0.65rem" }}
                >
                  {`${params.value || 0}%`}
                </Typography>
              </Box>
            </Box>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 120,
      filterable: false,
      renderCell: (params) => (
        <Box className="flex items-center h-full">
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => router.push(`/dashboard/projects/${params.row.id}`)}
            className="bg-blue-600 hover:bg-blue-700 capitalize"
          >
            Details
          </Button>
        </Box>
      ),
    }
  ];

  const handleClose = () => {
    props.setOpenModal(false);
    setNewProject({
      name: "",
      foremanId: "",
      engineerId: "",
      location: "",
      client: "",
      address: "",
    });
  };

  const filteredProjects = React.useMemo(() => {
    const isCompleted = (project) =>
      project.completion_date && project.completion_date !== "0000-00-00";

    if (props.user === "admin") {
      return projects.filter(isCompleted);
    }
    if (!userData) return [];

    return projects.filter((project) => {
      if (props.user === "engineer") {
        const engineerName = project.engineerName || project.engineer;
        return isCompleted(project) && engineerName === userData.name;
      }
      if (props.user === "user") {
        return isCompleted(project) && project.clientName === userData.name;
      }
      return false;
    });
  }, [projects, props.user, userData]);

  return (
    <Box className="w-full">
      <Box className="flex justify-between items-center mb-4">
        <Typography
          variant="h6"
          component="h2"
          className="text-gray-800 font-semibold"
        >
          Finished Projects
        </Typography>
      </Box>

      <Paper className="shadow-sm border border-gray-200 w-full" sx={{ width: '100%' }}>
        <DataGrid
          rows={filteredProjects}
          columns={columns}
          loading={isLoading}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          isRowSelectable={() => false}
          sx={{
            border: 0,
            maxHeight: '50vh',
            '& .MuiDataGrid-cell:focus': { outline: 'none' },
            '& .MuiDataGrid-cell:focus-within': { outline: 'none' }
          }}
        />
      </Paper>
    </Box>
  );
}
