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


export default function ProjectDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    setUserRole(localStorage.getItem("user")); // Use 'user' key as defined in login/page.jsx
    if (id) {
      fetchProjectDetails();
      fetchMaterials();
      fetchEquipments();
      fetchTeam();
    }
  }, [id]);

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
                label={project.progress === 100 ? "Completed" : "In Progress"}
                color={project.progress === 100 ? "success" : "primary"}
                className="font-bold rounded-lg"
              />
              <Typography variant="body2" className="text-gray-400 font-medium">#{project.id} • Registered {new Date(project.created_at).toLocaleDateString()}</Typography>
            </Box>
          </Box>

          <Box className="z-10 flex items-center gap-8 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
            <Box className="text-right">
              <Typography variant="h3" className="font-black text-blue-600 leading-none">
                {project.progress}<span className="text-xl">%</span>
              </Typography>
              <Typography variant="caption" className="text-gray-400 font-bold uppercase tracking-tighter">Progress</Typography>
            </Box>
            <Box sx={{ position: 'relative' }}>
              <CircularProgress
                variant="determinate"
                value={project.progress}
                size={60}
                thickness={8}
                className="text-blue-600"
              />
            </Box>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Main Context - Left Column */}
          <Grid item xs={12} lg={9} className="space-y-6">
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
                      <Chip label="On Schedule" size="small" className="h-5 text-[10px] bg-blue-100 text-blue-700 font-black" />
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" className="text-gray-400 text-[9px] uppercase font-bold block">Start</Typography>
                        <Typography variant="body2" className="font-bold text-gray-700">{project.startDate || (project.created_at ? new Date(project.created_at).toLocaleDateString() : "N/A")}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" className="text-gray-400 text-[9px] uppercase font-bold block">Target</Typography>
                        <Typography variant="body2" className="font-bold text-blue-600">{project.projectedCompletionDate || "TBA"}</Typography>
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
                <Chip label={`${team.length} Active`} size="small" variant="outlined" className="text-[10px] font-bold" />
              </Box>
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/30 border-b border-gray-100">
                    <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase">Employee</th>
                    <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase text-center">Contact</th>
                    <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {team.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-gray-300 text-sm">No members linked</td>
                    </tr>
                  ) : (
                    team.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-3">
                          <Typography variant="body2" className="font-bold text-gray-700 text-xs">{member.name}</Typography>
                          <Typography className="text-[10px] text-gray-400 uppercase">{member.position}</Typography>
                        </td>
                        <td className="px-6 py-3 text-center">
                          <Typography className="text-[11px] font-medium text-gray-600">{member.phone || member.email || "-"}</Typography>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <Chip
                            label={member.status}
                            size="small"
                            className={`h-5 text-[9px] font-black uppercase ${member.status === "Available" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                              }`}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </Card>
          </Grid>

          {/* Right Sidebar - Action & Stats */}
          <Grid item xs={12} lg={3} className="space-y-4">
            <Box className="space-y-4 sticky top-6">
              {userRole === "engineer" && (
                <Box className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                  <Typography variant="caption" className="text-gray-400 font-bold uppercase tracking-widest pl-1">Actions</Typography>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Package size={16} />}
                    onClick={handleOpenRequest}
                    className="bg-orange-500 hover:bg-orange-600 h-11 rounded-xl font-bold shadow-none text-white normal-case"
                  >
                    Request Material
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Briefcase size={16} />}
                    onClick={handleOpenEquipmentRequest}
                    className="bg-blue-600 hover:bg-blue-700 h-11 rounded-xl font-bold shadow-none text-white normal-case"
                  >
                    Request Equipment
                  </Button>
                </Box>
              )}

              <Box className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-xl shadow-blue-100">
                <Typography variant="h6" className="font-bold mb-1 leading-tight">Daily Status</Typography>
                <Typography variant="body2" className="opacity-70 text-xs mb-4">On track with adjusted timelines for Q2 delivery.</Typography>
                <Button fullWidth className="bg-white/10 hover:bg-white/20 text-white border-white/20 border text-xs py-2 rounded-lg normal-case font-bold">
                  View Latest Audit
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

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
                  {m.name} ({m.unit})
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

    </Box>
  );
}
