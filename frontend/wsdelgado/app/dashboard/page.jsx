"use client";

import { useEffect, useState } from "react";

import { ProjectsTable } from "@/components/ProjectsTable";
import { MaterialsTable } from "@/components/MaterialsTable";
import { EquipmentsTable } from "@/components/EquipmentsTable";

export default function DashboardPage() {
  const [user, setUser] = useState("");
  useEffect(() => {
    setUser(localStorage.getItem("user"));
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      window.location.href = "/login";
    }
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2 capitalize">{user} Dashboard</h1>

      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <ProjectsTable user={user} />
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <MaterialsTable user={user} />
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <EquipmentsTable user={user} />
        </section>
      </div>
    </div>
  );
}
