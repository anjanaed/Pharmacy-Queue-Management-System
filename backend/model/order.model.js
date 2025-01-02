const { text } = require('express');
const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
    {
        orderID: { 
            type: String, 
            required: [true, 'Order ID is required'],
            unique: true, 
        },

        orderDate: { 
            type: Date, 
            required: [true, 'Order date is required'],
            validate: {
                validator: function (v) {
                    return v <= new Date();
                },
                message: props => `Order date ${props.value} cannot be in the future`
            }
        },

        orderTime: {
            type: String,
            required: [true, 'Order time is required'],
            validate: {
                validator: function (v) {
                    return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
                },
                message: props => `${props.value} is not a valid order time`
            }
        },

        orderStatus: { 
            type: String, 
            required: [true, 'Order status is required'],
            enum: {
                values: ['Pending', 'Completed', 'Cancelled'], 
                message: '{VALUE} is not a valid order status'
            }
        }, 

        EmpID: { 
            type: String, 
            required: [true, 'Employee ID is required'],
            validate: {
                validator: function (v) {
                    // Validate employee ID format (e.g., must start with "E" followed by digits)
                    return /^E\d+$/.test(v);
                },
                message: props => `${props.value} is not a valid Employee ID`
            }
        }
    }
);

const OrderModel = mongoose.model('Order', orderSchema);

module.exports = OrderModel;