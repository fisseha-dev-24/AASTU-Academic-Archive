-- AASTU Academic Archive Database Setup
-- Clean and recreate database with proper AASTU structure

-- Drop existing database if exists
DROP DATABASE IF EXISTS aastu_academic_archive;

-- Create database
CREATE DATABASE aastu_academic_archive;
USE aastu_academic_archive;

-- Create colleges table
CREATE TABLE colleges (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- Create departments table
CREATE TABLE departments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    college_id BIGINT UNSIGNED NOT NULL,
    description TEXT,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
);

-- Create categories table
CREATE TABLE categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL
);

-- Create users table
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL DEFAULT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher', 'department_head', 'college_dean', 'it_manager') DEFAULT 'student',
    student_id VARCHAR(50) NULL,
    department_id BIGINT UNSIGNED NULL,
    remember_token VARCHAR(100) NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- Create documents table
CREATE TABLE documents (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_path VARCHAR(255) NOT NULL,
    file_size BIGINT UNSIGNED,
    file_type VARCHAR(100),
    user_id BIGINT UNSIGNED NOT NULL,
    category_id BIGINT UNSIGNED NULL,
    department_id BIGINT UNSIGNED NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- Create document_reviews table
CREATE TABLE document_reviews (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    document_id BIGINT UNSIGNED NOT NULL,
    reviewer_id BIGINT UNSIGNED NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    comments TEXT,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create audit_logs table
CREATE TABLE audit_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    action VARCHAR(255) NOT NULL,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create personal_access_tokens table
CREATE TABLE personal_access_tokens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) UNIQUE NOT NULL,
    abilities TEXT,
    last_used_at TIMESTAMP NULL DEFAULT NULL,
    expires_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    INDEX personal_access_tokens_tokenable_type_tokenable_id_index (tokenable_type, tokenable_id)
);

-- Create sessions table
CREATE TABLE sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    payload TEXT NOT NULL,
    last_activity INT NOT NULL,
    INDEX sessions_user_id_index (user_id),
    INDEX sessions_last_activity_index (last_activity)
);

-- Insert colleges (real AASTU structure)
INSERT INTO colleges (name, description, created_at, updated_at) VALUES
('College of Engineering', 'AASTU\'s largest and fastest-growing college, enrolling about 90% of all students', NOW(), NOW()),
('College of Natural and Applied Sciences', 'Offers core science and applied science disciplines', NOW(), NOW()),
('College of Social Sciences & Humanities', 'Focused on management-related programs', NOW(), NOW()),
('Centers of Excellence & Research', 'Interdisciplinary research centers targeting strategic, nationally prioritized fields', NOW(), NOW());

-- Insert departments (real AASTU departments)
INSERT INTO departments (name, college_id, description, created_at, updated_at) VALUES
-- College of Engineering
('Architecture (Architectural Engineering)', 1, 'Architectural Engineering Department', NOW(), NOW()),
('Chemical Engineering', 1, 'Chemical Engineering Department', NOW(), NOW()),
('Civil Engineering', 1, 'Civil Engineering Department', NOW(), NOW()),
('Electrical and Computer Engineering', 1, 'Electrical and Computer Engineering Department', NOW(), NOW()),
('Electromechanical Engineering', 1, 'Electromechanical Engineering Department', NOW(), NOW()),
('Environmental Engineering', 1, 'Environmental Engineering Department', NOW(), NOW()),
('Mechanical Engineering', 1, 'Mechanical Engineering Department', NOW(), NOW()),
('Mining Engineering', 1, 'Mining Engineering Department', NOW(), NOW()),
('Software Engineering', 1, 'Software Engineering Department', NOW(), NOW()),

-- College of Natural and Applied Sciences
('Biotechnology', 2, 'Biotechnology Department', NOW(), NOW()),
('Food Science and Applied Nutrition', 2, 'Food Science and Applied Nutrition Department', NOW(), NOW()),
('Geology', 2, 'Geology Department', NOW(), NOW()),
('Industrial Chemistry', 2, 'Industrial Chemistry Department', NOW(), NOW()),

-- College of Social Sciences & Humanities
('MBA Industrial Management', 3, 'Master of Business Administration - Industrial Management', NOW(), NOW()),
('MBA Construction Management', 3, 'Master of Business Administration - Construction Management', NOW(), NOW()),

-- Centers of Excellence
('Artificial Intelligence and Robotics', 4, 'AI and Robotics Research Center', NOW(), NOW()),
('Biotechnology and Bioprocessing', 4, 'Biotechnology Research Center', NOW(), NOW()),
('Construction Quality and Technology', 4, 'Construction Technology Research Center', NOW(), NOW()),
('High-Performance Computing and Big Data Analytics', 4, 'HPC and Big Data Research Center', NOW(), NOW()),
('Mineral Exploration, Extraction and Processing', 4, 'Mineral Processing Research Center', NOW(), NOW()),
('Nanotechnology', 4, 'Nanotechnology Research Center', NOW(), NOW()),
('Nuclear Reactor Technology', 4, 'Nuclear Technology Research Center', NOW(), NOW()),
('Sustainable Energy', 4, 'Sustainable Energy Research Center', NOW(), NOW());

