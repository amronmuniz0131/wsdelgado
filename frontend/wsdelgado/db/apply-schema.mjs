// Applies (idempotently) the wsdelgado schema to the Turso/libSQL database.
// Creates any missing tables, adds any missing columns, and ensures indexes.
//
// Usage: node --env-file=.env.local db/apply-schema.mjs
import { createClient } from "@libsql/client";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:local.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const TS = "DATETIME DEFAULT CURRENT_TIMESTAMP";

const schema = {
  users: [
    ["id", "INTEGER PRIMARY KEY AUTOINCREMENT"],
    ["name", "TEXT NOT NULL"],
    ["email", "TEXT NOT NULL UNIQUE"],
    ["password", "TEXT NOT NULL"],
    ["role", "TEXT DEFAULT 'user'"],
    ["first_login", "INTEGER DEFAULT 0"],
    ["created_at", TS],
    ["updated_at", TS],
  ],
  projects: [
    ["id", "INTEGER PRIMARY KEY AUTOINCREMENT"],
    ["name", "TEXT NOT NULL"],
    ["location", "TEXT"],
    ["client", "TEXT"],
    ["address", "TEXT"],
    ["progress", "INTEGER DEFAULT 0"],
    ["foreman_id", "INTEGER"],
    ["engineer_id", "INTEGER"],
    ["start_date", "DATE"],
    ["end_date", "DATE"],
    ["completion_date", "DATE"],
    ["created_at", TS],
    ["updated_at", TS],
  ],
  employees: [
    ["id", "INTEGER PRIMARY KEY AUTOINCREMENT"],
    ["employee_id", "TEXT NOT NULL UNIQUE"],
    ["name", "TEXT NOT NULL"],
    ["position", "TEXT"],
    ["assigned_project_id", "INTEGER"],
    ["date_of_employment", "DATE"],
    ["status", "TEXT DEFAULT 'available'"],
    ["email", "TEXT"],
    ["phone", "TEXT"],
    ["address", "TEXT"],
    ["notes", "TEXT"],
    ["created_at", TS],
    ["updated_at", TS],
  ],
  tasks: [
    ["id", "INTEGER PRIMARY KEY AUTOINCREMENT"],
    ["project_id", "INTEGER"],
    ["name", "TEXT NOT NULL"],
    ["description", "TEXT"],
    ["start_date", "DATE"],
    ["end_date", "DATE"],
    ["status", "TEXT"],
    ["severity", "TEXT"],
    ["quantity", "INTEGER"],
    ["actual_end", "DATE"],
    ["proof_image", "TEXT"],
    ["before_image", "TEXT"],
    ["notes", "TEXT"],
    ["finished", "INTEGER DEFAULT 0"],
    ["created_at", TS],
    ["updated_at", TS],
  ],
  task_history: [
    ["id", "INTEGER PRIMARY KEY AUTOINCREMENT"],
    ["task_id", "INTEGER"],
    ["employee_id", "INTEGER"],
    ["status", "TEXT"],
    ["notes", "TEXT"],
    ["created_at", TS],
  ],
  equipments: [
    ["id", "INTEGER PRIMARY KEY AUTOINCREMENT"],
    ["name", "TEXT NOT NULL"],
    ["type", "TEXT"],
    ["status", "TEXT DEFAULT 'Available'"],
    ["project_id", "INTEGER"],
    ["operator_id", "INTEGER"],
    ["requested_by_id", "INTEGER"],
    ["estimated_hours", "INTEGER DEFAULT 0"],
    ["borrow_date", "DATE"],
    ["return_date", "DATE"],
    ["is_approved", "INTEGER DEFAULT 0"],
    ["created_at", TS],
    ["updated_at", TS],
  ],
  materials: [
    ["id", "INTEGER PRIMARY KEY AUTOINCREMENT"],
    ["name", "TEXT NOT NULL"],
    ["quantity", "INTEGER DEFAULT 0"],
    ["unit", "TEXT"],
    ["status", "TEXT DEFAULT 'In Stock'"],
    ["last_restocked", "DATE"],
    ["requesting_engineer_id", "INTEGER"],
    ["project_id", "INTEGER"],
    ["price", "DECIMAL(15,2) DEFAULT 0.00"],
    ["max_stock", "INTEGER DEFAULT 0"],
    ["is_approved", "INTEGER DEFAULT 0"],
    ["created_at", TS],
    ["updated_at", TS],
  ],
  positions: [
    ["id", "INTEGER PRIMARY KEY AUTOINCREMENT"],
    ["position", "TEXT NOT NULL"],
  ],
  requests: [
    ["id", "INTEGER PRIMARY KEY AUTOINCREMENT"],
    ["material_id", "INTEGER"],
    ["project_id", "INTEGER"],
    ["engineer_id", "INTEGER"],
    ["quantity", "INTEGER"],
    ["request_date", "DATE"],
    ["is_approve", "INTEGER DEFAULT 0"],
    ["notes", "TEXT"],
  ],
  inquiries: [
    ["id", "INTEGER PRIMARY KEY AUTOINCREMENT"],
    ["name", "TEXT NOT NULL"],
    ["email", "TEXT NOT NULL"],
    ["subject", "TEXT"],
    ["message", "TEXT"],
    ["is_read", "INTEGER DEFAULT 0"],
    ["created_at", TS],
  ],
  gallery_albums: [
    ["id", "INTEGER PRIMARY KEY AUTOINCREMENT"],
    ["title", "TEXT NOT NULL"],
    ["caption", "TEXT"],
    ["cover_image", "TEXT"],
    ["created_at", TS],
  ],
  gallery_images: [
    ["id", "INTEGER PRIMARY KEY AUTOINCREMENT"],
    ["album_id", "INTEGER NOT NULL"],
    ["title", "TEXT"],
    ["caption", "TEXT"],
    ["image", "TEXT NOT NULL"],
    ["created_at", TS],
  ],
};

