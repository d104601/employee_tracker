const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");

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
    db.query("SELECT * FROM employee", (err, result) => {
        if (err) {
            throw err;
        }
        consoleTable.getTable(result);
        main();
    });
}

function addEmployee() {
    db.query("")
    main();
}

function allRoles() {
    db.query("SELECT * FROM role", (err, result) => {
        if (err) {
            throw err;
        }
        consoleTable.getTable(result);
    });
    main();
}

function addRole() {

    main();
}

function allDept() {
    db.query("SELECT * FROM department", (err, result) => {
        if (err) {
            throw err;
        }
        consoleTable.getTable(result);
    });
    main();
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
    console.log("Welcome to Employee Manager.")
    main();
}

init();