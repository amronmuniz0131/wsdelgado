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
import { Plus, Trash2, Upload, X, Images } from "lucide-react";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2MB

export default function GalleryBackofficePage() {
  return (
    <RoleProtectedRoute allowedRoles={["admin"]}>
      <GalleryBackoffice />
    </RoleProtectedRoute>
  );
}

function GalleryBackoffice() {
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [newAlbum, setNewAlbum] = useState({ title: "", caption: "" });
  const [newImages, setNewImages] = useState([]);
  const [deleteAlbumTarget, setDeleteAlbumTarget] = useState(null);
  const [deleteImageTarget, setDeleteImageTarget] = useState(null);
  const [addImagesTarget, setAddImagesTarget] = useState(null);
  const [extraImages, setExtraImages] = useState([]);

  const fetchGallery = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/gallery/read.php`);
      const data = await response.json();
      setAlbums(data.records || []);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
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

  const handleFilesChange = async (e, setImages) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const invalid = files.find((f) => !f.type.startsWith("image/"));
    if (invalid) {
      DangerToast("Please select only image files.");
      return;
    }

    try {
      const compressed = await Promise.all(files.map((f) => compressImage(f)));
      setImages((prev) => [...prev, ...compressed.map((image) => ({ image, title: "", caption: "" }))]);
    } catch (err) {
      console.error(err);
      DangerToast("Failed to process images.");
    }
    e.target.value = "";
  };

  const handleClose = () => {
    setOpenModal(false);
    setNewAlbum({ title: "", caption: "" });
    setNewImages([]);
  };

  const handleCreateAlbum = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/gallery/create.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newAlbum, images: newImages }),
      });

      if (response.ok) {
        SuccessToast("Album created successfully");
        handleClose();
        fetchGallery();
      } else {
        const error = await response.json();
        DangerToast(error.message || "Failed to create album");
      }
    } catch (error) {
      console.error("Error creating album:", error);
      DangerToast("An error occurred while creating the album.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddImages = async () => {
    if (!addImagesTarget || !extraImages.length) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/gallery/add_images.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ album_id: addImagesTarget.id, images: extraImages }),
      });

      if (response.ok) {
        SuccessToast("Images added to album successfully");
        setAddImagesTarget(null);
        setExtraImages([]);
        fetchGallery();
      } else {
        const error = await response.json();
        DangerToast(error.message || "Failed to add images");
      }
    } catch (error) {
      console.error("Error adding images:", error);
      DangerToast("An error occurred while adding images.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAlbum = async () => {
    if (!deleteAlbumTarget) return;

    try {
      const response = await fetch(`${API_BASE_URL}/gallery/delete.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteAlbumTarget.id }),
      });

      if (response.ok) {
        SuccessToast("Album deleted successfully");
        fetchGallery();
      } else {
        const error = await response.json();
        DangerToast(error.message || "Failed to delete album");
      }
    } catch (error) {
      console.error("Error deleting album:", error);
      DangerToast("An error occurred while deleting.");
    } finally {
      setDeleteAlbumTarget(null);
    }
  };

  const handleDeleteImage = async () => {
    if (!deleteImageTarget) return;

    try {
      const response = await fetch(`${API_BASE_URL}/gallery/delete_image.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteImageTarget.id }),
      });

      if (response.ok) {
        SuccessToast("Image deleted successfully");
        fetchGallery();
      } else {
        const error = await response.json();
        DangerToast(error.message || "Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      DangerToast("An error occurred while deleting.");
    } finally {
      setDeleteImageTarget(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-6 space-y-8">
      <Box className="flex justify-between items-center">
        <Typography variant="h5" component="h1" className="text-gray-800 font-bold">
          Gallery Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => setOpenModal(true)}
          className="bg-blue-600 hover:bg-blue-700 capitalize"
        >
          Create Album
        </Button>
      </Box>

      {isLoading ? (
        <Box className="flex justify-center py-16">
          <CircularProgress />
        </Box>
      ) : albums.length === 0 ? (
        <Box className="bg-white rounded-lg border border-gray-200">
          <Typography className="text-center text-gray-500 py-16">
            No albums yet. Create your first album!
          </Typography>
        </Box>
      ) : (
        <div className="flex flex-col gap-6">
          {albums.map((album) => (
            <Box
              key={album.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <Box className="flex justify-between items-start mb-4 gap-4">
                <Box>
                  <Typography variant="h6" className="font-bold text-gray-900">
                    {album.title}
                  </Typography>
                  {album.caption && (
                    <Typography variant="body2" className="text-gray-500">
                      {album.caption}
                    </Typography>
                  )}
                  <Typography variant="caption" className="text-gray-400">
                    {album.images.length} image{album.images.length !== 1 ? "s" : ""}
                  </Typography>
                </Box>
                <Box className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Plus size={16} />}
                    onClick={() => {
                      setAddImagesTarget(album);
                      setExtraImages([]);
                    }}
                    className="capitalize"
                  >
                    Add Images
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<Trash2 size={16} />}
                    onClick={() => setDeleteAlbumTarget(album)}
                    className="capitalize"
                  >
                    Delete Album
                  </Button>
                </Box>
              </Box>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {album.images.map((img) => (
                  <Box key={img.id} className="relative group rounded-lg overflow-hidden border border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.image}
                      alt={img.title || album.title}
                      className="w-full aspect-square object-cover"
                    />
                    <IconButton
                      size="small"
                      onClick={() => setDeleteImageTarget({ ...img, album_title: album.title })}
                      className="!absolute top-1 right-1 bg-white/90 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Delete image"
                    >
                      <Trash2 size={14} className="text-red-600" />
                    </IconButton>
                  </Box>
                ))}
              </div>
            </Box>
          ))}
        </div>
      )}

      {/* Create Album Modal */}
      <Dialog open={openModal} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle className="font-bold text-gray-800 border-b border-gray-100 pb-4">
          Create Album
        </DialogTitle>
        <DialogContent className="pt-6">
          <Box className="flex flex-col gap-4">
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Album Title"
              type="text"
              fullWidth
              variant="outlined"
              value={newAlbum.title}
              onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              name="caption"
              label="Album Caption"
              type="text"
              fullWidth
              variant="outlined"
              value={newAlbum.caption}
              onChange={(e) => setNewAlbum({ ...newAlbum, caption: e.target.value })}
              multiline
              rows={2}
            />

            {/* Multi Image Upload */}
            <Box>
              <input
                accept="image/*"
                id="album-images-upload"
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFilesChange(e, setNewImages)}
              />
              <label htmlFor="album-images-upload">
                <Box className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors">
                  <Upload size={24} className="text-gray-400" />
                  <Typography variant="body2" className="font-bold text-gray-600">
                    Upload Images <span className="text-red-500">*</span>
                  </Typography>
                  <Typography variant="caption" className="text-gray-400">
                    Click to select multiple images (auto-compressed)
                  </Typography>
                </Box>
              </label>
              {newImages.length > 0 && (
                <Box className="mt-3">
                  <Typography variant="caption" className="text-gray-500">
                    {newImages.length} image{newImages.length !== 1 ? "s" : ""} selected. The first image becomes the album cover.
                  </Typography>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {newImages.map((img, idx) => (
                      <Box key={idx} className="relative rounded-lg overflow-hidden border border-gray-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.image} alt={`Upload ${idx + 1}`} className="w-full aspect-square object-cover" />
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 text-[9px] font-black uppercase bg-blue-600 text-white px-1.5 py-0.5 rounded">
                            Cover
                          </span>
                        )}
                        <IconButton
                          size="small"
                          onClick={() => setNewImages((prev) => prev.filter((_, i) => i !== idx))}
                          className="!absolute top-1 right-1 bg-white/90 hover:bg-red-50"
                          aria-label="Remove image"
                        >
                          <X size={14} className="text-red-600" />
                        </IconButton>
                      </Box>
                    ))}
                  </div>
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
            onClick={handleCreateAlbum}
            variant="contained"
            className="bg-blue-600 hover:bg-blue-700 capitalize"
            disabled={isSubmitting || !newAlbum.title || newImages.length === 0}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Create Album"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Images Modal */}
      <Dialog
        open={!!addImagesTarget}
        onClose={() => {
          setAddImagesTarget(null);
          setExtraImages([]);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="font-bold text-gray-800 border-b border-gray-100 pb-4">
          Add Images to &quot;{addImagesTarget?.title}&quot;
        </DialogTitle>
        <DialogContent className="pt-6">
          <Box>
            <input
              accept="image/*"
              id="extra-images-upload"
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFilesChange(e, setExtraImages)}
            />
            <label htmlFor="extra-images-upload">
              <Box className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors">
                <Upload size={24} className="text-gray-400" />
                <Typography variant="body2" className="font-bold text-gray-600">
                  Upload Images
                </Typography>
                <Typography variant="caption" className="text-gray-400">
                  Click to select multiple images (auto-compressed)
                </Typography>
              </Box>
            </label>
            {extraImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {extraImages.map((img, idx) => (
                  <Box key={idx} className="relative rounded-lg overflow-hidden border border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.image} alt={`Upload ${idx + 1}`} className="w-full aspect-square object-cover" />
                    <IconButton
                      size="small"
                      onClick={() => setExtraImages((prev) => prev.filter((_, i) => i !== idx))}
                      className="!absolute top-1 right-1 bg-white/90 hover:bg-red-50"
                      aria-label="Remove image"
                    >
                      <X size={14} className="text-red-600" />
                    </IconButton>
                  </Box>
                ))}
              </div>
            )}
          </Box>
        </DialogContent>
        <DialogActions className="p-4 border-t border-gray-100">
          <Button
            onClick={() => {
              setAddImagesTarget(null);
              setExtraImages([]);
            }}
            color="inherit"
            className="text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddImages}
            variant="contained"
            className="bg-blue-600 hover:bg-blue-700 capitalize"
            disabled={isSubmitting || extraImages.length === 0}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Add Images"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Album Confirmation */}
      <Dialog
        open={!!deleteAlbumTarget}
        onClose={() => setDeleteAlbumTarget(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle className="font-bold text-gray-800">Delete Album</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete &quot;{deleteAlbumTarget?.title}&quot; and all
            its {deleteAlbumTarget?.images?.length} image
            {deleteAlbumTarget?.images?.length !== 1 ? "s" : ""}? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions className="p-4 border-t border-gray-100">
          <Button onClick={() => setDeleteAlbumTarget(null)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteAlbum} variant="contained" color="error" className="capitalize">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Single Image Confirmation */}
      <Dialog
        open={!!deleteImageTarget}
        onClose={() => setDeleteImageTarget(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle className="font-bold text-gray-800">Delete Image</DialogTitle>
        <DialogContent>
          <Box className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={deleteImageTarget?.image}
              alt="To delete"
              className="w-20 h-20 object-cover rounded-lg border border-gray-200"
            />
            <Typography>
              Remove this image from &quot;{deleteImageTarget?.album_title}&quot;?
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions className="p-4 border-t border-gray-100">
          <Button onClick={() => setDeleteImageTarget(null)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteImage} variant="contained" color="error" className="capitalize">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
