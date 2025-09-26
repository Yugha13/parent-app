-- 1. Grades
CREATE TABLE grades (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

-- 2. Fee Packages (grade-wise fee settings)
CREATE TABLE fee_packages (
  id SERIAL PRIMARY KEY,
  grade_id INT NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
  fee_amount DECIMAL(10, 2) NOT NULL
);

-- 3. Teachers
CREATE TABLE teachers (
  id SERIAL PRIMARY KEY,
  email text UNIQUE,
  name VARCHAR(100) NOT NULL,
  subject text[] NOT NULL,
  phone VARCHAR(15),
  role text,
  salary text,
  qualification text,
  experience text
);
ALTER TABLE teachers 
ADD COLUMN auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE;


create table teacher_grades (
  teacher_id int references teachers(id) on delete cascade,
  grade_id int references grades(id) on delete cascade,
  primary key (teacher_id, grade_id)
);


-- 4. Class Sections
CREATE TABLE class_sections (
  id SERIAL PRIMARY KEY,
  grade_id INT NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
  section VARCHAR(5) NOT NULL,
  class_teacher_id INT REFERENCES teachers(id) ON DELETE SET NULL,
  room_number VARCHAR(10),
  capacity INT DEFAULT 30,
  academic_year VARCHAR(20) DEFAULT '2024-25',
  status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Suspended')),
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  subjects TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (grade_id, section, academic_year)
);

-- 5. Students
CREATE TABLE students (
  id UUID PRIMARY KEY default gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email text,
  address text,
  roll_number text,
  grade_id INT NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
  class_section_id INT REFERENCES class_sections(id) ON DELETE SET NULL,
  phone VARCHAR(15)
);

CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_section_id INT NOT NULL REFERENCES class_sections(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status VARCHAR(10) NOT NULL CHECK (status IN ('Present', 'Absent', 'Late')),
  marked_by INT REFERENCES teachers(id) ON DELETE SET NULL,
  UNIQUE (student_id, class_section_id, date)
);


-- 6. Timetable (manual entry of teacher schedule)
CREATE TABLE timetable (
  id SERIAL PRIMARY KEY,
  class_section_id INT NOT NULL REFERENCES class_sections(id) ON DELETE CASCADE,
  teacher_id INT NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  subject text[],
  day_of_week VARCHAR(10) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL
);

-- 7. Exams (by grade)
CREATE TABLE exams (
  id SERIAL PRIMARY KEY,
  title text NOT NULL,
  grade_id INT NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
  subject VARCHAR(100) NOT NULL,
  exam_date DATE NOT NULL,
  is_published BOOLEAN DEFAULT FALSE,
  max_marks INT DEFAULT 100
);

-- 8. Marks (students → exams)
CREATE TABLE marks (
  id SERIAL PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  exam_id INT NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  marks_obtained DECIMAL(5, 2) NOT NULL,
  UNIQUE (student_id, exam_id)
);

-- 9. Notifications (3 types: grade-wise, teachers, broadcast)
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('student', 'teacher', 'all')),
  notification_type VARCHAR(20) NOT NULL CHECK (notification_type IN ('leave_update', 'event', 'general')),
  grade_id INT REFERENCES grades(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Payments (track fee status)
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  fee_package_id INT NOT NULL REFERENCES fee_packages(id) ON DELETE CASCADE,
  status VARCHAR(10) NOT NULL CHECK (status IN ('paid', 'unpaid')),
  amount_paid DECIMAL(10,2),
  paid_on DATE,
  payment_mode VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (student_id, fee_package_id)
);

-- 11. Scholarships
CREATE TABLE scholarships (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  discount_percent INT NOT NULL CHECK (discount_percent BETWEEN 0 AND 100),
  description TEXT
);

-- 12. Student-Scholarship Link
CREATE TABLE student_scholarships (
  id SERIAL PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  scholarship_id INT NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
  assigned_on DATE DEFAULT CURRENT_DATE,
  UNIQUE (student_id, scholarship_id)
);

-- 13. Homeworks
CREATE TABLE homeworks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  class_section_id INT NOT NULL REFERENCES class_sections(id) ON DELETE CASCADE,
  subject TEXT[] NOT NULL,
  assigned_by INT REFERENCES teachers(id) ON DELETE SET NULL,
  due_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Views
CREATE VIEW student_counts AS
SELECT grade_id, COUNT(*) AS total_students
FROM students
GROUP BY grade_id;


CREATE VIEW student_count_by_grade AS
SELECT 
    grade_id,
    COUNT(*) as student_count
FROM students
GROUP BY grade_id;

-- Migration to create a view for fee collection statistics
-- This view pre-calculates fee collection metrics for better performance

CREATE OR REPLACE VIEW fee_collection_stats AS
SELECT 
    s.grade_id,
    g.name AS grade_name,
    COUNT(DISTINCT s.id) AS total_students,
    COUNT(p.id) AS total_payments,
    COALESCE(SUM(CASE WHEN p.status = 'paid' THEN 1 ELSE 0 END), 0) AS paid_payments,
    COALESCE(SUM(CASE WHEN p.status = 'unpaid' THEN 1 ELSE 0 END), 0) AS unpaid_payments,
    COALESCE(SUM(fp.fee_amount), 0) AS total_expected_amount,
    COALESCE(SUM(CASE WHEN p.status = 'paid' THEN p.amount_paid ELSE 0 END), 0) AS total_collected_amount,
    COALESCE(SUM(CASE WHEN p.status = 'paid' THEN p.amount_paid ELSE 0 END), 0) AS collected_amount,
    COALESCE(SUM(CASE WHEN p.status = 'unpaid' THEN fp.fee_amount ELSE 0 END), 0) AS pending_amount,
    CASE 
        WHEN COUNT(p.id) > 0 THEN 
            ROUND((COALESCE(SUM(CASE WHEN p.status = 'paid' THEN 1 ELSE 0 END), 0) * 100.0) / GREATEST(COUNT(p.id), 1), 2)
        ELSE 0 
    END AS collection_rate
FROM students s
JOIN grades g ON s.grade_id = g.id
LEFT JOIN fee_packages fp ON s.grade_id = fp.grade_id
LEFT JOIN payments p ON s.id = p.student_id AND fp.id = p.fee_package_id
GROUP BY s.grade_id, g.name;

-- Verification query to check if the view was created successfully
-- SELECT * FROM fee_collection_stats ORDER BY grade_id;

CREATE INDEX idx_teacher_grades_teacher_id ON teacher_grades(teacher_id);
CREATE INDEX idx_teacher_grades_grade_id ON teacher_grades(grade_id);
