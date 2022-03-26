const inquirer = require("inquirer");
const mysql = require("mysql2");
require("console.table");

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'employees'
    },
    console.log('Connected to the election database.')
);

function startApp() {

    inquirer.prompt({
      type: "list",
      name: "menu",
      message: "Would you like to do?",
      choices: [
        'View All Department',
        'View All Roles'
      ]
  });
  if (data.menu === 'View ALL Departments') {
      getDepartments();
  }
}

function getDepartments() {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, res) => {
        if (err) {
            console.log(err);
        }
        console.table(res);
        startApp();
    });
};

startApp();