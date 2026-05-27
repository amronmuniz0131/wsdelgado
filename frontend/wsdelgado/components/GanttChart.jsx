"use client";
import React, { useMemo } from 'react';
import { Gantt, ViewMode } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";

export default function GanttChart({ data }) {
  const tasks = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map((item, index) => {
      let start = item.start_date ? new Date(item.start_date) : new Date();
      let end = item.end_date ? new Date(item.end_date) : new Date();

      // If start and end are the same or invalid, fix them
      if (isNaN(start.getTime())) start = new Date();
      if (isNaN(end.getTime())) end = new Date();
      if (start.getTime() >= end.getTime()) {
        end = new Date(start);
        end.setDate(end.getDate() + 1); // Ensure end is after start
      }

      return {
        start: start,
        end: end,
        name: item.name || `Project ${index + 1}`,
        id: item.id ? String(item.id) : `task-${index}`,
        type: 'task',
        progress: item.progress ? parseInt(item.progress, 10) : 0,
        isDisabled: true,
        styles: { progressColor: '#3b82f6', progressSelectedColor: '#2563eb' }
      };
    });
  }, [data]);

  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-50 border border-gray-100 rounded-md text-gray-500">
        No project data available to display in Gantt Chart.
      </div>
    );
  }

  return (
    <div className="w-full max-w-full h-96 overflow-x-auto bg-white rounded-lg">
      <Gantt
        tasks={tasks}
        viewMode={ViewMode.Month}
        columnWidth={80}
        barProgressColor={"#3b82f6"}
        listCellWidth=""
      />
    </div>
  );
}
