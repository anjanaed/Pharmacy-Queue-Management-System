const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors')
const employeeRoutes = require('./routes/employee.routes.js');
const orderRoutes = require('./routes/order.routes.js');
const EmployeeModel =require('./model/employee.model.js')
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
.then(() => {
    console.log("Connected to database");
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
})
.catch(() => {
    console.log("Connection failed");
});


let currentOrderNumber = 0;

// Reset order number at midnight
const resetOrderNumber = () => {
    currentOrderNumber = 0;
    console.log('Order number reset to 0');
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

