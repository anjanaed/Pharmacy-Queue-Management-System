const Employee = require('../model/employee.model.js');

const getEmployees = async (req, res) => {
    try {
        const employee = await Employee.find({});
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getEmployee = async (req, res) => {
    try {
        const { empID } = req.params;
<<<<<<< HEAD
        const employee = await Employee.findOne( {empID} );
=======
        const employee = await Employee.findOne({ empID });
        if (!employee) {
            return res.status(404).json({ message: `No employee with id: ${empID}` });
        }
>>>>>>> 9bf97bc2e2e9001b2dd48804f71b5753c578c11d
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const createEmployee = async (req, res) => {
    try {
        const employee = await Employee.create(req.body);
        res.status(200).json(employee);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            res.status(400).json({ message: messages.join(', ') });
        } else if (error.code === 11000) {
            res.status(400).json({ message: 'Duplicate email or phone number' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
}

const updateEmployee = async (req, res) => {
    try {
        const { empID } = req.params;
        const employee = await Employee.findOneAndUpdate({ empID }, req.body);

        if (!employee) {
            return res.status(404).json({ message: `No employee with empID: ${empID}` });
        }

        const updateEmployee = await Employee.findOne({ empID });
        res.status(200).json(updateEmployee);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
        } else if (error.code === 11000) {
            return res.status(400).json({ message: 'Duplicate email or phone number' });
        } else {
            return res.status(500).json({ message: error.message });
        }
    }
}

const deleteEmployee = async (req, res) => {
    try {
        const { empID } = req.params;
        const employee = await Employee.findOneAndDelete({empID});

        if (!employee) {
            return res.status(404).json({ message: `No employee with id: ${empID}` });
        }
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



module.exports = { 
    getEmployees, 
    getEmployee, 
    createEmployee, 
    updateEmployee, 
    deleteEmployee
};