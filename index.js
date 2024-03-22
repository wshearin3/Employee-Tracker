//TODO make project

const mysql = require('mysql2');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_tracker'
});

connection.connect(err => {
    if (err) throw err;
    console.log('Connected to Employee Tracker.');
    //TODO Add function call to initialize app
})

function startTracker() {
    inquirer.createPromptModule({
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
            'Quit',
        ]
    })
}