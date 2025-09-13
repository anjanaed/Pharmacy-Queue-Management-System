import mongoose from 'mongoose';

const employeeSchema = mongoose.Schema(
    {
        empID: { 
            type: String, 
            required: [true, "Employee ID is required"], 
            unique:[true, "Employee ID is Already Existing"]
        },

        name: { 
            type: String, 
            required: [true, "Employee name is required"], 
        },

        email: { 
            type: String, 
            required: [false, "Employee email is required"],
            unique:[true,"Email Already Registered"],
            validate: {
                validator: function (v) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: props => `${props.value} is not a valid email!`
            }
        }, 
    }
);

const EmployeeModel = mongoose.model('Employee', employeeSchema);

export default EmployeeModel;