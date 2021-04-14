DROP DATABASE IF EXISTS employee_tracker;

CREATE DATABASE employee_tracker;

USE employee_tracker;

CREATE TABLE employee (
	id INT NOT NULL,
    first_name VARCHAR (30),
    last_name VARCHAR (30),
    role_id INT FOREIGN KEY REFERENCES role(id),
    manager_id INT FOREIGN KEY REFERENCES employee(id)
    );
    
CREATE TABLE role (
	id INT NOT NULL,
    title VARCHAR (30),
    salary DECIMAL,
    department_id INT FOREIGN KEY REFERENCES department(id)
    );
    
CREATE TABLE department (
	id INT NOT NULL,
    name VARCHAR (30)
    );
    