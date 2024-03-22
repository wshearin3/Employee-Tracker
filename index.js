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