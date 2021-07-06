DROP DATABASE IF EXISTS employee_tracker;

CREATE DATABASE employee_tracker;

USE employee_tracker;



SELECT department.name as Department, SUM(IFNULL(role.salary, 0)) as Budget, COUNT(employee.id) as "Employee Count" 
FROM department
LEFT JOIN role 
	ON role.department_id = department.id
LEFT JOIN employee
	ON employee.role_id = role.id
GROUP BY Department; 


SELECT role.title as Role, CONCAT("$", role.salary) as Salary, department.name AS Department
FROM role
JOIN department ON role.department_id = department.id;

SELECT a.first_name AS First, a.last_name AS Last, role.title as Title, department.name as Department, CONCAT("$", role.salary) as Salary, CONCAT(b.first_name, " ", b.last_name) AS Manager
FROM employee a
LEFT JOIN employee b 
	ON a.manager_id = b.id
JOIN role 
	ON a.role_id = role.id
JOIN Department
	ON role.department_id = department.id;

-- view managers
SELECT id, CONCAT(employee.first_name, " ", employee.last_name) as Manager
FROM employee
WHERE id = ANY
	(SELECT manager_id FROM employee);

-- view employee by manager
SELECT employee.first_name AS First, employee.last_name AS Last, role.title as Title, CONCAT("$", role.salary) as Salary
FROM employee
JOIN role 
	ON a.role_id = role.id
WHERE manager_id = ?;

-- add department (VALUE)
INSERT INTO department(name)
VALUE(?);

-- add department (SET)
INSERT INTO department SET ?

-- add role (VALUE)
INSERT INTO role(title, salary, department_id)
VALUE(?, ?, ?);

-- add role (SET)
INSERT INTO role SET ?

-- add employee
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUE(?, ?, ?, ?);

-- update employee role
UPDATE employee
SET role_id = ?
WHERE id = ?;

-- update employee manager
UPDATE employee
SET manager_id = ?
WHERE id = ?;

-- delete department
DELETE FROM department
WHERE id = ?;

UPDATE role
SET department_id = NULL
WHERE department_id = NULL;

-- delete role
DELETE FROM role
WHERE id = ?;

UPDATE employee
SET role_id = NULL
WHERE role_id = ?;

-- delete department
DELETE FROM employee
WHERE role_id = ?;

SELECT id FROM role
WHERE department_id = ?;

DELETE FROM role
WHERE department_id = ?;

DELETE FROM department
WHERE id = ?;

-- delete role (deletes employees)
DELETE FROM role
WHERE id = ?;

DELETE FROM employee
WHERE role_id = ?;