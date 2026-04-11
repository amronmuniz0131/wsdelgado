-- Database schema for wsdelgado Construction Management System

CREATE DATABASE IF NOT EXISTS api_db;
USE api_db;

-- 1. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    client VARCHAR(255),
    address TEXT,
    progress INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Employees Table
CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(100),
    assigned_project_id INT,
    date_of_employment DATE,
    status ENUM('available', 'ongoing', 'on leave') DEFAULT 'available',
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_project_id) REFERENCES projects(id) ON DELETE SET NULL
);

-- Add foreman and engineer references to projects after employees table exists
ALTER TABLE projects ADD COLUMN foreman_id INT;
ALTER TABLE projects ADD COLUMN engineer_id INT;
ALTER TABLE projects ADD FOREIGN KEY (foreman_id) REFERENCES employees(id) ON DELETE SET NULL;
ALTER TABLE projects ADD FOREIGN KEY (engineer_id) REFERENCES employees(id) ON DELETE SET NULL;

-- 3. Materials Table
CREATE TABLE IF NOT EXISTS materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    quantity INT DEFAULT 0,
    unit VARCHAR(50),
    status ENUM('In Stock', 'Low Stock', 'Out of Stock') DEFAULT 'In Stock',
    last_restocked DATE,
    requesting_engineer_id INT,
    project_id INT,
    price DECIMAL(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (requesting_engineer_id) REFERENCES employees(id) ON DELETE SET NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);

-- 4. Equipments Table
CREATE TABLE IF NOT EXISTS equipments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    status ENUM('Available', 'In Use', 'Maintenance') DEFAULT 'Available',
    project_id INT, -- Current Location
    operator_id INT,
    requested_by_id INT,
    estimated_hours INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
    FOREIGN KEY (operator_id) REFERENCES employees(id) ON DELETE SET NULL,
    FOREIGN KEY (requested_by_id) REFERENCES employees(id) ON DELETE SET NULL
);

-- 5. Users Table (if not already handled)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
