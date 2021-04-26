const inquirer = require("inquirer");
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost", 
    port: 3306,
    user: "root",
    password: "root",
    database: "employeeDB",
});

connection.connect((err) => {
    if (err) throw err;
    startMenu();
})

const startMenu = () => {
    inquirer.prompt(
        {
            name: "option",
            type: "list",
            message: "What would you like to do?",
            choices: ["View All Employees", "View All Roles", "View All Departments", "Add An Employee", "Add a Role", "Add a Department", "Update an Employee's Role", "Exit"]
        }
    ).then ((answer) => {
        switch(answer.option) {
            case "View All Employees":
                viewEmployees();
                break;
            case "View All Roles":
                viewRoles();
                break;
            case "View All Departments":
                viewDepts();
                break;
            case "Add An Employee":
                addEmployee();
                break;
            case "Add a Role":
                addRole();
                break;
            case "Add a Department":
                addDept();
                break;
            case "Update an Employee's Role":
                updateRole();
                break;
            case "Exit":
                console.log("Thank you...");
                connection.end();
                break;
        }
    })
}

// This creates an array of the current roles to display in the prompt.
let rolesArr = [];
roles = () => {
    connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            rolesArr.push(res[i].title);
        }
    })
    return rolesArr;
}

// This creates an array of the current manager to display in the prompt.
let managersArr = [];
managers = () => {
    connection.query("SELECT first_name, last_name FROM employees WHERE manager_id IS NULL", function(err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            managersArr.push(res[i].first_name + " " + res [i].last_name);
        }
    })
    return managersArr;
}


const viewEmployees = () => {
    connection.query("SELECT * FROM employees", (err, data) => {
        if (err) throw err;
        console.table(data);
        startMenu();

    })
}

const viewRoles = () => {
    connection.query("SELECT * FROM roles", (err, data) => {
        if (err) throw err;
        console.table(data);
        startMenu();

    })
}

const viewDepts = () => {
    connection.query("SELECT * FROM departments", (err, data) => {
        if (err) throw err;
        console.table(data);
        startMenu();

    })
}


const addEmployee = () => {   
    connection.query("SELECT * FROM employees", (err, data) => {
        if (err) throw err;
        inquirer.prompt(
            {
                name: "first",
                type: "input",
                message: "What is your new employee's first name?",
                validate: data => { 
                    if (data !== "") {
                        return true
                    } 
                    return "Please enter a name."
                }
            },
            {
                name: "last",
                type: "input",
                message: "What is your new employee's last name?",
            },
            {
                name: "newRole",
                type: "list",
                message: "What is your new emplopyees role?",
                choices: roles(),
            },
            {
                name: "manager",
                type: "list",
                message: "Who is your new employee's manager?",
                choices: managers(),
            },
        )
        .then ((answer) => {
            let newEmployee = { first_name: answer.first, last_name: answer.last, role_id: answer.newRole, manager_id: answer.manager }
            connection.query("INSERT INTO employees SET ?", newEmployee, (err, data) => {
                if (err) throw err;
                viewEmployees();
            })
        })

    }
    )
}

const addRole = () => {
    connection.query("SELECT * FROM roles", (err, data) => {
        if (err) throw err;
        console.table(data);
        startMenu();

    })
}

const addDept = () => {
    connection.query("SELECT * FROM departments", (err, data) => {
        if (err) throw err;
        console.table(data);
        startMenu();

    })
}