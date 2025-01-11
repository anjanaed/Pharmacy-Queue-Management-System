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

async function upNumber(){
    currentOrderNumber++;
}

async function checkLastOrder(){
    let lastOrder = await OrderModel.findOne().sort({ _id: -1 });
    if (lastOrder) {
        let lastOrderDate = new Date(lastOrder.orderDate);
        let today = new Date();
        let todayUTC530 = new Date(today.getTime() + (5.5 * 60 * 60 * 1000));
        if (lastOrderDate.toDateString() === todayUTC530.toDateString()) {
            if (currentOrderNumber - 2 === lastOrder.orderID || 
                currentOrderNumber - 1 === lastOrder.orderID || 
                currentOrderNumber === lastOrder.orderID) {
                // Do nothing if currentOrderNumber is within the last three order IDs
            } else {
                await orderUpdate();
            }
        } else {
            currentOrderNumber = 1;
        }
    } else {
        currentOrderNumber = 1;
    }
}

async function orderUpdate(){
    let lastOrder = await OrderModel.findOne().sort({ _id: -1 });
    currentOrderNumber = parseInt(lastOrder.orderID) + 1;
    lastOrder=null;

}


mongoose.connect("mongodb+srv://backendoc2002:5zneisS9SrygW9mB@pharmacy.hft0r.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Pharmacy")
.then(async () => {
    console.log("Connected to database");
    await checkLastOrder();
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
})
.catch(() => {
    console.log("Connection failed");
});


let currentOrderNumber; 

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

app.get('/api/orderNumber', async(req, res) => {
    await orderUpdate();
    res.json({ currentOrderNumber });
});

app.post('/api/orderNumber/increment', async(req, res) => {
    await upNumber();
    res.json({ currentOrderNumber });
});
