const express = require('express');
const router = express.Router();
const EmployeeController = require('../controller/employee.controller.js');
const EmployeeModel = require('../model/employee.model.js');

router.get('/', EmployeeController.getEmployees);
router.get('/:empID', EmployeeController.getEmployee);
router.post('/', EmployeeController.createEmployee);
router.put('/:empID', EmployeeController.updateEmployee);
router.delete('/:empID', EmployeeController.deleteEmployee);

// New route to check if employee ID exists
router.get('/check/:id', async (req, res) => {
  const employeeID = req.params.id;
  try {
    const employee = await EmployeeModel.findOne({ empID: employeeID });
    if (employee) {
      res.status(200).json({ exists: true });
    } else {
      res.status(404).json({ exists: false });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;