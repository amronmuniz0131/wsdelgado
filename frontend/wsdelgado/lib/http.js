import { NextResponse } from "next/server";

export function json(data, status = 200) {
  return NextResponse.json(data, { status });
}

export async function readJson(req) {
  try {
    const body = await req.json();
    return body && typeof body === "object" ? body : {};
  } catch {
    return {};
  }
}

// Mirror of PHP's empty()/!empty() for the checks the API relies on.
export function notEmpty(value) {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value !== "" && value !== "0";
  if (typeof value === "number") return value !== 0 && !Number.isNaN(value);
  if (typeof value === "boolean") return value;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

export function num(value) {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

export function has(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

// Equivalent of PHP's html_entity_decode() for the entities the legacy PHP
// layer wrote via htmlspecialchars().
export function decodeEntities(value) {
  if (value === undefined || value === null) return value;
  return String(value)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'");
}

function pad(n) {
  return String(n).padStart(2, "0");
}

// MySQL-style timestamp string (server local time), e.g. "2026-10-22 14:05:09".
export function nowTs(date = new Date()) {
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  );
}

export function nowDate(date = new Date()) {
  return nowTs(date).slice(0, 10);
}

// Normalize a value to a MySQL DATETIME string, or null when absent.
export function toDateTime(value) {
  if (value === undefined || value === null || value === "") return null;
  const s = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return `${s} 00:00:00`;
  if (/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}/.test(s)) {
    return s.slice(0, 19).replace("T", " ");
  }
  return s;
}

// Normalize a value to a MySQL DATE string, or null when absent.
export function toDate(value) {
  if (value === undefined || value === null || value === "") return null;
  return String(value).trim().slice(0, 10);
}
