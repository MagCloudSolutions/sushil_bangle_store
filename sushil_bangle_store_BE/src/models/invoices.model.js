const { Schema, model } = require('mongoose');

const invoiceSchema = Schema({
    customerName: {
        type: String,
        trim: true,
    },
    customerGST: {
        type: String,
        trim: true,
    },
    customerPhone: {
        type: String,
        trim: true,
    },
    productList: {
        type: Array,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const Invoices = model('Invoices', invoiceSchema);

module.exports = Invoices;