const express = require('express')
const router = express.Router();
const EmployeeController = require('../controller/employee.controller.js');

router.get('/', EmployeeController.getEmployees);
router.get('/:empID', EmployeeController.getEmployee);
router.post('/', EmployeeController.createEmployee);
router.put('/:empID', EmployeeController.updateEmployee);
router.delete('/:empID', EmployeeController.deleteEmployee);

module.exports = router;