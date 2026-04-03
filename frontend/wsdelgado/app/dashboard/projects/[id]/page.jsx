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
} from "@mui/material";
import { ArrowLeft, User, MapPin, Briefcase, CheckCircle2 } from "lucide-react";

const initialProjects = [
  {
    id: "1",
    name: "Downtown Commercial Base",
    foreman: "John Smith",
    engineer: "Alice Johnson",
    location: "Bacoor",
    client: "Acme Corp",
    address: "123 Main St, Cityville",
    progress: 50,
  },
  {
    id: "2",
    name: "Riverside Residential",
    foreman: "Mike Davis",
    engineer: "Test Watson",
    location: "Sector 7",
    client: "Riverside Devs",
    address: "456 River Rd, Townsville",
    progress: 35,
  },
  {
    id: "3",
    name: "Dionela",
    foreman: "Test Foreman",
    engineer: "Test Engineer",
    location: "Imus",
    client: "Riverside Devs",
    address: "456 River Rd, Townsville",
    progress: 15,
  },
  {
    id: "4",
    name: "Atillano",
    foreman: "Mike Jords",
    engineer: "Bob the builder",
    location: "Dasmarinas",
    client: "Riverside Devs",
    address: "456 River Rd, Townsville",
    progress: 80,
  },
  {
    id: "5",
    name: "Baldicano Residential",
    foreman: "Trial Foreman",
    engineer: "Train Wreck",
    location: "Sector 27",
    client: "Riverside Devs",
    address: "456 River Rd, Townsville",
    progress: 25,
  },
  {
    id: "6",
    name: "Riverside Residential",
    foreman: "Mike Davis",
    engineer: "Bob Wilson",
    location: "Sector 457",
    client: "Riverside Devs",
    address: "456 River Rd, Townsville",
    progress: 65,
  },
];

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const foundProject = initialProjects.find((p) => p.id === id);
    setProject(foundProject);
  }, [id]);

  if (!project) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <CircularProgress />
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
                          {project.foreman}
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
                          {project.engineer}
                        </Typography>
                      </Box>
                    </Box>
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
      </Box>
    </Box>
  );
}
