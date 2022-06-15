require("dotenv").config();

const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");

let query = "";

const db = mysql.createConnection(
    {
        host: "localhost",
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: "company_db"
    },
    console.log("Connected company_db")
);

function allEmployee() {
    query = `
    SELECT
        employee.id,
        employee.first_name,
        employee.last_name,
        title,
        department.name AS department,
        m.first_name + ' ' + m.last_name AS manager 
    FROM employee 
    JOIN role ON employee.role_id = role.id 
    JOIN department ON role.department_id = department.id 
    LEFT JOIN employee AS m ON employee.manager_id = m.id`;
    db.query(query, function(err, result) {
        if (err) {
            throw err;
        }
        console.table(result);
        main();
    });
}

function addEmployee() {
    inquirer.prompt([
        {
            type: "input",
            name: "first",
            message: "Employee's first name: "
        },
        {
            type: "input",
            name: "last",
            message: "Employee's last name: "
        },
        {
            type: "input",
            name: "role",
            message: "ID of employee's role: "
        },
        {
            type: "input",
            name: "manager",
            message: "ID of employee's manager(Enter 'Null' if the employee is a manager): "
        }
    ]).then((answers) =>{
        query = `
            INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES ("${answers.first}", "${answers.last}", ${answers.role}, ${answers.manager})`;
        db.query(query, function(err, result) {
            if (err) {
                console.log("\nDepartment or manager doesn't exists. Back to main menu.\n");
            }
            else {
                console.log("\nNew employee added successfully.\n");
            }
            main();
        });
    });
}

function allRoles() {
    query = "SELECT role.id, title, department.name, salary FROM role JOIN department ON role.department_id = department.id";
    db.query(query, function(err, result) {
        if (err) {
            throw err;
        }
        console.table("Role Information", result);
        main();
    });
}

function addRole() {
    inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "Title of the role: "
        },
        {
            type: "input",
            name: "salary",
            message: "Salary of the role: "
        },
        {
            type: "input",
            name: "department",
            message: "ID of the role's department: "
        }
    ]).then((answers) =>{
        query = `
            INSERT INTO role (title, salary, department_id)
            VALUES ("${answers.title}", "${answers.salary}", ${answers.department})`;
        db.query(query, function(err) {
            if (err) {
                console.log("\nDepartment doesn't exists. Back to main menu.\n");
            }
            else {
                console.log("\nNew role added successfully.\n");
            }
            main();
        });
    });
}

function allDept() {
    query = "SELECT * FROM department";
    db.query(query, function(err, result) {
        if (err) {
            throw err;
        }
        console.table("Department Information", result);
        main();
    });
}

function addDept() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Department's name: "
        }
    ]).then((answers) =>{
        query = `
            INSERT INTO department (name)
            VALUES ("${answers.name}")`;
        db.query(query, function(err) {
            if (err) {
                console.log("\nError occurred. Back to main menu.\n");
            }
            else {
                console.log("\nNew department added successfully.\n");
            }
            main();
        });
    });
}

function update() {
    inquirer.prompt([
        {
            type: "input",
            name: "id",
            message: "ID of employee to change role: "
        },
        {
            type: "input",
            name: "role",
            message: "ID of new role: "
        }
    ]).then((answers) =>{
        query = `
            UPDATE employee 
            SET role_id = ${answers.role}
            WHERE id = ${answers.id}`;
        db.query(query, function(err) {
            if (err) {
                console.log("\nRole doesn't exists. Back to main menu.\n");
            }
            else {
                console.log("\nChanged role of the employee successfully.\n");
            }
            main();
        });
    });
}

function main() {
    inquirer.prompt([
        {
            type: "list",
            name: "selection",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "Add Employee",
                "View All Roles",
                "Add Role",
                "View All Departments",
                "Add Department",
                "Update Employee Role",
                "Exit"
            ]
        }
    ]).then((answer) => {
        switch(answer.selection) {
            case "View All Employees":
                allEmployee();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "View All Roles":
                allRoles();
                break;
            case "Add Role":
                addRole();
                break;
            case "View All Departments":
                allDept();
                break;
            case "Add Department":
                addDept();
                break;
            case "Update Employee Role":
                update();
                break;
            default:
                console.log("GoodBye");
                process.exit();
        }
    });
}

function init() {
    db.connect();
    console.log("Welcome to Employee Manager.");
    main();
}

init();