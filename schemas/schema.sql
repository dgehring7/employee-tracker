DROP DATABASE IF EXISTS employee_tracker;

CREATE DATABASE employee_tracker;

USE employee_tracker;

CREATE TABLE department(
id INTEGER NOT NULL AUTO_INCREMENT,
name VARCHAR(30) NOT NULL,
PRIMARY KEY(id)
);

CREATE TABLE role(
id INTEGER NOT NULL AUTO_INCREMENT,
title VARCHAR(25) NOT NULL,
salary DECIMAL NOT NULL,
department_id INT NOT NULL,
PRIMARY KEY(id),
FOREIGN KEY(department_id) REFERENCES department(id)
);

CREATE TABLE employee(
id INTEGER NOT NULL AUTO_INCREMENT,
first_name VARCHAR(20),
last_name VARCHAR(30),
role_id INT,
manager_id INT,
PRIMARY KEY(id),
FOREIGN KEY(role_id) REFERENCES role(id),
FOREIGN KEY(manager_id) REFERENCES employee(id)
);

INSERT INTO department(department_name)
VALUES ('Marketing'), ('IT'), ('Management'), ('Coordinator');

INSERT INTO role(title, salary, department_id)
VALUES ('Manager', 60000, 3), ('IT', 54500, 2), ('Coordinator', 38000, 1), ('Marketing', 35000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ('Jen', 'M', 2, null), ('Evan', 'L', 1, null), ('Susan', 'R', 3, 2), ('Steve', 'L', 1, null), ('Matt', 'S', 4, null);