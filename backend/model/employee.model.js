const { text } = require('express');
const mongoose = require('mongoose');

const employeeSchema = mongoose.Schema(
    {
        empID: { 
            type: String, 
            required: [true, "Employee ID is required"], 
        },

        name: { 
            type: String, 
            required: [true, "Employee name is required"], 
        },

        email: { 
            type: String, 
            required: [true, "Employee email is required"],
            validate: {
                validator: function (v) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: props => `${props.value} is not a valid email!`
            }
        }, 

        phone: { 
            type: String, 
            required: [false, "Employee phone number is required"],
            validate: {
                validator: function (v) {
                    return /^\d{10}$/.test(v);
                },
                message: props => `${props.value} is not a valid phone number!`
            }
        },
    }
);

const EmployeeModel = mongoose.model('Employee', employeeSchema);

module.exports = EmployeeModel;