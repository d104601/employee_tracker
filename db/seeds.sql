INSERT INTO department (name)
VALUES ("Web Development"),
       ("Data Science");
       
INSERT INTO role (title, salary, department_id)
VALUES ("Front End", 55000, 1),
       ("Back End", 65000, 1),
       ("Full Stack", 75000, 1),
       ("Data Analyst", 80000, 2),
       ("Developer", 70000, 2);
       
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Steve", "Lee", 1, null),
       ("James", "Allen", 1, 1),
       ("John", "Doe", 2, 1);
