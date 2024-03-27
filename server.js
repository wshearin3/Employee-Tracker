//TODO make project

const mysql = require('mysql2');
const inquirer = require('inquirer');
const fs = require('fs');
const { FORMERR } = require('dns');
const { join } = require('path');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_tracker_db'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log(",---------------------------------------------------.");
    console.log("|                                                   |");
    console.log("|   _____                 _                         |");
    console.log("|  | ____|_ __ ___  _ __ | | ___  _   _  ___  ___   |");
    console.log("|  |  _| | '_ ` _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\  |");
    console.log("|  | |___| | | | | | |_) | | ( ) | |_| |  __/  __/  |");
    console.log("|  |_____|_| |_| |_| .__/|_|\\___/ \\__, |\\___|\\___|  |");
    console.log("|                  |_|            |___/             |");
    console.log("|   _______                      _                  |");
    console.log("|  |__   __| _ __   ___  _  ___ | | _   ___  _ __   |");
    console.log("|     | |   | '__\\ / _ \\| |/ __\\| |/ / / _ \\| '__\\  |");
    console.log("|     | |   | |   | (_)   | |___|   < |  __/| |     |");
    console.log("|     |_|   |_|    \\___/|_|\\___/|_|\\_| \\___||_|     |");
    console.log("|                                                   |");
    console.log("`---------------------------------------------------'");
    //TODO Add function call to initialize app
    startTracker();
})

function startTracker() {
    inquirer.prompt(
        {
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View All Departments',
            'View All Roles',
            'View All Employees',
            'Add a Department',
            'Add a Role',
            'Add an Employee',
            'Update an Employee Role',
            'End Session',
            new inquirer.Separator("--End of Options--"),
        ]
    }).then((answer) => {
        switch (answer.action) {
            case 'View All Departments':
                viewDepartments();
                break;
            case 'View All Roles':
                viewRoles();
                break;
            case 'View All Employees':
                viewEmployees();
                break;
            case 'Add a Department':
                addDepartment();
                break;
            case 'Add a Role':
                addRole();
                break;
            case 'Add an Employee':
                addEmployee();
                break;
            case 'Add an Employee Role':
                addEmployeeRole();
                break;
            case 'End Session':
                console.log("Session Ended")
                connection.end();
                break;
        }
       
    });
};

function viewDepartments() {
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.table(res);
        startTracker();
    });
};

function viewRoles() {
    connection.query('SELECT role.id, role.title, role.salary, department.name AS department FROM role INNER JOIN department ON (department.id = role.department_id)', (err, res) => {
       if (err) throw err;
       console.table(res);
       startTracker(); 
    });
};

function viewEmployees() {
    const query =` 
    SELECT
        employee.id,
        employee.first_name,
        employee.last_name,
        role.title AS role,
        department.name AS department,
        role.salary,
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM
        employee
    LEFT JOIN
        employee manager ON manager.id = employee.manager_id
    INNER JOIN
        role ON (role.id = employee.role_id)
    INNER JOIN
        department ON (department.id = role.department_id) ORDER BY employee.id;`
    // connection.query('SELECT employee.id, employee.first_name', employee.last_name, role.title AS role, department.name AS department, role.salary, CONCA)
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        startTracker();
    });
};