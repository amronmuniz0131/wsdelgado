import { EmployeesTable } from "@/components/EmployeesTable";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";

export default function EmployeesPage() {
  return (
    <RoleProtectedRoute allowedRoles={["admin", "engineer"]}>
      <div className="p-4 md:p-12 min-h-screen bg-white">
        <EmployeesTable />
      </div>
    </RoleProtectedRoute>
  );
}
