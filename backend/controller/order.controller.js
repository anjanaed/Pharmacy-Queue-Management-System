import Order from '../model/order.model.js';

const getOrders = async (req, res) => {
    try {
        const order = await Order.find({});
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getOrder = async (req, res) => {
    try {
        const { orderID } = req.params;
        const order = await Order.findOne({ orderID });
        if (!order) {
            res.status(404).json({ message: `No order with id: ${orderID}` });
        }
        res.status(200).json(order);
    }  catch (error) {  
        res.status(500).json({ message: error.message });
    }
}

const createOrder = async (req, res) => {
    try {
        const order = await Order.create(req.body);
        res.status(200).json(order);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            res.status(400).json({ message: messages.join(', ') });
        } else if (error.code === 11000) {
            res.status(400).json({ message: 'Duplicate order ID' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
}

const updateOrder = async (req, res) => {
    try {
        const { orderID,orderDate } = req.params;
        const order = await Order.findOneAndUpdate({ orderID,orderDate }, req.body,{ new: true });

        if (!order) {
            res.status(404).json({ message: `No order with orderID: ${orderID}` });
        }

        const updateOrder = await Order.findOne({ orderID });
        res.status(200).json(updateOrder);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
        } else {
            return res.status(500).json({ message: error.message });
        }
    }
}

const deleteOrder = async (req, res) => {
    try {
        const { orderID } = req.params;
        const order = await Order.findOneAndDelete({ orderID });    

        if (!order) {
            res.status(404).json({ message: `No order with id: ${orderID}` });
        }
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getOrdersByEmployee = async (req, res) => {
    try {
        const { empID } = req.params;

        const dailyOrders = await Order.aggregate([
            { $match: { EmpID: empID } }, // Filter by employee ID
            {
                $group: {
                    _id: {
                        year: { $year: "$orderDate" },
                        month: { $month: "$orderDate" },
                        day: { $dayOfMonth: "$orderDate" }
                    },
                    totalOrders: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ]);

        const weeklyOrders = await Order.aggregate([
            { $match: { EmpID: empID } }, 
            {
                $group: {
                    _id: {
                        year: { $year: "$orderDate" },
                        week: { $week: "$orderDate" }
                    },
                    totalOrders: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.week": 1 } }
        ]);

        const monthlyOrders = await Order.aggregate([
            { $match: { EmpID: empID } }, 
            {
                $group: {
                    _id: {
                        year: { $year: "$orderDate" },
                        month: { $month: "$orderDate" }
                    },
                    totalOrders: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        res.status(200).json({
            dailyOrders,
            weeklyOrders,
            monthlyOrders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export { 
    getOrders, 
    getOrder, 
    createOrder, 
    updateOrder, 
    deleteOrder,
    getOrdersByEmployee
};

export default { 
    getOrders, 
    getOrder, 
    createOrder, 
    updateOrder, 
    deleteOrder,
    getOrdersByEmployee
};