-- Insert categories
INSERT INTO categories (name, description, created_at, updated_at) VALUES
('Lecture Notes', 'Course lecture materials and notes', NOW(), NOW()),
('Assignments', 'Student assignments and homework', NOW(), NOW()),
('Research Papers', 'Academic research papers and publications', NOW(), NOW()),
('Lab Manuals', 'Laboratory manuals and procedures', NOW(), NOW()),
('Exams', 'Examination papers and solutions', NOW(), NOW()),
('Presentations', 'Presentation slides and materials', NOW(), NOW()),
('Reports', 'Technical reports and documentation', NOW(), NOW()),
('Theses', 'Graduate theses and dissertations', NOW(), NOW()),
('Project Reports', 'Student and faculty project reports', NOW(), NOW()),
('Technical Specifications', 'Technical specifications and standards', NOW(), NOW());

-- Insert sample users (5 users for each role for demo and testing)
-- Password is 'password' hashed with bcrypt ($2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi)

-- Students (5 users)
INSERT INTO users (name, email, password, role, student_id, department_id, created_at, updated_at) VALUES
('Abebe Kebede', 'abebe.kebede@aastu.edu.et', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'ETS-2021-001', 1, NOW(), NOW()),
('Kebede Alemu', 'kebede.alemu@aastu.edu.et', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'ETS-2021-002', 3, NOW(), NOW()),
('Alemu Tadesse', 'alemu.tadesse@aastu.edu.et', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'ETS-2021-003', 4, NOW(), NOW()),
('Tadesse Worku', 'tadesse.worku@aastu.edu.et', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'ETS-2021-004', 7, NOW(), NOW()),
('Worku Mulugeta', 'worku.mulugeta@aastu.edu.et', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'ETS-2021-005', 9, NOW(), NOW());

-- Teachers (5 users)
INSERT INTO users (name, email, password, role, department_id, created_at, updated_at) VALUES
('Dr. Yohannes Assefa', 'yohannes.assefa@aastu.edu.et', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher', 1, NOW(), NOW()),
('Dr. Assefa Bekele', 'assefa.bekele@aastu.edu.et', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher', 3, NOW(), NOW()),
('Dr. Bekele Haile', 'bekele.haile@aastu.edu.et', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher', 4, NOW(), NOW()),
('Dr. Haile Girma', 'haile.girma@aastu.edu.et', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher', 7, NOW(), NOW()),
('Dr. Girma Tesfaye', 'girma.tesfaye@aastu.edu.et', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher', 9, NOW(), NOW());

-- Department Heads (5 users)
INSERT INTO users (name, email, password, role, department_id, created_at, updated_at) VALUES
('Prof. Tesfaye Desta', 'tesfaye.desta@aastu.edu.et', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'department_head', 1, NOW(), NOW()),
('Prof. Desta Negussie', 'desta.negussie@aastu.edu.et', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'department_head', 3, NOW(), NOW()),
('Prof. Negussie Taye', 'negussie.taye@aastu.edu.et', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'department_head', 4, NOW(), NOW()),
('Prof. Taye Solomon', 'taye.solomon@aastu.edu.et', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'department_head', 7, NOW(), NOW()),
('Prof. Solomon Demeke', 'solomon.demeke@aastu.edu.et', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'department_head', 9, NOW(), NOW());

-- College Deans (5 users)
INSERT INTO users (name, email, password, role, created_at, updated_at) VALUES
('Prof. Demeke Abebe', 'demeke.abebe@aastu.edu.et', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'college_dean', NOW(), NOW()),
('Prof. Abebe Kebede', 'abebe.kebede.dean@aastu.edu.et', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'college_dean', NOW(), NOW()),
('Prof. Kebede Alemu', 'kebede.alemu.dean@aastu.edu.et', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'college_dean', NOW(), NOW()),
('Prof. Alemu Tadesse', 'alemu.tadesse.dean@aastu.edu.et', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'college_dean', NOW(), NOW()),
('Prof. Tadesse Worku', 'tadesse.worku.dean@aastu.edu.et', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'college_dean', NOW(), NOW());

-- IT Managers (5 users)
INSERT INTO users (name, email, password, role, created_at, updated_at) VALUES
('Eng. Worku Mulugeta', 'worku.mulugeta.it@aastu.edu.et', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'it_manager', NOW(), NOW()),
('Eng. Mulugeta Yohannes', 'mulugeta.yohannes.it@aastu.edu.et', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'it_manager', NOW(), NOW()),
('Eng. Yohannes Assefa', 'yohannes.assefa.it@aastu.edu.et', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'it_manager', NOW(), NOW()),
('Eng. Assefa Bekele', 'assefa.bekele.it@aastu.edu.et', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'it_manager', NOW(), NOW()),
('Eng. Bekele Haile', 'bekele.haile.it@aastu.edu.et', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'it_manager', NOW(), NOW());

-- Insert sample audit logs
INSERT INTO audit_logs (user_id, action, description, ip_address, created_at, updated_at) VALUES
(1, 'user_login', 'User logged in successfully', '127.0.0.1', NOW(), NOW()),
(2, 'user_login', 'User logged in successfully', '127.0.0.1', NOW(), NOW()),
(3, 'user_login', 'User logged in successfully', '127.0.0.1', NOW(), NOW());

-- Display summary
SELECT 'Database setup completed successfully!' as status;
SELECT COUNT(*) as total_colleges FROM colleges;
SELECT COUNT(*) as total_departments FROM departments;
SELECT COUNT(*) as total_categories FROM categories;
SELECT COUNT(*) as total_users FROM users;
SELECT role, COUNT(*) as count FROM users GROUP BY role;
