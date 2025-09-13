import express from 'express';
import EmployeeController from '../controller/employee.controller.js';
import EmployeeModel from '../model/employee.model.js';

const router = express.Router();

router.get('/', EmployeeController.getEmployees);
router.get('/:empID', EmployeeController.getEmployee);
router.post('/', EmployeeController.createEmployee);
router.put('/:empID', EmployeeController.updateEmployee);
router.delete('/:empID', EmployeeController.deleteEmployee);
router.get('/check/:id', EmployeeController.employeeExists);

export default router;