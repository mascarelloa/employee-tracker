const inquirer = require("inquirer");
const mysql = require("mysql");
const util = require("util");

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
});

//This allows async await.
connection.query = util.promisify(connection.query);

const startMenu = () => {
  inquirer
    .prompt({
      name: "option",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Roles",
        "View All Departments",
        "Add An Employee",
        "Add a Role",
        "Add a Department",
        "Update an Employee's Role",
        "Remove An Employee",
        "Remove a Role",
        "Remove a Department",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.option) {
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
        case "Remove An Employee":
          removeEmployee();
          break;
        case "Remove a Role":
          removeRole();
          break;
        case "Remove a Department":
          removeDepartment();
          break;
        case "Exit":
          console.log("End.");
          connection.end();
          break;
      }
    });
};

//This creates an array of objects containing the current departments and pairs them with the department id to be used in the prompt and query. 
const depts = async () => {
    let res = await connection.query("SELECT * FROM departments")
    return res.map(dept => {
        return { name: dept.deptname, value: dept.id }
    })
  };

  //This creates an array of objects containing the current employees by first and last name and pairs it with their id to be used in the prompt and query. 
  const employees = async () => {
    const res = await connection.query(
      "SELECT * FROM employees",
    );
    let employeesArr = res.map((employee) => {
      return {
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      };
    });
    console.log(employeesArr)
    return employeesArr;
  };
  
  //This creates an array of objects containing the current roles and pairs it with the role id to be used in the prompt and query. 
const roles = async () => {
  let res = await connection.query("SELECT * FROM roles")
  return res.map(role => {
      return { name: role.title, value: role.id }
  })
};

// This creates an array of the current manager to display in the prompt.
let managersArr = [];
const managers = () => {
  connection.query(
    "SELECT first_name, last_name FROM employees WHERE manager_id IS NULL",
    function (err, res) {
      if (err) throw err;
      for (let i = 0; i < res.length; i++) {
        managersArr.push(res[i].first_name + " " + res[i].last_name);
      }
    }
  );
  return managersArr;
};



//This displays all the current employees.
const viewEmployees = () => {
  connection.query("SELECT * FROM employees", (err, data) => {
    if (err) throw err;
    console.table(data);
    startMenu();
  });
};

//This displays all current roles.
const viewRoles = () => {
  connection.query("SELECT * FROM roles", (err, data) => {
    if (err) throw err;
    console.table(data);
    startMenu();
  });
};

//This displays all the current departments.
const viewDepts = () => {
  connection.query("SELECT * FROM departments", (err, data) => {
    if (err) throw err;
    console.table(data);
    startMenu();
  });
};

//This adds en Employee with corresponding data to the employees table.
const addEmployee = () => {
  inquirer
    .prompt([
      {
        name: "first",
        type: "input",
        message: "What is your employee's first name?",
      },
      {
        name: "last",
        type: "input",
        message: "What is your employee's last name?",
      },
      {
        name: "role",
        type: "list",
        message: "What is your employee's role?",
        choices: () => roles(),
      },

      {
        name: "manager",
        type: "list",
        message: "Who is your employee's manager?",
        choices: managers(),
      },
    ])
    .then((answer) => {
      let managerId = managers().indexOf(answer.manager) + 1;
      let newEmployee = {
        first_name: answer.first,
        last_name: answer.last,
        role_id: answer.role,
        manager_id: managerId,
      };
      connection.query(
        "INSERT INTO employees SET ?",
        newEmployee,
        (err, data) => {
          if (err) throw err;
          viewEmployees();
        }
      );
    });
};

//This adds a role to the role table.
const addRole = () => {
  inquirer
    .prompt([
      {
        name: "roleName",
        type: "input",
        message: "What is the title of your new role?",
      },
      {
        name: "salary",
        type: "input",
        message: "What is the salary for your new role?",
      },
      {
        name: "department",
        type: "list",
        message: "What department does this new role belong to?",
        choices: () => depts(),
      },
    ])
    .then((answer) => {
      let newRole = {
        title: answer.roleName,
        salary: answer.salary,
        department_id: answer.department,
      };
      connection.query("INSERT INTO roles SET ?", newRole, (err, data) => {
        if (err) throw err;
        viewRoles();
      });
    });
};

//This adds a department to the department table.
const addDept = () => {
  inquirer
    .prompt([
      {
        name: "deptName",
        type: "input",
        message: "What is the name of your department?",
      },
    ])
    .then((answer) => {
      let newDept = {
        deptname: answer.deptName,
      };
      connection.query(
        "INSERT INTO departments SET ?",
        newDept,
        (err, data) => {
          if (err) throw err;
          viewDepts();
        }
      );
    });
};

//This updates an employee role.
const updateRole = () => {
  inquirer
    .prompt([
      {
        name: "employee",
        type: "list",
        message: "Which employee would you like to update?",
        choices: () => employees(),
      },
      {
        name: "update",
        type: "list",
        message: "What is the employee's new role?",
        choices: () => roles(),
      },
    ])
    .then((answer) => {
      connection.query(
        "UPDATE employees SET role_id = ? WHERE id = ?",
        [answer.update, answer.employee],
        (err, data) => {
          if (err) throw err;
          viewEmployees();
        }
      );
    });
};

//This removes and empoloyee from the employee table.
const removeEmployee = () => {
    inquirer
      .prompt([
        {
          name: "deletedEmployee",
          type: "list",
          message: "Which employee would you like to remove?",
          choices: () => employees()
        },
      ])
      .then((answer) => {
        connection.query(
          "DELETE FROM employees WHERE id = ?", answer.deletedEmployee,
          (err, data) => {
            if (err) throw err;
            viewEmployees();
          }
        );
      });
  };

//This removes a role from the roles table.
  const removeRole = () => {
    inquirer
      .prompt([
        {
          name: "deletedRole",
          type: "list",
          message: "Which role would you like to remove?",
          choices: () => roles()
        },
      ])
      .then((answer) => {
        connection.query(
          "DELETE FROM roles WHERE id = ?", answer.deletedRole,
          (err, data) => {
            if (err) throw err;
            viewRoles();
          }
        );
      });
  };

  //This removes a department from the department table.
  const removeDepartment = () => {
    inquirer
      .prompt([
        {
          name: "deletedDept",
          type: "list",
          message: "Which Department would you like to remove?",
          choices: () => depts()
        },
      ])
      .then((answer) => {
        connection.query(
          "DELETE FROM departments WHERE id = ?", answer.deletedDept,
          (err, data) => {
            if (err) throw err;
            viewDepts();
          }
        );
      });
  };