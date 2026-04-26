"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * A wrapper component to protect routes based on user roles.
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component/page to render if authorized.
 * @param {string[]} props.allowedRoles - Array of roles allowed to access this route (e.g., ['admin', 'engineer']).
 */
export default function RoleProtectedRoute({ children, allowedRoles }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    const role = localStorage.getItem("user");

    if (!auth) {
      router.push("/login");
      return;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
      // If not authorized, redirect to dashboard or home
      router.push("/dashboard");
      return;
    }

    setIsAuthorized(true);
  }, [router, allowedRoles]);

  if (!isAuthorized) {
    // Optionally return a loading state or a blank screen while checking
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
