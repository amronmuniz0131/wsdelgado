import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Box,
  IconButton,
} from "@mui/material";
import { Upload, X } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { SuccessToast, DangerToast } from "@/components/useToast";

export default function UpdateTaskStatus({ isOpen, handleClose, task, onUpdate }) {
  const [finished, setFinished] = useState(0);
  const [proofImage, setProofImage] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (task) {
      setFinished(0);
      setProofImage("");
      setNotes("");
    }
  }, [task, isOpen]);

  const toLocalDatetime = (date) => {
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2MB

  // Downscale + re-encode the image until its base64 size is under the limit
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

          // Base64 is ~4/3 the binary size, so target with headroom
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

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      DangerToast("Please select an image file.");
      return;
    }

    try {
      const compressed = await compressImage(file);
      setProofImage(compressed);
    } catch (err) {
      console.error(err);
      DangerToast("Failed to process image.");
    }
    e.target.value = "";
  };

  const handleSubmit = async () => {
    if (!proofImage) {
      DangerToast("Please upload an image as proof of completion.");
      return;
    }

    if (Number(finished) > Number(task?.quantity)) {
      return; // Handled by UI feedback, but adding a guard here too
    }

    const newTotal = 1

    try {
      const payload = {
        id: task.id,
        finished: newTotal,
        actual_end: toLocalDatetime(new Date()),
        proof_image: proofImage,
        notes: notes.trim(),
      };

      if (newTotal == Number(task.quantity)) {
        // payload.end_date = new Date().toISOString().split('T')[0];
      }

      const response = await fetch(`${API_BASE_URL}/tasks/update.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        SuccessToast("Task progress updated successfully!");
        onUpdate();
        handleClose();
        // window.location.reload();

      } else {
        const error = await response.json();
        DangerToast(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const remaining = Number(task?.quantity) - Number(task?.finished);
  const isError = Number(finished) > remaining;

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="xs" fullWidth PaperProps={{ className: "rounded-2xl" }}>
      <DialogTitle className="font-bold text-gray-800 border-b border-gray-100 pb-4">
        Update Task Progress
      </DialogTitle>
      <DialogContent className="pt-6 space-y-4">
        <Typography variant="body2" className="text-gray-600 !mb-4">
          Complete task for: <span className="font-bold text-blue-600">{task?.name}</span>
        </Typography>

        {/* Proof Image Upload */}
        <Box>
          <input
            accept="image/*"
            id="proof-image-upload"
            type="file"
            className="hidden"
            onChange={handleImageChange}
          />
          {!proofImage ? (
            <label htmlFor="proof-image-upload">
              <Box className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors">
                <Upload size={24} className="text-gray-400" />
                <Typography variant="body2" className="font-bold text-gray-600">
                  Upload Proof Image <span className="text-red-500">*</span>
                </Typography>
                <Typography variant="caption" className="text-gray-400">
                  Click to select an image (auto-compressed)
                </Typography>
              </Box>
            </label>
          ) : (
            <Box className="relative rounded-xl overflow-hidden border border-gray-200">
              <img src={proofImage} alt="Proof preview" className="w-full h-48 object-cover" />
              <IconButton
                size="small"
                onClick={() => setProofImage("")}
                className="!absolute top-2 right-2 bg-white/90 hover:bg-white"
              >
                <X size={16} />
              </IconButton>
            </Box>
          )}
        </Box>

        {/* Completion Notes */}
        <TextField
          label="Notes"
          multiline
          rows={3}
          fullWidth
          variant="outlined"
          placeholder="Add any remarks about the completed task..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </DialogContent>
      <DialogActions className="p-4 border-t border-gray-100">
        <Button onClick={handleClose} className="text-gray-500 font-bold">Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isError || !proofImage}
          className={`${isError || !proofImage ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700'} rounded-lg px-6`}
        >
          Complete Task
        </Button>
      </DialogActions>
    </Dialog>
  );
}
