const mysql = require('mysql');
const inquirer = require('inquirer');
require('dotenv').config();
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    // Your port; if not 3306
    port: 3306,
    // Your username, password and database
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  // Very beginning/ initial entry point. Lets user choose options
    const starter = () => {
      inquirer
      .prompt({
        name: 'route',
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View', 'Add', 'Update', 'Delete', 'Exit'],
      })
      .then((answer) => {
        switch(answer.route){
          case 'View':
            return seeOpt();
          case 'Add':
            return addOpt();
          case 'Update':
            return updateOpt();
          case 'Delete':
            return deleteOpt();
          case 'Exit':
            console.log('Have a good day');
            connection.end();
        }
      });
    }

// Lets user see options and navigate through departments, roles, and employee roles
    const seeOpt = () => {
      inquirer
       .prompt({
         name: 'route',
         type: 'list',
         message: "What would you like to see?",
         choices: ['See Department', 'See Role', 'See Employee', 'See Employees by Manager', 'Return']
       })
       .then((answer) => {
         switch(answer.route){
           case 'See Department':
             return seeDept();
            case 'See Role':
             return seeRole();
            case 'See Employee':
             return seeEmpl();
            case 'See Employee by Manager':
             return seeEmpl('byMan');
            case 'Return':
             return starter();
         }
       });
    }

// Lets the user see all the departments
    const seeDept = () => {
      connection.query('SELECT department.name as Department, CONCAT("$", SUM(role.salary, 0)) as Budget, Count(employee.id) as Employee Count FROM department LEFT JOIN role on role.department_id = department.id LEFT JOIN employee ON employee.role_id = role.id GROUP BY department;', (err, results) => {
        if (err) throw err;
        console.table(results);
        starter();
      })
    }

// Lets user see all the roles
    const seeRole = () => {
      connection.query('SELECT role.title as Role, Concat("$", role.salary) as Salary, department.name AS Department FROM role Join department ON role.department_id;', (err, results) => {
        if (err) throw err;
        console.table(results);
        starter();
      })
    }



  connection.connect((err) => {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
  });
  