-- -- Departments
-- INSERT INTO departments (name) VALUES
-- ('Computer Science'),
-- ('Electrical Engineering'),
-- ('Mechanical Engineering');

-- -- Categories
-- INSERT INTO categories (name) VALUES
-- ('Thesis'),
-- ('Senior Project'),
-- ('Research Paper'),
-- ('Course Material'),
-- ('Past Exam');

-- -- Users
-- -- Students
-- INSERT INTO users (name, email, password, role, department_id) VALUES
-- ('Abebe Kebede', 'abebe.kebede@aastustudent.edu.et', 'hashed_pw1', 'student', 1),
-- ('Sara Alemu', 'sara.alemu@aastustudent.edu.et', 'hashed_pw2', 'student', 2);

-- -- Faculty/Admins
-- INSERT INTO users (name, email, password, role, department_id) VALUES
-- ('Meles Bekele', 'meles.bekele@aastu.edu.et', 'hashed_pw3', 'teacher', 1),
-- ('Dawit Tadesse', 'dawit.tadesse@aastu.edu.et', 'hashed_pw4', 'department_head', 1),
-- ('Kebede Fikru', 'kebede.fikru@aastu.edu.et', 'hashed_pw5', 'college_dean', 2),
-- ('Helen Girma', 'helen.girma@aastu.edu.et', 'hashed_pw6', 'it_manager', NULL);

-- -- Documents uploaded by students
-- INSERT INTO documents (user_id, category_id, title, description, file_path, year, supervisor, keywords, status)
-- VALUES
-- (1, 1, 'Deep Learning for Image Recognition', 'Thesis on CNN architectures', '/files/dl_thesis.pdf', 2025, 'Dr. Meles Bekele', 'AI, Deep Learning, Image Processing', 'pending'),
-- (2, 2, 'IoT for Smart Grids', 'Senior project on IoT in energy systems', '/files/iot_grid.pdf', 2025, 'Dr. Dawit Tadesse', 'IoT, Energy, Smart Systems', 'pending');

-- -- Reviews by faculty/admins
-- INSERT INTO document_reviews (document_id, reviewer_id, status, comments)
-- VALUES
-- (1, 3, 'approved', 'Well-written and meets academic standards.'),
-- (2, 4, 'rejected', 'Needs more data analysis and references.');

-- -- Audit Logs
-- INSERT INTO audit_logs (user_id, action, details) VALUES
-- (1, 'Document Uploaded', 'Abebe uploaded thesis on Deep Learning'),
-- (2, 'Document Uploaded', 'Sara uploaded senior project on IoT Grids'),
-- (3, 'Document Reviewed', 'Meles approved Abebe''s thesis'),
-- (4, 'Document Reviewed', 'Dawit rejected Sara''s project');
-- -------------------------------
-- Departments
-- -------------------------------
INSERT INTO departments (name) VALUES
('Computer Science'),
('Electrical Engineering'),
('Mechanical Engineering'),
('Civil Engineering'),
('Architecture');

-- -------------------------------
-- Categories
-- -------------------------------
INSERT INTO categories (name) VALUES
('Thesis'),
('Senior Project'),
('Research Paper'),
('Course Material'),
('Past Exam');

-- -------------------------------
-- Users (Students)
-- -------------------------------
INSERT INTO users (name, email, password, role, department_id) VALUES
('Abebe Kebede', 'abebe.kebede@aastustudent.edu.et', '$2y$10$hashed_pw1', 'student', 1),
('Sara Alemu', 'sara.alemu@aastustudent.edu.et', '$2y$10$hashed_pw2', 'student', 2),
('Daniel Teshome', 'daniel.teshome@aastustudent.edu.et', '$2y$10$hashed_pw3', 'student', 3),
('Lily Worku', 'lily.worku@aastustudent.edu.et', '$2y$10$hashed_pw4', 'student', 4),
('Samuel Desta', 'samuel.desta@aastustudent.edu.et', '$2y$10$hashed_pw5', 'student', 5),
('Martha Fikru', 'martha.fikru@aastustudent.edu.et', '$2y$10$hashed_pw6', 'student', 1),
('Yonas Alemayehu', 'yonas.alemayehu@aastustudent.edu.et', '$2y$10$hashed_pw7', 'student', 2),
('Helen Tesfaye', 'helen.tesfaye@aastustudent.edu.et', '$2y$10$hashed_pw8', 'student', 3),
('Getachew Tadesse', 'getachew.tadesse@aastustudent.edu.et', '$2y$10$hashed_pw9', 'student', 4),
('Selamawit Bekele', 'selamawit.bekele@aastustudent.edu.et', '$2y$10$hashed_pw10', 'student', 5);

