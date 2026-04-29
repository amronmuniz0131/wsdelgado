-- Turso (libSQL) Data Seed for wsdelgado
-- This file contains the data migrated from the MySQL local database.

-- Positions
INSERT INTO positions (id, position) VALUES (1, 'Engineer');
INSERT INTO positions (id, position) VALUES (2, 'Admin');
INSERT INTO positions (id, position) VALUES (3, 'Foreman');
INSERT INTO positions (id, position) VALUES (4, 'Mason');
INSERT INTO positions (id, position) VALUES (5, 'Carpenter');
INSERT INTO positions (id, position) VALUES (6, 'Electrician');

-- Users
INSERT INTO users (id, name, email, password, role, created_at, updated_at, first_login) VALUES (1, 'Admin User', 'admin@gmail.com', '$2y$10$T3Gf5.Li0b7kG.2i68tC2.EqZJqg3zYP9beHDhJZTu8sXM6k/izjK', 'admin', '2026-04-11 17:15:09', '2026-04-28 05:46:26', 1);
INSERT INTO users (id, name, email, password, role, created_at, updated_at, first_login) VALUES (14, 'User', 'user@gmail.com', '$2y$10$/rKRQkkKT4A5/WxWbYSPeuv8vsek9zDYP3ofBHCDct4tTZdQ/SWEK', 'user', '2026-04-28 07:25:48', '2026-04-28 07:25:48', 0);
INSERT INTO users (id, name, email, password, role, created_at, updated_at, first_login) VALUES (15, 'engineer', 'engineer@gmail.com', '$2y$10$JhQIKqU1W2X1beWLRYAQ0ehkmS5R73B5YA32w/c/fLaoC2Dt55ieO', 'engineer', '2026-04-28 07:25:59', '2026-04-28 07:41:03', 1);

-- Employees
INSERT INTO employees (id, employee_id, name, position, assigned_project_id, date_of_employment, status, email, phone, address, notes, created_at, updated_at) VALUES (16, 'EMP-4AD7B', 'engineer', 'engineer', 18, '2026-04-28', '', 'engineer@gmail.com', '', '', '', '2026-04-28 07:25:59', '2026-04-28 07:26:24');
INSERT INTO employees (id, employee_id, name, position, assigned_project_id, date_of_employment, status, email, phone, address, notes, created_at, updated_at) VALUES (17, 'EMP-2', 'Test Emp', 'Electrician', NULL, '2026-04-28', 'available', '', '', '', '', '2026-04-28 07:26:10', '2026-04-28 07:26:10');

-- Projects
INSERT INTO projects (id, name, location, client, address, progress, created_at, updated_at, foreman_id, engineer_id, start_date, end_date, completion_date) VALUES (18, 'Project', 'Test', '14', '', 0, '2026-04-28 07:26:24', '2026-04-28 07:27:39', NULL, 16, '2026-04-28', '2026-04-30', NULL);

-- Tasks
INSERT INTO tasks (id, name, status, severity, quantity, finished, project_id, start_date, end_date) VALUES (27, 'New Task', 1, 1, 1, 0, 18, '2026-04-28', NULL);

-- Task History
INSERT INTO task_history (id, employee_id, task_id, created_at) VALUES (56, 17, 27, '2026-04-28 07:28:06');
