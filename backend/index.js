import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import employeeRoutes from './routes/employee.routes.js';
import orderRoutes from './routes/order.routes.js';
import OrderModel from './model/order.model.js';
const app = express()
app.use(cors())

dotenv.config();

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


mongoose.connect(process.env.MONGODB_URI)
.then(async () => {
    console.log("Connected to database");

    // Check the last order in the database and set currentOrderNumber
    const lastOrder = await OrderModel.findOne().sort({ _id: -1 });
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