-- -------------------------------
-- Users (Faculty/Admins)
-- -------------------------------
INSERT INTO users (name, email, password, role, department_id) VALUES
('Meles Bekele', 'meles.bekele@aastu.edu.et', '$2y$10$hashed_pw101', 'teacher', 1),
('Dawit Tadesse', 'dawit.tadesse@aastu.edu.et', '$2y$10$hashed_pw102', 'department_head', 2),
('Kebede Fikru', 'kebede.fikru@aastu.edu.et', '$2y$10$hashed_pw103', 'college_dean', 3),
('Helen Girma', 'helen.girma@aastu.edu.et', '$2y$10$hashed_pw104', 'it_manager', NULL),
('Selamawit Hailemariam', 'selamawit.hailemariam@aastu.edu.et', '$2y$10$hashed_pw105', 'teacher', 3),
('Abel Tekle', 'abel.tekle@aastu.edu.et', '$2y$10$hashed_pw106', 'teacher', 4),
('Tigist Desta', 'tigist.desta@aastu.edu.et', '$2y$10$hashed_pw107', 'department_head', 5);

-- -------------------------------
-- Documents
-- -------------------------------
INSERT INTO documents (user_id, category_id, title, description, file_path, year, supervisor, keywords, status)
VALUES
(1, 1, 'Deep Learning for Image Recognition', 'Thesis on CNN architectures', '/files/dl_thesis.pdf', 2025, 'Dr. Meles Bekele', 'AI, Deep Learning, Image Processing', 'pending'),
(2, 2, 'IoT for Smart Grids', 'Senior project on IoT in energy systems', '/files/iot_grid.pdf', 2025, 'Dr. Dawit Tadesse', 'IoT, Energy, Smart Systems', 'pending'),
(3, 3, 'Bridge Structural Analysis', 'Research paper on finite element analysis', '/files/bridge_analysis.pdf', 2025, 'Selamawit Hailemariam', 'Structural Engineering, FEA, Bridges', 'pending'),
(4, 4, 'Digital Logic Course Material', 'Notes for Digital Systems course', '/files/digital_logic.pdf', 2025, 'Meles Bekele', 'Logic, Electronics, Digital', 'approved'),
(5, 5, 'CS Past Exam 2024', 'Previous CS exams', '/files/cs_exam_2024.pdf', 2024, 'Meles Bekele', 'Exam, Computer Science', 'approved');

-- -------------------------------
-- Document Reviews
-- -------------------------------
INSERT INTO document_reviews (document_id, reviewer_id, status, comments)
VALUES
(1, 101, 'approved', 'Well-written and meets academic standards.'),
(2, 102, 'rejected', 'Needs more data analysis and references.'),
(3, 105, 'approved', 'Excellent structural calculations.'),
(4, 101, 'pending', 'Waiting for supervisor feedback.'),
(5, 104, 'approved', 'Good coverage of past exams.');

-- -------------------------------
-- Audit Logs
-- -------------------------------
INSERT INTO audit_logs (user_id, action, details)
VALUES
(1, 'Document Uploaded', 'Abebe uploaded thesis on Deep Learning'),
(2, 'Document Uploaded', 'Sara uploaded senior project on IoT Grids'),
(3, 'Document Uploaded', 'Daniel uploaded research paper on bridge analysis'),
(101, 'Document Reviewed', 'Meles approved document 1'),
(102, 'Document Reviewed', 'Dawit rejected document 2');
