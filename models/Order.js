const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
        },
    ],
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    paymentMethod: { type: String },
});

module.exports = mongoose.model('Order', orderSchema);
