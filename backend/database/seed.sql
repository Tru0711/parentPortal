-- Seed data for Parent Portal
USE parent_portal;

-- Insert default admin user (password: password123)
INSERT INTO users (email, password, name, role) VALUES 
('admin@school.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', 'admin');

-- Insert sample teacher (password: password123)
INSERT INTO users (email, password, name, role) VALUES 
('teacher@school.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sarah Johnson', 'teacher');

-- Insert sample parent (password: password123)
INSERT INTO users (email, password, name, role, contact_number, relation) VALUES 
('parent@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John Smith', 'parent', '+1234567890', 'Father');

-- Insert sample student (password: password123)
INSERT INTO users (email, password, name, role, class, roll_number, parent_email) VALUES 
('student@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Emma Smith', 'student', '10A', '101', 'parent@example.com');

-- Get the student ID for sample data
SET @student_id = (SELECT id FROM users WHERE email = 'student@example.com');
SET @teacher_id = (SELECT id FROM users WHERE email = 'teacher@school.edu');
SET @parent_id = (SELECT id FROM users WHERE email = 'parent@example.com');

-- Sample attendance data
INSERT INTO attendance (student_id, date, status, subject, teacher_id) VALUES
(@student_id, '2024-01-15', 'present', 'Mathematics', @teacher_id),
(@student_id, '2024-01-16', 'present', 'Science', @teacher_id),
(@student_id, '2024-01-17', 'absent', 'English', @teacher_id),
(@student_id, '2024-01-18', 'present', 'History', @teacher_id),
(@student_id, '2024-01-19', 'late', 'Geography', @teacher_id),
(@student_id, '2024-01-22', 'present', 'Mathematics', @teacher_id),
(@student_id, '2024-01-23', 'present', 'Science', @teacher_id),
(@student_id, '2024-01-24', 'present', 'English', @teacher_id),
(@student_id, '2024-01-25', 'present', 'History', @teacher_id),
(@student_id, '2024-01-26', 'absent', 'Geography', @teacher_id);

-- Sample marks data
INSERT INTO marks (student_id, subject, exam_type, marks, total_marks, grade, exam_date, teacher_id) VALUES
(@student_id, 'Mathematics', 'Unit Test 1', 85, 100, 'A', '2024-01-20', @teacher_id),
(@student_id, 'Science', 'Unit Test 1', 92, 100, 'A+', '2024-01-21', @teacher_id),
(@student_id, 'English', 'Unit Test 1', 78, 100, 'B+', '2024-01-22', @teacher_id),
(@student_id, 'History', 'Unit Test 1', 88, 100, 'A', '2024-01-23', @teacher_id),
(@student_id, 'Geography', 'Unit Test 1', 82, 100, 'A-', '2024-01-24', @teacher_id);

-- Sample behavior records
INSERT INTO behavior (student_id, teacher_id, date, type, description) VALUES
(@student_id, @teacher_id, '2024-01-25', 'positive', 'Excellent participation in class discussion'),
(@student_id, @teacher_id, '2024-01-24', 'positive', 'Helped classmate with mathematics problem'),
(@student_id, @teacher_id, '2024-01-22', 'neutral', 'Submitted assignment on time');

-- Sample messages
INSERT INTO messages (from_user_id, to_user_id, student_id, subject, message, is_read) VALUES
(@teacher_id, @parent_id, @student_id, 'Emma''s Progress Update', 'Emma has been doing exceptionally well in Mathematics. She shows great problem-solving skills.', FALSE),
(@teacher_id, @parent_id, @student_id, 'Science Project Reminder', 'Please remind Emma about the science project due next week. She has chosen an interesting topic.', TRUE);

-- System settings
INSERT INTO settings (setting_key, setting_value, description) VALUES
('school_name', 'Greenwood High School', 'Name of the educational institution'),
('academic_year', '2023-2024', 'Current academic year'),
('attendance_threshold', '75', 'Minimum attendance percentage required'),
('grade_scale', 'A+:90-100,A:80-89,B+:70-79,B:60-69,C:50-59,F:0-49', 'Grading scale configuration');
