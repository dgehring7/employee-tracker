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

// 




  connection.connect((err) => {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
  });
  