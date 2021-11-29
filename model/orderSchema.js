const mongoose = require('mongoose');

const  orderSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    orderArray: {
        type: [Object],
        required:true
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        required: true
    }
})

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;