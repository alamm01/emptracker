SELECT e.id AS EmployeeID,
       e.first_name AS FirstName,
       e.last_name AS LastName,
       r.title AS RoleTitle,
       r.salary AS Salary,
       d.dep_name AS DepartmentName,
       m.first_name AS ManagerFirstName,
       m.last_name AS ManagerLastName
FROM employee e
JOIN role r ON e.role_id = r.id
JOIN department d ON r.department_id = d.id
LEFT JOIN employee m ON e.manager_id = m.id;

select * from department;
select * from role;
select * from employee;
