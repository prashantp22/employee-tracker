const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'employees'
    },
    console.log('Connected to the employees database.')
);

async function startApp() {
const data = await inquirer
.prompt([{
      type: "list",
      name: "menu",
      message: "Would you like to do?",
      choices: [
        'View All Department',
        'View All Roles',
        'View All Employees',
        'Add Department',
        'Add Role'
      ]
  }]);
  if (data.menu === 'View All Department') {
      getDepartments();
  }else if(data.menu === 'View All Roles'){
      getRoles();
  }else if(data.menu === 'View All Employees'){
      getEmployees();
  }else if(data.menu === 'Add Department'){
      addDepartment();
  }else if(data.menu === 'Add Role'){
      addRole();
  } 
};

function getDepartments() {
    const sql = 'SELECT * FROM department';
    db.query(sql, (err, res) => {
        if (err) {
            console.log(err);
        }
        console.table(res);
        console.log("");
        startApp();
    });
};

function getRoles() {
    const sql = `SELECT role.*, 
    department.name AS department 
    FROM role
    LEFT JOIN department ON department.id = role.department_id`;
    db.query(sql, (err, res) => {
        if (err) {
            console.log(err);
        }
        console.table(res);
        console.log("");
        startApp();
    });
};

function getEmployees() {
    const sql = `SELECT e.*, 
    department.name AS department,
    role.title,
    role.salary, 
    CONCAT(m.first_name, ' ', m.last_name) as manger
    FROM employee e
    JOIN role ON e.role_id = role.id
    JOIN department ON department.id = role.department_id
    LEFT JOIN employee m ON m.id = e.manager_id`;
    db.query(sql, (err, res) => {
        if (err) {
            console.log(err);
        }
        console.table(res);
        console.log("");
        startApp();
    });
};

async function addDepartment() {
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'department',
            message: 'Enter new department name:'
        }
    ])
    .then(function(data){
    const sql = `INSERT INTO department (name) VALUE(?)`;
    const params = [data.department];

    db.query(sql, params, (err, res) => {
        if (err) {
            console.log(err);
        }
        console.table(res);
        console.log("");
        console.log('department added');
        startApp();
    });
    });
}

startApp();