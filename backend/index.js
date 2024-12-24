const express = require('express')
const mongoose = require('mongoose');
const employeeRoutes = require('./routes/employee.routes.js');
const orderRoutes = require('./routes/order.routes.js');
const app = express()

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