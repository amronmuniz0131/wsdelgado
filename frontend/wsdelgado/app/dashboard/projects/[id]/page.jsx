"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { ArrowLeft, User, MapPin, Briefcase, CheckCircle2, Image as ImageIcon, Upload, Plus, X } from "lucide-react";

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

  const fetchProjectDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost/api/projects/single_read.php?id=${id}`);
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

  useEffect(() => {
    if (id) {
      fetchProjectDetails();
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
        {/* Header Section */}
        <Paper className="p-8 shadow-sm border border-gray-100 rounded-xl overflow-hidden relative">
          <Box className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <Box>
              <Typography variant="h4" className="font-bold text-gray-900 mb-2">
                {project.name}
              </Typography>
              <Box className="flex items-center gap-2">
                <Chip
                  label={project.progress === 100 ? "Completed" : "In Progress"}
                  color={project.progress === 100 ? "success" : "primary"}
                  size="small"
                  variant="outlined"
                />
                <Typography variant="body2" className="text-gray-500">
                  ID: #{project.id}
                </Typography>
              </Box>
            </Box>

            <Box className="flex items-center gap-4">
              <Box className="text-right">
                <Typography variant="h3" className="font-bold text-blue-600">
                  {project.progress}%
                </Typography>
                <Typography variant="caption" className="text-gray-400 font-bold uppercase tracking-wider">
                  COMPLETION PROGRESS
                </Typography>
              </Box>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress
                  variant="determinate"
                  value={project.progress}
                  size={80}
                  thickness={6}
                  className="text-blue-600"
                />
              </Box>
            </Box>
          </Box>
        </Paper>

        <Grid container spacing={4}>
          {/* Main Info Card */}
          <Grid item xs={12} md={8}>
            <Card className="shadow-sm border border-gray-100 h-full rounded-xl">
              <CardContent className="p-6">
                <Typography variant="h6" className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Briefcase size={20} className="text-blue-600" />
                  Project Information
                </Typography>

                <Box className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Box className="space-y-4">
                    <Box>
                      <Typography variant="caption" className="text-gray-400 font-bold uppercase tracking-wider">
                        Client
                      </Typography>
                      <Typography variant="body1" className="font-semibold text-gray-700">
                        {project.client}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" className="text-gray-400 font-bold uppercase tracking-wider">
                        Location
                      </Typography>
                      <Box className="flex items-start gap-1 mt-1">
                        <MapPin size={16} className="text-red-400 mt-0.5" />
                        <Typography variant="body1" className="text-gray-700">
                          {project.location}
                        </Typography>
                      </Box>
                    </Box>

                    <Box>
                      <Typography variant="caption" className="text-gray-400 font-bold uppercase tracking-wider">
                        Full Address
                      </Typography>
                      <Typography variant="body2" className="text-gray-600 leading-relaxed">
                        {project.address}
                      </Typography>
                    </Box>
                  </Box>

                  <Box className="space-y-4">
                    <Box>
                      <Typography variant="caption" className="text-gray-400 font-bold uppercase tracking-wider">
                        Team Lead / Foreman
                      </Typography>
                      <Box className="flex items-center gap-2 mt-1">
                        <User size={18} className="text-blue-400" />
                        <Typography variant="body1" className="font-semibold text-gray-700">
                          {project.foreman_name || project.foreman || "Unassigned"}
                        </Typography>
                      </Box>
                    </Box>

                    <Box>
                      <Typography variant="caption" className="text-gray-400 font-bold uppercase tracking-wider">
                        Lead Engineer
                      </Typography>
                      <Box className="flex items-center gap-2 mt-1">
                        <User size={18} className="text-green-400" />
                        <Typography variant="body1" className="font-semibold text-gray-700">
                          {project.engineer_name || project.engineer || "Unassigned"}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                <Divider className="my-6" />

                <Box className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Box>
                    <Typography variant="caption" className="text-gray-400 font-bold uppercase tracking-wider">
                      Date Started
                    </Typography>
                    <Typography variant="body1" className="font-semibold text-gray-700">
                      {project.startDate || (project.created_at ? new Date(project.created_at).toLocaleDateString() : "N/A")}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" className="text-gray-400 font-bold uppercase tracking-wider">
                      Projected Completion Date
                    </Typography>
                    <Typography variant="body1" className="font-semibold text-blue-600">
                      {project.projectedCompletionDate || "TBA"}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Stats Sidebar */}
          <Grid item xs={12} md={4}>
            <Box className="space-y-6">
              <Card className="shadow-sm border border-gray-100 rounded-xl">
                <CardContent className="p-6">
                  <Typography variant="h6" className="font-bold text-gray-800 mb-4">
                    Project Stats
                  </Typography>
                  <Divider className="mb-4" />

                  <Box className="space-y-4">
                    <Box className="flex justify-between items-center">
                      <Typography variant="body2" className="text-gray-500">Status</Typography>
                      <Chip label="Active" color="success" size="small" />
                    </Box>
                    <Box className="flex justify-between items-center">
                      <Typography variant="body2" className="text-gray-500">Team Size</Typography>
                      <Typography variant="body2" className="font-bold">12 Members</Typography>
                    </Box>
                    <Box className="flex justify-between items-center">
                      <Typography variant="body2" className="text-gray-500">Priority</Typography>
                      <Chip label="High" color="warning" size="small" />
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Card className="shadow-sm border border-gray-100 rounded-xl bg-blue-600 text-white">
                <CardContent className="p-6 text-center">
                  <CheckCircle2 size={40} className="mx-auto mb-2 text-blue-200" />
                  <Typography variant="h6" className="font-bold">Daily Report</Typography>
                  <Typography variant="body2" className="opacity-80 mb-4">
                    Project is currently following its target timeline.
                  </Typography>
                  <Button variant="contained" className="bg-white text-blue-600 hover:bg-gray-100 fullWidth">
                    View Full Audit
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>

        {/* Image Showcase Section */}
        <Box className="mt-12">
          <Box className="flex justify-between items-center mb-6">
            <Typography variant="h5" className="font-bold text-gray-800 flex items-center gap-2">
              <ImageIcon size={24} className="text-blue-600" />
              Project Gallery
            </Typography>
            <Button
              variant="contained"
              startIcon={<Plus size={18} />}
              onClick={handleOpenUpload}
              className="bg-blue-600 hover:bg-blue-700 rounded-lg px-6"
            >
              Upload Image
            </Button>
          </Box>

          {images.length === 0 ? (
            <Paper className="p-12 text-center border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-2xl">
              <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
              <Typography variant="h6" className="text-gray-400">No images uploaded yet</Typography>
              <Typography variant="body2" className="text-gray-400">Add progress photos to showcase project development</Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {images.map((image) => (
                <Grid item xs={12} sm={6} md={4} key={image.id}>
                  <Card className="group shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 rounded-2xl overflow-hidden h-full">
                    <Box className="relative h-56 w-full overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <Box className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Typography variant="caption" className="text-white font-bold bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                          {image.date}
                        </Typography>
                      </Box>
                    </Box>
                    <CardContent className="p-5">
                      <Typography variant="subtitle1" className="font-bold text-gray-800 mb-1">
                        {image.title}
                      </Typography>
                      <Typography variant="body2" className="text-gray-500 line-clamp-2">
                        {image.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
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
    </Box>
  );
}
