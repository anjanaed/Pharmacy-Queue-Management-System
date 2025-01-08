const express = require('express');
const router = express.Router();
const EmployeeController = require('../controller/employee.controller.js');
const EmployeeModel = require('../model/employee.model.js');

router.get('/', EmployeeController.getEmployees);
router.get('/:empID', EmployeeController.getEmployee);
router.post('/', EmployeeController.createEmployee);
router.put('/:empID', EmployeeController.updateEmployee);
router.delete('/:empID', EmployeeController.deleteEmployee);
router.get('/check/:id', EmployeeController.employeeExists);

module.exports = router;