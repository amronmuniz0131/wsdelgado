"use client";

import { useState, useEffect } from "react";
import { SuccessToast, DangerToast } from "@/components/useToast";
import { Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";

export default function ChangePasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (!storedData) {
      router.push("/login");
      return;
    }
    const parsedData = JSON.parse(storedData);
    setUserData(parsedData);

    // If already completed first login, redirect to dashboard or home
    if (String(parsedData.first_login) !== "0") {
      router.push("/dashboard");
    }
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      DangerToast("Passwords do not match");
      return;
    }

    if (passwords.newPassword.length < 6) {
      DangerToast("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userData.id,
          password: passwords.newPassword,
          first_login: 1
        }),
      });

      const result = await response.json();

      if (response.ok) {
        SuccessToast("Password updated successfully!");

        // Update local storage data
        const updatedUserData = { ...userData, first_login: 1 };
        localStorage.setItem("userData", JSON.stringify(updatedUserData));

        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      } else {
        DangerToast(result.message || "Failed to update password");
      }
    } catch (error) {
      console.error("Password update error:", error);
      DangerToast("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <ShieldCheck className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Secure Your Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          This is your first login. Please set a new password to continue.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="newPassword"
                className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2"
              >
                New Password
              </label>
              <div className="mt-1 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  value={passwords.newPassword}
                  onChange={handleInputChange}
                  className="appearance-none block w-full pl-12 pr-12 py-3 text-black border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all bg-gray-50/50"
                  placeholder="••••••••"
                />

                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Eye className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2"
              >
                Confirm New Password
              </label>
              <div className="mt-1 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={passwords.confirmPassword}
                  onChange={handleInputChange}
                  className="appearance-none block w-full pl-12 pr-12 py-3 text-black border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all bg-gray-50/50"
                  placeholder="••••••••"
                />

                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Eye className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-1"
              >
                {isLoading ? (
                  "Updating Password..."
                ) : (
                  <>
                    Update Password & Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-8 text-center text-xs text-gray-400 uppercase tracking-[0.2em]">
          WSDelgado Builders Management System
        </p>
      </div>
    </div>
  );
}
