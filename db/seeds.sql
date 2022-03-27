INSERT INTO department(name)
VALUES
('Sales'),
('Engineering'),
('Legal'),
('Finance');

INSERT INTO role(title, salary, department_id)
VALUES
('Accountant', 75, 4),
('Lawyer', 150, 3),
('Paralegal', 80, 3),
('Software Engineer', 110, 2),
('Senior Software Engineer', 150, 2),
('Salesperson', 90, 1),
('Sales Manager', 110, 1);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
('Ross','Geller', 3, 5),
('Rachel','Green', 4, NULL),
('Monica', 'Geller', 1, 3),
('Joey', 'Tribbiani', 5, NULL),
('Chandler', 'Bing', 2, 1),
('Phoebe', 'Buffay', 6, NULL);