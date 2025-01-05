const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors')
const employeeRoutes = require('./routes/employee.routes.js');
const orderRoutes = require('./routes/order.routes.js');
const OrderModel=require('./model/order.model.js');
const app = express()
app.use(cors())

// middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/employee', employeeRoutes);
app.use('/api/order', orderRoutes);

// test route
app.get('/', (req, res) =>{
    res.send('Hello from backend server');
});


mongoose.connect("mongodb+srv://backendoc2002:5zneisS9SrygW9mB@pharmacy.hft0r.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Pharmacy")
.then(async () => {
    console.log("Connected to database");

    // Check the last order in the database and set currentOrderNumber
    const lastOrder = await OrderModel.findOne().sort({ orderID: -1 });
    if (lastOrder) {
        const lastOrderDate = new Date(lastOrder.orderDate);
        const today = new Date();
        if (lastOrderDate.toDateString() === today.toDateString()) {
            currentOrderNumber = parseInt(lastOrder.orderID) + 1;
        } else {
            currentOrderNumber = 1;
        }
    } else {
        currentOrderNumber = 1;
    }

    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
})
.catch(() => {
    console.log("Connection failed");
});


let currentOrderNumber = 1; // Initialize to 1 instead of 0

// Reset order number at midnight
const resetOrderNumber = () => {
    currentOrderNumber = 1; // Reset to 1 instead of 0
    console.log('Order number reset to 1');
};

// Schedule reset at midnight
const scheduleReset = () => {
    const now = new Date();
    const nextMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0, 0, 0
    );
    const timeUntilMidnight = nextMidnight - now;
    setTimeout(() => {
        resetOrderNumber();
        scheduleReset();
    }, timeUntilMidnight);
};

scheduleReset();

app.get('/api/orderNumber', (req, res) => {
    res.json({ currentOrderNumber });
});

app.post('/api/orderNumber/increment', (req, res) => {
    currentOrderNumber += 1;
    res.json({ currentOrderNumber });
});
