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
            case 'Update an Employee Role':
                updateRole();
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

function addDepartment() {
    inquirer.prompt({
        name: 'department',
        type: 'input',
        message: 'Please enter new department name.'
    })
    .then((answer) => {
        connection.query('INSERT INTO department SET ?', { name: answer.department }, err =>{
            if (err) throw err;
            console.log('Department succesfully added.');
            startTracker();
        });
         
    });
};

function addRole() {
    connection.query('SELECT * FROM department', (err, departments) => {
        if (err) throw err;
        const departmentChoices = departments.map(department => ({
            name: department.name,
            value: department.id
        }));
    
    inquirer.prompt([
        { 
            name: 'title',
            type: 'input',
            message: 'Please enter the title of the role.'
        },
        {
            name: 'salary',
            type: 'input',
            message: 'Please enter the salary for this role.',
            validate: function(value) {
            const isValid = !isNaN(parseFloat(value));
            return isValid || 'Please enter a valid salary';
            }

        },
        {
            name: 'department',
            type: 'list',
            message: 'Please select the appropriate department for the role.',
            choices: departmentChoices
        }

    ]).then((answer) => {
        connection.query(
            'INSERT INTO role SET ?',
            {
                title: answer.title,
                salary: parseFloat(answer.salary),
                department_id: answer.department
            },
            (err, res) => {
                if (err) throw err;
                console.log('Role added suceesfully to the database.');
                startTracker();
            }
        );
    });
});
}

// const mysql = require('mysql/promise');

function addEmployee() {
    connection.query('SELECT * FROM employee', (err, res) => {
        const employeeChoices = res.map(employees => ({
            name: employees.first_name.concat(' ', employees.last_name),
            value: employees.id
        }));
    
    connection.query('SELECT * FROM role', (err, res) => {
        roleChoices = res.map(role => ({
            name: role.title,
            value: role.id
        }));
            return inquirer.prompt([
                {
                    name: 'first_name',
                    type: 'input',
                    message: "Please enter the employee's first name."
                },
                {
                    name: 'last_name',
                    type: 'input',
                    message: "Please enter the employee's last name."
                },
                {
                    name: 'role_id',
                    type: 'list',
                    message: 'Please select the role for this employee.',
                    choices: roleChoices
                },
                {
                    name: 'manager_id',
                    type: 'list',
                    message: "Please select the employee's manager.",
                    choices: [...employeeChoices, {name: 'None', value: null}]
                }
            ]).then( (answer) => {
            connection.query( 'INSERT INTO employee SET ?',
            {
                first_name: answer.first_name,
                last_name: answer.last_name,
                role_id: answer.role_id,
                manager_id: answer.manager_id
            },
            (err, res) => {
                if (err) throw err;
                console.log('Employee successfully addded.');
                startTracker();
            }
        );
            });
        });
    });
}

function updateRole() {
    connection.query('SELECT * FROM employee', (err, res) => {
        const employeeChoices = res.map(employees => ({
            name: employees.first_name.concat(' ', employees.last_name),
            value: employees.id
        }));
    connection.query('SELECT * FROM role', (err, res) => {
        roleChoices = res.map(role => ({
            name: role.title,
            value: role.id
        }));
        return inquirer.prompt([
            {
                name:'employee',
                type: 'list',
                message: "Which employee's role would you like to update?",
                choices: employeeChoices
            },
            {
                name: 'role',
                type: 'list',
                message: "What is the employee's new role?",
                choices: roleChoices
            },
        ]).then((answer) => {
            connection.query('UPDATE employee SET ? WHERE ?',
            [
            {
                role_id: answer.role,
            },
            {
                id: answer.employee
            }
            ],
            (err, res) => {
                if (err) throw err;
                console.log('Role successfully updated.');
                startTracker();
            }
            );
        });
    });
});
}