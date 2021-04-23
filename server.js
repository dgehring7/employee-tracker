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

// Lets user see all employees
    const seeEmpl = (Opt) => {
      switch(opt){
        case "byMan":
          return connection.query('SELECT id, CONCAT(employee.first_name, employee.last_name) as manager FROM employee WHERE id = ANY (SELECT manager_id FROM employee);', (err, results) => {
            if (err) throw err;
            inquirer
            .prompt({
              name: 'choice',
              type: 'list',
              choices() {
                const choiceArray = [];
                results.forEach(({manager}) => {
                  choiceArray.push(manager);
                });
                return choiceArray;
              },
              message: 'Whose employees would you like to see?'
            }
            ).then((answer) => {
              let choiceId;
              results.foreach((employee) => {
                if(answer.choice === employee.manager){
                  choiceId = employee.id;
                }
              });
              connection.query('SELECT employee.first_name as First, employee.last_name as Last, role.title as Role, department.name as Department, CONCAT("$" role.salary as Salary) as Salary FROM employee Join role on employee.role_id = role.id JOIN Department on role.department_id = department.id WHERE employee.manager_id = ${choiceId', (err, results) => {
                if (err) throw err;
                console.table(results);
                starter();
              })
            });
          });
      }
    }

// Adds and lets user select options
    const seeOpt = () => {
      inquirer
       .prompt({
         name: 'route',
         type: 'list',
         message: 'What would you like to add?',
         choices: ['New Department', 'New Role', 'New Employee', 'Return'],
       })
       .then((answer) => {
         switch(answer.route){
           case 'New Department':
             return addDept();
           case 'New Role':
             return addRole();
           case 'New Employee':
             return addEmpl();
           case 'Return':
             return starter();
            }
       });
    }

// Add department
    const addDept = () => {
      inquirer
      .prompt({
        name: 'name',
        message: 'What is the Department name?'
      })
      .then((answer) => {
        connection.query('INSERT INTO department SET ?',
        {
          name: answer.name
        },
        (err) => {
          if (err) throw err;
          console.log(`${answer.name} added to Departments.`);
        }
        )
      })
    }

// Creates New Role
const addRole = () => {
  connection.query('SELECT * FROM department', (err, results) => {
    if (err) throw err;
    inquirer
    .prompt([
      {
        name: 'title',
        message: 'What is the new role?'
      },
      {
        name: 'salary',
        message: 'What is the salary for this role'?
        validate: {
          isNumeric: true
        }
      },
      {
        name: 'department',
        type: 'list',
        message: 'What department does this role belong to?',
        choices(){
          const choiceArray = [];
          results.forEach(({name}) => {
            choiceArray.push(name);
          });
          return choiceArray;
        },
      }
    ]).then((answer) => {
      let choiceId;
      results.forEach((dept) => {
        if(dept.name === answer.department){
          choiceId = dept.id;
        }
      })
      connection.query('INSERT INTO role SET ?', 
      {
        title: answer.title,
        salary: answer.salary,
        department_id: choiceId
      },
      (error) => {
        if (err) throw err;
        seeRole();
      });
    })
  })
}

// Adds employee
  const addEmpl = () => {
    connection.query('SELECT * FROM role', (err, results) => {
      if (err) throw error;
    connection.query('SELECT *, CONCAT(first_name, last_name) AS name FROM employee', (err, results) => {
      if (err) throw err;
      inquirer
      .prompt([
        {
          name: 'first',
          message: "What is the employees first name?"
        },
        {
          name: 'last',
          message: 'What is the employees last name?'
        },
        {
          name: 'role',
          message: 'What is the employees role?',
          type: 'list',
          choices(){
            const choiceArray = [];
            resRole.forEach(({title}) => {
              choiceArray.push(title);
            });
            return choiceArray;
          }
        }
      ]).then((answer) => {
        let choiceRole;
        let choiceMan = {id: null};
        resRole.foreEach((role) => {
          if(role.title === answer.role)
            choiceRole = role;
        });
        connection.query('INSERT INTO employee SET ?',
        {
          first_name: answer.first,
          last_name: answer.last,
          role_id: choiceRole.id,
          managerid: choiceMan.id
        },
        (err) => {
          if (err) throw err;
          console.log(`Successfuly added employee ${answer.first} ${answer.last}`)
          seeEmpl();
        });
      })
      })
    });
  }


  connection.connect((err) => {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
  });
  