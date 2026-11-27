"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/api";
import { SuccessToast, DangerToast } from "@/components/useToast";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Plus, Trash2, Upload, X, Pencil } from "lucide-react";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2MB

export default function ServicesBackofficePage() {
  return (
    <RoleProtectedRoute allowedRoles={["admin"]}>
      <ServicesBackoffice />
    </RoleProtectedRoute>
  );
}

function ServicesBackoffice() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", image: "", sort_order: 0 });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/services/read`);
      const data = await response.json();
      setServices(data.records || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error("Failed to load image"));
        img.onload = () => {
          const encode = (width, quality) => {
            const scale = width / img.width;
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = Math.round(img.height * scale);
            canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
            return canvas.toDataURL("image/jpeg", quality);
          };

          let width = Math.min(1600, img.width);
          let quality = 0.8;
          let dataUrl = encode(width, quality);

          while (dataUrl.length > MAX_IMAGE_BYTES && quality > 0.3) {
            quality -= 0.15;
            dataUrl = encode(width, quality);
          }
          while (dataUrl.length > MAX_IMAGE_BYTES && width > 400) {
            width = Math.round(width * 0.7);
            quality = 0.8;
            dataUrl = encode(width, quality);
            while (dataUrl.length > MAX_IMAGE_BYTES && quality > 0.3) {
              quality -= 0.15;
              dataUrl = encode(width, quality);
            }
          }

          resolve(dataUrl);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      DangerToast("Please select only image files.");
      return;
    }

    try {
      const compressed = await compressImage(file);
      setForm((prev) => ({ ...prev, image: compressed }));
    } catch (err) {
      console.error(err);
      DangerToast("Failed to process image.");
    }
    e.target.value = "";
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({ name: "", description: "", image: "", sort_order: 0 });
    setOpenModal(true);
  };

  const handleOpenEdit = (service) => {
    setEditingId(service.id);
    setForm({
      name: service.name || "",
      description: service.description || "",
      image: service.image || "",
      sort_order: service.sort_order ?? 0,
    });
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setEditingId(null);
    setForm({ name: "", description: "", image: "", sort_order: 0 });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const isUpdate = !!editingId;
      const response = await fetch(
        `${API_BASE_URL}/services/${isUpdate ? "update" : "create"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            isUpdate ? { id: editingId, ...form } : form
          ),
        }
      );

      if (response.ok) {
        SuccessToast(isUpdate ? "Service updated successfully" : "Service created successfully");
        handleClose();
        fetchServices();
      } else {
        const error = await response.json();
        DangerToast(error.message || "Failed to save service");
      }
    } catch (error) {
      console.error("Error saving service:", error);
      DangerToast("An error occurred while saving the service.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      const response = await fetch(`${API_BASE_URL}/services/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteTarget.id }),
      });

      if (response.ok) {
        SuccessToast("Service deleted successfully");
        fetchServices();
      } else {
        const error = await response.json();
        DangerToast(error.message || "Failed to delete service");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      DangerToast("An error occurred while deleting.");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-6 space-y-8">
      <Box className="flex justify-between items-center">
        <Typography variant="h5" component="h1" className="text-gray-800 font-bold">
          Services Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 capitalize"
        >
          Add Service
        </Button>
      </Box>

      {isLoading ? (
        <Box className="flex justify-center py-16">
          <CircularProgress />
        </Box>
      ) : services.length === 0 ? (
        <Box className="bg-white rounded-lg border border-gray-200">
          <Typography className="text-center text-gray-500 py-16">
            No services yet. Add your first service!
          </Typography>
        </Box>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Box
              key={service.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col"
            >
              {service.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full aspect-square object-cover"
                />
              ) : (
                <Box className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                  <Typography className="text-gray-400">No image</Typography>
                </Box>
              )}
              <Box className="p-4 flex flex-col flex-1">
                <Typography variant="h6" className="font-bold text-gray-900 capitalize">
                  {service.name}
                </Typography>
                <Typography variant="body2" className="text-gray-500 mt-1 flex-1">
                  {service.description}
                </Typography>
                <Typography variant="caption" className="text-gray-400 mt-2">
                  Sort order: {service.sort_order}
                </Typography>
                <Box className="flex gap-2 mt-4">
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Pencil size={16} />}
                    onClick={() => handleOpenEdit(service)}
                    className="capitalize"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<Trash2 size={16} />}
                    onClick={() => setDeleteTarget(service)}
                    className="capitalize"
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            </Box>
          ))}
        </div>
      )}

      {/* Create / Edit Service Modal */}
      <Dialog open={openModal} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle className="font-bold text-gray-800 border-b border-gray-100 pb-4">
          {editingId ? "Edit Service" : "Add Service"}
        </DialogTitle>
        <DialogContent className="pt-6">
          <Box className="flex flex-col gap-4">
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Service Name"
              type="text"
              fullWidth
              variant="outlined"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              name="description"
              label="Description"
              type="text"
              fullWidth
              variant="outlined"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              multiline
              rows={3}
            />
            <TextField
              margin="dense"
              name="sort_order"
              label="Sort Order"
              type="number"
              fullWidth
              variant="outlined"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
            />

            {/* Image Upload */}
            <Box>
              <input
                accept="image/*"
                id="service-image-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              <label htmlFor="service-image-upload">
                <Box className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors">
                  <Upload size={24} className="text-gray-400" />
                  <Typography variant="body2" className="font-bold text-gray-600">
                    Upload Image
                  </Typography>
                  <Typography variant="caption" className="text-gray-400">
                    Click to select an image (auto-compressed)
                  </Typography>
                </Box>
              </label>
              {form.image && (
                <Box className="relative mt-3 w-40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.image}
                    alt="Service preview"
                    className="w-40 h-40 object-cover rounded-lg border border-gray-200"
                  />
                  <IconButton
                    size="small"
                    onClick={() => setForm((prev) => ({ ...prev, image: "" }))}
                    className="!absolute top-1 right-1 bg-white/90 hover:bg-red-50"
                    aria-label="Remove image"
                  >
                    <X size={14} className="text-red-600" />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions className="p-4 border-t border-gray-100">
          <Button onClick={handleClose} color="inherit" className="text-gray-600 hover:bg-gray-100">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            className="bg-blue-600 hover:bg-blue-700 capitalize"
            disabled={isSubmitting || !form.name}
          >
            {isSubmitting ? <CircularProgress size={24} /> : editingId ? "Save Changes" : "Add Service"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle className="font-bold text-gray-800">Delete Service</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete &quot;{deleteTarget?.name}&quot;? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions className="p-4 border-t border-gray-100">
          <Button onClick={() => setDeleteTarget(null)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error" className="capitalize">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
