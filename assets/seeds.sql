INSERT INTO departments (deptname)
VALUES ("Marketing"), ("Finance"), ("Web Development"), ("Administration"), ("Human Recourses");

INSERT INTO roles (title, salary, department_id)
VALUE ("Sales Specialist", 90000, 1), ("Accountant", 60000, 2), ("Junior Developer", 60000, 3), ("Senior Developer", 80000, 3), ("Receptionist", 30000, 4), ("Recruiter", 40000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Harry", "Potter", 1, NULL), ("Hermione", "Granger", 2, 1), ("Ron", "Weasley", 3, 1), ("Luna", "Lovegood", 4, 1), ("Draco", "Weasley", 5, 1), ("Ginny", "Weasley", 6, 1);

