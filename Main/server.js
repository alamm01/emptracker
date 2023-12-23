const inquirer = require('inquirer');
const mysql = require('mysql2');
// const cTable = require('console.table');

// Connect to the database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Target$1',
  database: 'emptracker_db'
});

// Start the CLI application
function init() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit'
      ]
    }
  ]).then(answers => {
    switch (answers.action) {
      case 'View all departments':
        viewDepartments();
        break;
      case 'View all roles':
        viewRoles();
        break;
      case 'View all employees':
        viewEmployees();
        break;
      case 'Add a department':
        addDepartment();
        break;
      case 'Add a role':
        addRole();
        break;
      case 'Add an employee':
        addEmployee();
        break;
      case 'Update an employee role':
        updateEmployeeRole();
        break;
      case 'Exit':
        db.end();
        break;
    }
  });
}

// Function implementations
function viewDepartments() {
  db.promise().query('SELECT id, dep_name AS name FROM department')
    .then(([rows]) => {
      console.table(rows);
      init();
    })
    .catch(console.log);
}

function viewRoles() {
  db.promise().query('SELECT r.id, r.title, d.dep_name AS department, r.salary FROM role r JOIN department d ON r.department_id = d.id')
    .then(([rows]) => {
      console.table(rows);
      init();
    })
    .catch(console.log);
}

function viewEmployees() {
  db.promise().query(`
    SELECT 
      e.id, 
      e.first_name, 
      e.last_name, 
      r.title, 
      d.dep_name AS department, 
      r.salary, 
      CONCAT(m.first_name, ' ', m.last_name) AS manager 
    FROM employee e
    JOIN role r ON e.role_id = r.id
    JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id`)
    .then(([rows]) => {
      console.table(rows);
      init();
    })
    .catch(console.log);
}

function addDepartment() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'depName',
      message: 'What is the name of the department?'
    }
  ]).then(answer => {
    db.promise().query('INSERT INTO department (dep_name) VALUES (?)', answer.depName)
      .then(() => {
        console.log(`Added ${answer.depName} to the database`);
        init();
      })
      .catch(console.log);
  });
}

function addRole() {
  db.promise().query('SELECT * FROM department').then(([departments]) => {
    inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'What is the title of the role?'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'What is the salary of the role?'
      },
      {
        type: 'list',
        name: 'departmentId',
        message: 'Which department does the role belong to?',
        choices: departments.map(department => ({
          name: department.dep_name,
          value: department.id
        }))
      }
    ]).then(answer => {
      db.promise().query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
        [answer.title, answer.salary, answer.departmentId])
        .then(() => {
          console.log(`Added ${answer.title} role to the database`);
          init();
        })
        .catch(console.log);
    });
  });
}

function addEmployee() {
  db.promise().query('SELECT * FROM role').then(([roles]) => {
    db.promise().query('SELECT * FROM employee').then(([managers]) => {
      inquirer.prompt([
        {
          type: 'input',
          name: 'firstName',
          message: 'What is the first name of the employee?'
        },
        {
          type: 'input',
          name: 'lastName',
          message: 'What is the last name of the employee?'
        },
        {
          type: 'list',
          name: 'roleId',
          message: 'What is the role of the employee?',
          choices: roles.map(role => ({
            name: role.title,
            value: role.id
          }))
        },
        {
          type: 'list',
          name: 'managerId',
          message: 'Who is the manager of the employee?',
          choices: [
            { name: 'None', value: null }
          ].concat(managers.map(manager => ({
            name: manager.first_name + ' ' + manager.last_name,
            value: manager.id
          })))
        }
      ]).then(answer => {
        db.promise().query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
          [answer.firstName, answer.lastName, answer.roleId, answer.managerId])
          .then(() => {
            console.log(`Added ${answer.firstName} ${answer.lastName} to the database`);
            init();
          })
          .catch(console.log);
      });
    });
  });
}

function updateEmployeeRole() {
  db.promise().query('SELECT * FROM employee').then(([employees]) => {
    db.promise().query('SELECT * FROM role').then(([roles]) => {
      inquirer.prompt([
        {
          type: 'list',
          name: 'employeeId',
          message: 'Which employee\'s role do you want to update?',
          choices: employees.map(employee => ({
            name: employee.first_name + ' ' + employee.last_name,
            value: employee.id
          }))
        },
        {
          type: 'list',
          name: 'roleId',
          message: 'Which role do you want to assign to the selected employee?',
          choices: roles.map(role => ({
            name: role.title,
            value: role.id
          }))
        }
      ]).then(answer => {
        db.promise().query('UPDATE employee SET role_id = ? WHERE id = ?',
          [answer.roleId, answer.employeeId])
          .then(() => {
            console.log(`Updated employee's role in the database`);
            init();
          })
          .catch(console.log);
      });
    });
  });
}

init();
