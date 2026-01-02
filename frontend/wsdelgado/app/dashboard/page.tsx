"use client";

import { Placeholder } from "@/components/Placeholder";
import { useEffect } from "react";

export default function DashboardPage() {
    useEffect(() => {
        const isAuthenticated = localStorage.getItem("isAuthenticated");
        console.log(isAuthenticated)
        if (!isAuthenticated) {
            window.location.href = "/login";
        }
    }, []);
    return (
        <div>Test</div>
    );
}
