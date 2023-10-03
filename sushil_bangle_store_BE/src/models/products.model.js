const { Schema, model } = require('mongoose');

const productSchema = Schema({
    category: {
        type: String,
        trim: true,
        required: [true, "Provide category"]
    },
    company: {
        type: String,
        trim: true,
        required: [true, "Provide company"]
    },
    name: {
        type: String,
        trim: true,
        required: [true, "Provide name"]
    },
    price: {
        type: String,
        required: [true, "Provide price"]
    },
    quantity: {
        type: String,
        required: [true, "Provide quantity"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const Products = model('Products', productSchema);

module.exports = Products;