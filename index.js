const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");

let query = "";

const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "taeyong1992",
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
    JOIN employee AS m ON employee.manager_id = m.id`;
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
            message: "First name: "
        },
        {
            type: "input",
            name: "last",
            message: "Last name: "
        },

    ])
    main();
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

    main();
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

    main();
}

function update() {

    main();
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
    console.log("Welcome to Employee Manager.")
    main();
}

init();