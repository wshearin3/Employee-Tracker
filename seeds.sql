INSERT INTO department (name) VALUES
('Sales'),
('Finance'),
('Engineering'),
('Legal');

INSERT INTO role (title, salary, department_id) VALUES
('Lawyer', 190000, 4),
('Legal Team Lead', 250000, 4),
('Accountant', 125000, 2),
('Account Manager', 160000, 2),
('Software Engineer', 120000, 3),
('Lead Engineer', 150000, 3),
('Salesperson', 80000, 1),
('Sales Lead', 100000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, null),
('Mike', 'Chan', 2, 1),
('Ashley', 'Rodriguez', 3, null),
('Kevin', 'Tupac', 4, 3),
('Kunal', 'Singh', 5, null),
('Malia', 'Brown', 6, 5),
('Sarah', 'Lourd', 7, null),
('Tom', 'Allen', 8, 7);
