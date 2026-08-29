"use client";

import { useEffect, useState, useRef } from "react";
import { Badge } from "@mui/material";
import { API_BASE_URL } from "@/lib/api";
import { Mail } from "lucide-react";
import { DataGrid } from "@mui/x-data-grid";

import { PieChart } from '@mui/x-charts/PieChart';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  TextField,
  Typography,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { ProjectsTable } from "@/components/ProjectsTable";
import { MaterialsTable } from "@/components/MaterialsTable";
import { EquipmentsTable } from "@/components/EquipmentsTable";
import { InquiriesList } from "@/components/InquiriesList";
import GanttChart from "@/components/GanttChart";

import RoleProtectedRoute from "@/components/RoleProtectedRoute";

export default function DashboardPage() {
  return (
    <RoleProtectedRoute allowedRoles={["admin", "engineer", "user"]}>
      <DashboardContent />
    </RoleProtectedRoute>
  );
}

function DashboardContent() {
  const bottomRef = useRef(null);
  const inventoryRef = useRef(null)
  const [user, setUser] = useState("");
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [totalProgress, setTotalProgress] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [ganttData, setGanttData] = useState([]);
  const [employee_count, setEmployeeCount] = useState(0)
  const [equipmentCount, setEquipmentCount] = useState(0);
  const [materialCount, setMaterialCount] = useState(0);

  const employeeAssignColumns = [
    { field: "employee_name", headerName: "Employee Name", flex: 1 },
    { field: "task_name", headerName: "Task Name", flex: 1 },
    { field: "project_name", headerName: "Project Name", flex: 1 },
    {
      field: "is_finish", headerName: "Status", flex: 1, renderCell: (params) => {

        return (
          <Chip
            label={params.value ? "Done" : "Ongoing"}
            size="small"
            className={`h-5 text-[9px] font-black uppercase ${params.value ? "!bg-green-100 !text-green-700" :
              params.value ? "!bg-red-100 !text-red-700" :
                "!bg-orange-100 !text-orange-700"
              }`}
          />
        )
      }
    },
  ];
  useEffect(() => {
    setUser(localStorage.getItem("user"));

    const fetchAssignments = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/assign/read.php`);
        if (response.ok) {
          const data = await response.json();
          setAssignments(data.records || []);
        }
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/projects/read.php`);
        if (response.ok) {
          const data = await response.json();
          setGanttData(data.records || []);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchAssignments();
    fetchProjects();
  }, []);

  const ScrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const ScrollToInventory = () => {
    inventoryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleOpenAdd = () => {
    setOpenAddModal(true);
  };

  const handleCloseAdd = () => {
    setOpenAddModal(false);
  };

  const handleInputChange = (e) => {
    setNewAccount({
      ...newAccount,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddAccount = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/create.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAccount),
      });
      if (response.ok) {
        handleCloseAdd();
      } else {
        const error = await response.json();
        if (error.error == 401) {
          setOpenModal(true)
          setOpenAddModal(false)
        }
      }
    } catch (error) {
      console.error("Error adding account:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-6 space-y-8">
      {"done:" + totalProgress.done}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-gray-900 capitalize">{user} Dashboard</h1>
        {(user == "admin") && (
          <div onClick={ScrollToBottom} className="flex cursor-pointer items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
            <span className="text-sm font-medium text-gray-700">Messages:</span>
            <Badge badgeContent={unreadMessages} color="error" max={99}>
              <Mail className="text-gray-600" size={24} />
            </Badge>
          </div>
        )}
      </div>

      <section className="bg-white flex flex-col gap-2 p-6 rounded-lg shadow-sm border border-gray-100">
        {/* cards */}
        <div className="flex gap-2 mb-4">
          {/* Ongoing Projects */}
          <div className='border-gray-300 border rounded-md flex flex-col w-42 text-black items-center justify-center'>
            <div className="bg-yellow-200 w-full text-center py-2 rounded-t-md h-18 flex items-center justify-center">
              Ongoing Projects
            </div>
            <div className="py-4 text-xl ">
              {totalProgress.ongoing}
            </div>
          </div>
          {/* Done Projects */}
          <div className='border-gray-300 border rounded-md flex flex-col w-42 text-black items-center justify-center'>
            <div className="bg-green-200 w-full text-center py-2 rounded-t-md h-18 flex items-center justify-center">
              Finished Projects
            </div>
            <div className="py-4 text-xl ">
              {totalProgress.done}
            </div>
          </div>
          {/* Overdues (equipments or projects) */}
          <div className='border-gray-300 border rounded-md flex flex-col w-42 text-black items-center justify-center'>
            <div className="bg-red-200 w-full text-center py-2 rounded-t-md h-18 flex items-center justify-center">
              Project Overdues
            </div>
            <div className="py-4 text-xl ">
              {totalProgress.overdue}
            </div>
          </div>
          {/* materials request count */}
          {
            user == 'admin' || user == 'engineer' && (

              <div className='border-gray-300 border hover:cursor-pointer rounded-md flex flex-col w-42 text-black items-center justify-center'
                onClick={ScrollToInventory}>
                <div className="bg-blue-200 w-full text-center py-2 rounded-t-md h-18 flex items-center justify-center">
                  Equipment Requests
                </div>
                <div className="py-4 text-xl ">
                  {equipmentCount}
                </div>
              </div>
            )
          }
          {
            user == 'admin' || user == 'engineer' && (
              <div className='border-gray-300 border hover:cursor-pointer rounded-md flex flex-col w-42 text-black items-center justify-center'
                onClick={ScrollToInventory}>
                <div className="bg-gray-200 w-full text-center py-2 rounded-t-md h-18 flex items-center justify-center">
                  Inventory Notifications
                </div>
                <div className="py-4 text-xl ">
                  {materialCount}
                </div>
              </div>
            )
          }
          {/* Inventory Notifications */}
          {user == 'admin' || user == 'engineer' && (

            <div className='border-gray-300 border hover:cursor-pointer rounded-md flex flex-col w-42 text-black items-center justify-center'
              onClick={() => { window.location.href = "/employees" }}>
              <div className="bg-orange-200 w-full text-center py-2 rounded-t-md h-18 flex items-center justify-center">
                Available Employees
              </div>
              <div className="py-4 text-xl ">
                {employee_count}
              </div>
            </div>
          )}
          {
            user == "admin" &&
            <div className='border-gray-300 border hover:cursor-pointer rounded-md flex flex-col w-42 text-black items-center justify-center'
              onClick={ScrollToBottom}>
              <div className="bg-violet-200 w-full text-center py-2 rounded-t-md h-18 flex items-center justify-center">
                Messages
              </div>
              <div className="py-4 text-xl ">
                {unreadMessages}
              </div>
            </div>
          }
        </div>
      </section >
      <div className="flex gap-2 w-full">
        <div className="text-center flex flex-col justify-between font-bold text-black py-2 w-1/5 rounded-lg shadow-sm border border-gray-100">
          Projects Status
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: (totalProgress.done / (totalProgress.done + totalProgress.ongoing + totalProgress.overdue)) * 100, label: 'Done', color: "#B9F8CF" },
                  { id: 1, value: (totalProgress.ongoing / (totalProgress.done + totalProgress.ongoing + totalProgress.overdue)) * 100, label: 'Ongoing', color: "#FFF085" },
                  { id: 2, value: (totalProgress.overdue / (totalProgress.done + totalProgress.ongoing + totalProgress.overdue)) * 100, label: 'Overdue', color: "#FFC9C9" },
                ],
              },
            ]}
            width={200}
            height={200}
          />
        </div>
        {(user == 'admin' || user == 'engineer') && (
          <div className="text-center pb-10 font-bold text-black py-2 w-2/5 rounded-lg shadow-sm border border-gray-100">
            Task List
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
          </div>
        )}
        {(user == 'admin' || user == 'engineer') && (
          <div className="text-center pb-10 font-bold text-black  w-2/5 rounded-lg shadow-sm border border-gray-100">
            <GanttChart data={ganttData}></GanttChart>
          </div>
        )}
      </div>
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <ProjectsTable user={user} employee_count={setEmployeeCount} setTotalProgress={setTotalProgress} openModal={openModal} setOpenModal={setOpenModal} userData={newAccount} />
      </section>

      {
        (user == "admin" || user == "engineer") &&
        <div ref={inventoryRef} className="scroll-mt-24">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <MaterialsTable user={user} setCount={setMaterialCount} />
            </section>

            <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <EquipmentsTable user={user} setCount={setEquipmentCount} />
            </section>
          </div>
        </div>
      }

      {
        user == "admin" && (
          <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-8" ref={bottomRef}>
            <InquiriesList openModal={handleOpenAdd} setNewAccount={setNewAccount} user={user} onUnreadCountChange={setUnreadMessages} />
          </section>
        )
      }
      {/* Add Account Modal */}
      <Dialog open={openAddModal} onClose={handleCloseAdd} maxWidth="sm" fullWidth PaperProps={{ className: "rounded-3xl" }}>
        <DialogTitle className="font-extrabold text-2xl text-gray-800 px-8 pt-8">
          Create New Account
          <Typography className="text-gray-500 font-normal mt-1 border-b pb-4">Assign credentials and roles for new users</Typography>
        </DialogTitle>
        <DialogContent className="px-8 pb-4">
          <Box className="flex flex-col gap-4 mt-6">
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Full Name"
              fullWidth
              disabled
              variant="outlined"
              value={newAccount.name}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="email"
              label="Email Address"
              type="email"
              fullWidth
              disabled
              variant="outlined"
              value={newAccount.email}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="password"
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              value={newAccount.password}
              onChange={handleInputChange}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Account Role</InputLabel>
              <Select
                name="role"
                value={newAccount.role}
                label="Account Role"
                onChange={handleInputChange}
                disabled
              >
                <MenuItem value="admin">Administrator</MenuItem>
                <MenuItem value="engineer">Engineer</MenuItem>
                <MenuItem value="user">Standard User</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions className="p-8 pt-2">
          <Button onClick={handleCloseAdd} className="text-gray-500 font-bold">Cancel</Button>
          <Button
            onClick={handleAddAccount}
            variant="contained"
            className="bg-blue-600 hover:bg-blue-700 font-bold px-8 py-2.5 rounded-xl shadow-md"
            disabled={!newAccount.name || !newAccount.email || !newAccount.password}
          >
            Create Account
          </Button>
        </DialogActions>
      </Dialog>
    </div >
  );
}
