"use client";
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Gantt, ViewMode } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";

const DEFAULT_COLUMN_WIDTH = 100;

// Mirrors gantt-task-react's internal date math so our column count matches the rendered columns.
const addToDate = (date, quantity, scale) =>
  new Date(
    date.getFullYear() + (scale === "year" ? quantity : 0),
    date.getMonth() + (scale === "month" ? quantity : 0),
    date.getDate() + (scale === "day" ? quantity : 0),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
  );
const startOfDate = (date, scale) =>
  scale === "year"
    ? new Date(date.getFullYear(), 0, 1)
    : new Date(date.getFullYear(), date.getMonth(), 1);

// Number of month columns gantt-task-react renders for the given tasks (ViewMode.Month, preStepsCount = 1).
const getMonthColumnCount = (tasks) => {
  if (!tasks.length) return 0;

  let min = tasks[0].start;
  let max = tasks[0].start;
  for (const task of tasks) {
    if (task.start < min) min = task.start;
    if (task.end > max) max = task.end;
  }

  const start = startOfDate(addToDate(min, -1, "month"), "month");
  const end = startOfDate(addToDate(max, 1, "year"), "year");

  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  return months + 1;
};

export default function GanttChart({ data }) {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const tasks = useMemo(() => {
    if (!data || data.length == 0) return [];

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

  // The container div only renders once tasks are loaded, so the observer must
  // (re-)attach when that happens, not just on mount.
  const hasTasks = tasks.length > 0;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => setContainerWidth(el.clientWidth);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasTasks]);

  // Stretch the month columns so the chart exactly covers the full container width.
  // The chart's rendered width is dates.length * columnWidth, so divide exactly (no rounding)
  // to avoid leaving a blank strip on the right. (The library's vertical-scroll strip is
  // 1rem wide with a -1rem margin, so it consumes no layout space.)
  const columnWidth = useMemo(() => {
    const columnCount = getMonthColumnCount(tasks);
    if (!columnCount || !containerWidth) return DEFAULT_COLUMN_WIDTH;
    return Math.max(1, containerWidth / columnCount);
  }, [tasks, containerWidth]);

  if (tasks.length == 0) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-50 border border-gray-100 rounded-md text-gray-500">
        No project data available to display in Gantt Chart.
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full max-w-full h-96 overflow-x-auto bg-white rounded-lg">
      <Gantt
        tasks={tasks}
        viewMode={ViewMode.Month}
        columnWidth={columnWidth}
        barProgressColor={"#3b82f6"}
        listCellWidth=""
      />
    </div>
  );
}
