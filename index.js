require("dotenv").config();

const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");

let query = "";
let deptNameArray;
let deptIdArray;
let roleNameArray;
let roleIdArray;
let employeeNameArray;
let employeeIdArray;

const db = mysql.createConnection(
    {
        host: "localhost",
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: "company_db"
    },
    console.log("Connected company_db")
);

// function to get array of id and name from dept, role, or employee table
function getArrayFromDept() {
    query = `
        SELECT *
        FROM department
        `;
    db.query(query, function(err, result) {
        if(err)
        {
            throw error;
        }
        deptNameArray = result.map(x => x.name);
        deptIdArray = result.map(x => x.id);
    });
}

function getArrayFromRole() {
    query = `
        SELECT *
        FROM role
        `;
    db.query(query, function(err, result) {
        if(err)
        {
            throw error;
        }
        roleNameArray = result.map(x => x.title);
        roleIdArray = result.map(x => x.id);
    });
}

function getArrayFromEmployee() {
    query = `
        SELECT id, CONCAT(first_name, " ", last_name) AS name
        FROM employee
        `;
    db.query(query, function(err, result) {
        if(err)
        {
            throw error;
        }
        employeeNameArray = result.map(x => x.name);
        employeeIdArray = result.map(x => x.id);
        employeeNameArray.push("None")
    });
}


// function to show list of all employees
function allEmployee() {
    query = `
    SELECT
        employee.id,
        employee.first_name AS "first name",
        employee.last_name AS "last name",
        title,
        department.name AS department,
        CONCAT(m.first_name, ' ', m.last_name) AS manager 
    FROM employee 
    JOIN role ON employee.role_id = role.id 
    JOIN department ON role.department_id = department.id 
    LEFT JOIN employee AS m ON employee.manager_id = m.id`;
    
    db.query(query, function(err, result) {
        if (err) {
            throw err;
        }
        console.log("");
        console.table(result);
        main();
    });
}

// function to add new employee
function addEmployee() {
    var response = inquirer.prompt([
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
            type: "list",
            name: "role",
            message: "Employee's role:",
            choices: roleNameArray
        },
        {
            type: "list",
            name: "manager",
            message: "Employee's manager(Select 'None' if the employee is a manager):",
            choices: employeeNameArray
        }
    ]).then((answers) =>{
        var roleId = roleIdArray[roleNameArray.indexOf(answers.role)];
        var managerId = "null";
        if(answers.manager != "None"){
            managerId = employeeIdArray[employeeNameArray.indexOf(answers.manager)];
        }

        query = `
            INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES ("${answers.first}", "${answers.last}", ${roleId}, ${managerId})`;
        db.query(query, function(err) {
            if (err) {
                console.log("\nDepartment or manager doesn't exists. Back to main menu.\n");
            }
            else {
                console.log("\nNew employee added successfully.\n");
            }
            getArrayFromEmployee();
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
        console.log("");
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
            type: "list",
            name: "department",
            message: "Department of new role: ",
            choices: deptNameArray
        }
    ]).then((answers) =>{
        var id = deptIdArray[deptNameArray.indexOf(answers.department)];
        query = `
            INSERT INTO role (title, salary, department_id)
            VALUES ("${answers.title}", "${answers.salary}", ${id})`;
        db.query(query, function(err) {
            if (err) {
                console.log("\nDepartment doesn't exists. Back to main menu.\n");
            }
            else {
                console.log("\nNew role added successfully.\n");
            }
            getArrayFromRole();

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
        console.log("");
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
            getArrayFromDept();
            main();
        });
    });
}

function update() {
    inquirer.prompt([
        {
            type: "list",
            name: "name",
            message: "Select employee to change role: ",
            choices: employeeNameArray
        },
        {
            type: "list",
            name: "role",
            message: "New role:",
            choices: roleNameArray
        }
    ]).then((answers) =>{
        var employeeId = employeeIdArray[employeeNameArray.indexOf(answers.name)];
        var roleId = roleIdArray[roleNameArray.indexOf(answers.role)];
        query = `
            UPDATE employee 
            SET role_id = ${roleId}
            WHERE id = ${employeeId}`;
        db.query(query, function(err) {
            if (err) {
                console.log("\nRole doesn't exists. Back to main menu.\n");
            }
            else {
                console.log("\nChanged role of the employee successfully.\n");
            }
            getArrayFromEmployee();
            main();
        });
    });
}

async function main() {
    await inquirer.prompt([
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
                console.log("Good Bye");
                process.exit();
        }
    });
}

function init() {
    db.connect();
    getArrayFromRole();
    getArrayFromEmployee();
    getArrayFromDept();

    console.log("Welcome to Employee Manager.");
    main();
}

init();