const indexes = [
  "CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users (email)",
  "CREATE UNIQUE INDEX IF NOT EXISTS idx_employees_employee_id ON employees (employee_id)",
  "CREATE INDEX IF NOT EXISTS idx_employees_project ON employees (assigned_project_id)",
  "CREATE INDEX IF NOT EXISTS idx_projects_foreman ON projects (foreman_id)",
  "CREATE INDEX IF NOT EXISTS idx_projects_engineer ON projects (engineer_id)",
  "CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks (project_id)",
  "CREATE INDEX IF NOT EXISTS idx_task_history_task ON task_history (task_id)",
  "CREATE INDEX IF NOT EXISTS idx_task_history_employee ON task_history (employee_id)",
  "CREATE INDEX IF NOT EXISTS idx_equipments_project ON equipments (project_id)",
  "CREATE INDEX IF NOT EXISTS idx_equipments_operator ON equipments (operator_id)",
  "CREATE INDEX IF NOT EXISTS idx_materials_project ON materials (project_id)",
  "CREATE INDEX IF NOT EXISTS idx_requests_material ON requests (material_id)",
  "CREATE INDEX IF NOT EXISTS idx_requests_project ON requests (project_id)",
  "CREATE INDEX IF NOT EXISTS idx_gallery_images_album ON gallery_images (album_id)",
];

// ALTER TABLE ADD COLUMN cannot carry NOT NULL / UNIQUE / PRIMARY KEY.
function addableType(def) {
  return (
    def
      .replace(/PRIMARY KEY AUTOINCREMENT/i, "")
      .replace(/NOT NULL/gi, "")
      .replace(/UNIQUE/gi, "")
      .trim() || "TEXT"
  );
}

let added = 0;

for (const [table, cols] of Object.entries(schema)) {
  const defs = cols.map(([name, def]) => `${name} ${def}`).join(", ");
  await turso.execute(`CREATE TABLE IF NOT EXISTS ${table} (${defs})`);

  const info = await turso.execute(`PRAGMA table_info(${table})`);
  const existing = new Set(info.rows.map((r) => r.name));

  for (const [name, def] of cols) {
    if (!existing.has(name)) {
      await turso.execute(`ALTER TABLE ${table} ADD COLUMN ${name} ${addableType(def)}`);
      console.log(`+ ${table}.${name}`);
      added++;
    }
  }
  console.log(`ok ${table}`);
}

for (const stmt of indexes) {
  await turso.execute(stmt);
}

console.log(`\nDone. Added ${added} column(s).`);
