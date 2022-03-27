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
        'Add Role',
        'Add Employee'
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
      departmentchoices();
  }else if (data.menu === 'Add Employee'){
        roleChoices();
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

function addDepartment() {
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

function departmentchoices(){
    const sql = 'SELECT * FROM department';
    db.query(sql, (err, res) => {
        if (err) {
            console.log(err);
        }
        let arr = res.map(department => {
            return department.name;
        })
        addRole(arr);
    });
}

function roleChoices(){
    const sql = `SELECT id, title FROM role`;
    db.query(sql, (err,res) => {
        if (err) {
            console.log(err)
        }
        let rolearr = res.map(({id, title}) => ({ name: title, value: id}))
        managerChoices(rolearr);
    })
}

function managerChoices(rolearr) {
    const sql = `SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS name, id FROM employee`
    db.query(sql, (err,res) => {
        if(err){
            console.log(err);
        }
        let managerarr = res.map(({ name, id}) => ({ name, value: id}))
        addEmployee(rolearr, managerarr);
    })

}


function addRole(arr){
    inquirer.prompt([
        {
            type: 'input',
            name: 'roleName',
            message: 'Enter name of new role:'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is salary of new role?'
        },
        {
            type: 'list',
            name: 'department',
            message: 'What department is this role a part off?',
            choices: arr
        }
    ])
    .then( (answer)=> {
        const sql = `SELECT id FROM department WHERE name = ?`
        const params = [answer.department];
        db.query(sql, params, (err, departmentID) => {
            if (err) {
                console.log(err);
            }

        const sql = `INSERT INTO role (title, salary, department_id)
        VALUES(?,?,?)`;
        const params = [answer.roleName, answer.salary, departmentID[0].id];
  
        db.query(sql, params, (err, res)=> {
            if (err) throw err;
  
            console.table(res);
            console.log("Role Added");
  
            startApp();
          });
    }); 
});
}


function addEmployee(rolearr, managerarr){
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "What is Employee's first name?"
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is Employee's last name?"
        },
        {
            type: 'list',
            name: 'Role',
            message: "What is Employee's role?",
            choices: rolearr
        },
        {
            type: 'list',
            name: 'Manager',
            message: "Who is Employee's manager?",
            choices: managerarr
        }
    ])
    .then((answer)=>{
        const sql = `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
        const params = [answer.firstName, answer.lastName, answer.Role, answer.Manager]
        db.query(sql, params, (err,res) => {
            if (err) {
                console.log(err);
            }
            console.log('Employee Added');

            startApp();
        });
    });
}


startApp();