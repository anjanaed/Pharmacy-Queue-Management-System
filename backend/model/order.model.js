const { text } = require('express');
const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
    {
        orderID: { 
            type: String, 
            required: [true, 'Order ID is required'], 
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
        }
    }
);

const OrderModel = mongoose.model('Order', orderSchema);

module.exports = OrderModel;