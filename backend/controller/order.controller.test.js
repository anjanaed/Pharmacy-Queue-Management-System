const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { getOrders, getOrder, createOrder, updateOrder, deleteOrder, getOrdersByEmployee } = require('./order.controller');
const Order = require('../model/order.model');

// backend/controller/order.controller.test.js

const app = express();
app.use(express.json());

app.get('/api/orders', getOrders);
app.get('/api/orders/:orderID', getOrder);
app.post('/api/orders', createOrder);
app.put('/api/orders/:orderID', updateOrder);
app.delete('/api/orders/:orderID', deleteOrder);
app.get('/api/orders/employee/:empID', getOrdersByEmployee);

jest.mock('../model/order.model');

describe('Order Controller', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('getOrders', () => {
        it('should return all orders', async () => {
            Order.find.mockResolvedValue([{ orderID: '1', EmpID: 'E123' }]);
            const res = await request(app).get('/api/orders');
            expect(res.status).toBe(200);
            expect(res.body).toEqual([{ orderID: '1', EmpID: 'E123' }]);
        });

        it('should handle errors', async () => {
            Order.find.mockRejectedValue(new Error('Error'));
            const res = await request(app).get('/api/orders');
            expect(res.status).toBe(500);
            expect(res.body.message).toBe('Error');
        });
    });

    describe('getOrder', () => {
        it('should return a specific order', async () => {
            Order.findOne.mockResolvedValue({ orderID: '1', EmpID: 'E123' });
            const res = await request(app).get('/api/orders/1');
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ orderID: '1', EmpID: 'E123' });
        });

        it('should handle order not found', async () => {
            Order.findOne.mockResolvedValue(null);
            const res = await request(app).get('/api/orders/1');
            expect(res.status).toBe(404);
            expect(res.body.message).toBe('No order with id: 1');
        });

        it('should handle errors', async () => {
            Order.findOne.mockRejectedValue(new Error('Error'));
            const res = await request(app).get('/api/orders/1');
            expect(res.status).toBe(500);
            expect(res.body.message).toBe('Error');
        });
    });

    describe('createOrder', () => {
        it('should create a new order', async () => {
            Order.create.mockResolvedValue({ orderID: '1', EmpID: 'E123' });
            const res = await request(app).post('/api/orders').send({ orderID: '1', EmpID: 'E123' });
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ orderID: '1', EmpID: 'E123' });
        });

        it('should handle validation errors', async () => {
            Order.create.mockRejectedValue({ name: 'ValidationError', errors: { orderID: { message: 'Order ID is required' } } });
            const res = await request(app).post('/api/orders').send({});
            expect(res.status).toBe(400);
            expect(res.body.message).toBe('Order ID is required');
        });

        it('should handle duplicate order ID', async () => {
            Order.create.mockRejectedValue({ code: 11000 });
            const res = await request(app).post('/api/orders').send({ orderID: '1', EmpID: 'E123' });
            expect(res.status).toBe(400);
            expect(res.body.message).toBe('Duplicate order ID');
        });

        it('should handle other errors', async () => {
            Order.create.mockRejectedValue(new Error('Error'));
            const res = await request(app).post('/api/orders').send({ orderID: '1', EmpID: 'E123' });
            expect(res.status).toBe(500);
            expect(res.body.message).toBe('Error');
        });
    });

    describe('updateOrder', () => {
        it('should update an order', async () => {
            Order.findOneAndUpdate.mockResolvedValue({ orderID: '1', EmpID: 'E123' });
            Order.findOne.mockResolvedValue({ orderID: '1', EmpID: 'E123' });
            const res = await request(app).put('/api/orders/1').send({ EmpID: 'E124' });
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ orderID: '1', EmpID: 'E123' });
        });

        it('should handle order not found', async () => {
            Order.findOneAndUpdate.mockResolvedValue(null);
            const res = await request(app).put('/api/orders/1').send({ EmpID: 'E124' });
            expect(res.status).toBe(404);
            expect(res.body.message).toBe('No order with orderID: 1');
        });

        it('should handle validation errors', async () => {
            Order.findOneAndUpdate.mockRejectedValue({ name: 'ValidationError', errors: { EmpID: { message: 'EmpID is required' } } });
            const res = await request(app).put('/api/orders/1').send({});
            expect(res.status).toBe(400);
            expect(res.body.message).toBe('EmpID is required');
        });

        it('should handle duplicate order ID', async () => {
            Order.findOneAndUpdate.mockRejectedValue({ code: 11000 });
            const res = await request(app).put('/api/orders/1').send({ EmpID: 'E124' });
            expect(res.status).toBe(400);
            expect(res.body.message).toBe('Duplicate order ID');
        });

        it('should handle other errors', async () => {
            Order.findOneAndUpdate.mockRejectedValue(new Error('Error'));
            const res = await request(app).put('/api/orders/1').send({ EmpID: 'E124' });
            expect(res.status).toBe(500);
            expect(res.body.message).toBe('Error');
        });
    });

    describe('deleteOrder', () => {
        it('should delete an order', async () => {
            Order.findOneAndDelete.mockResolvedValue({ orderID: '1', EmpID: 'E123' });
            const res = await request(app).delete('/api/orders/1');
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Order deleted successfully');
        });

        it('should handle order not found', async () => {
            Order.findOneAndDelete.mockResolvedValue(null);
            const res = await request(app).delete('/api/orders/1');
            expect(res.status).toBe(404);
            expect(res.body.message).toBe('No order with id: 1');
        });

        it('should handle errors', async () => {
            Order.findOneAndDelete.mockRejectedValue(new Error('Error'));
            const res = await request(app).delete('/api/orders/1');
            expect(res.status).toBe(500);
            expect(res.body.message).toBe('Error');
        });
    });

    describe('getOrdersByEmployee', () => {
        it('should return orders by employee', async () => {
            Order.aggregate.mockResolvedValue([{ _id: { year: 2023, month: 10, day: 1 }, totalOrders: 5 }]);
            const res = await request(app).get('/api/orders/employee/E123');
            expect(res.status).toBe(200);
            expect(res.body.dailyOrders).toEqual([{ _id: { year: 2023, month: 10, day: 1 }, totalOrders: 5 }]);
        });

        it('should handle errors', async () => {
            Order.aggregate.mockRejectedValue(new Error('Error'));
            const res = await request(app).get('/api/orders/employee/E123');
            expect(res.status).toBe(500);
            expect(res.body.message).toBe('Error');
        });
    }); 
});