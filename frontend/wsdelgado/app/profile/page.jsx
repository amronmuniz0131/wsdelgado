"use client";
import { useEffect, useState } from "react";
import { Box, TextField, Button, Typography, CircularProgress } from "@mui/material";
import { API_BASE_URL } from "@/lib/api";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function ProfilePage() {
    const [user, setUser] = useState({ id: "", name: "", email: "", role: "" });
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState(""); // "success" or "error"

    // Load user data from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("userData");
        if (stored) {
            const parsed = JSON.parse(stored);
            setUser({ id: parsed.id || "", name: parsed.name || "", email: parsed.email || "", role: parsed.role || "" });
        }
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");
        // Validate new passwords match when user intends to change password
        if (newPassword || confirmPassword) {
            if (newPassword !== confirmPassword) {
                setMessage("New passwords do not match.");
                setStatus("error");
                setSaving(false);
                return;
            }
            if (!currentPassword) {
                setMessage("Please provide your current password.");
                setStatus("error");
                setSaving(false);
                return;
            }
        }
        try {
            const payload = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                ...(newPassword && { password: newPassword }),
                ...(currentPassword && { current_password: currentPassword })
            };
            const response = await fetch(`${API_BASE_URL}/update`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (response.ok) {
                const updated = { ...user, name: user.name, email: user.email };
                localStorage.setItem("userData", JSON.stringify(updated));
                setMessage("Profile updated successfully.");
                setStatus("success");
                // Clear password fields
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                setMessage(result.message || "Failed to update profile.");
                setStatus("error");
            }
        } catch (err) {
            console.error(err);
            setMessage("An error occurred while updating.");
            setStatus("error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box className="p-4 md:p-12 min-h-screen bg-white">
            <Typography variant="h4" className="font-bold mb-6 text-gray-800">
                Edit Profile
            </Typography>
            <Box component="form" onSubmit={handleSave} sx={{ maxWidth: 500 }}>
                <TextField
                    label="Full Name"
                    value={user.name}
                    fullWidth
                    required
                    margin="normal"
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
                <TextField
                    label="Email"
                    type="email"
                    value={user.email}
                    fullWidth
                    required
                    margin="normal"
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
                <TextField
                    label="Current Password"
                    type="password"
                    value={currentPassword}
                    fullWidth
                    margin="normal"
                    placeholder="Enter current password to change"
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <TextField
                    label="New Password"
                    type="password"
                    value={newPassword}
                    fullWidth
                    margin="normal"
                    placeholder="Leave blank to keep current"
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextField
                    label="Confirm New Password"
                    type="password"
                    value={confirmPassword}
                    fullWidth
                    margin="normal"
                    placeholder="Confirm new password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Box className="mt-4 flex items-center space-x-4">
                    <Button type="submit" variant="contained" disabled={saving}>
                        {saving ? <CircularProgress size={20} color="inherit" /> : "Save Changes"}
                    </Button>
                    {message && (
                        <Box className={`flex items-center ${status === "success" ? "text-green-600" : "text-red-600"}`}>
                            {status === "success" ? <CheckCircle size={20} className="mr-1" /> : <AlertCircle size={20} className="mr-1" />}
                            <Typography variant="body2">{message}</Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

