-- Seed the department table
INSERT INTO department (dep_name) VALUES
('Human Resources'),
('Engineering'),
('Marketing'),
('Sales'),
('Customer Service'),
('Finance'),
('Research and Development'),
('Information Technology'),
('Operations'),
('Legal');

-- Seed the role table
INSERT INTO role (title, salary, department_id) VALUES
('HR Manager', 65000.00, 1),
('Software Engineer', 85000.00, 2),
('Marketing Director', 75000.00, 3),
('Sales Representative', 55000.00, 4),
('Customer Service Manager', 50000.00, 5),
('Accountant', 60000.00, 6),
('R&D Scientist', 70000.00, 7),
('IT Specialist', 72000.00, 8),
('Operations Coordinator', 48000.00, 9),
('Legal Advisor', 68000.00, 10);

-- Seed the employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, NULL),
('Emily', 'Johnson', 3, NULL),
('Michael', 'Williams', 4, 1),
('David', 'Brown', 5, 1),
('Jessica', 'Davis', 6, 3),
('Sarah', 'Miller', 7, 3),
('James', 'Wilson', 8, 2),
('Linda', 'Moore', 9, 1),
('Robert', 'Taylor', 10, 4);
