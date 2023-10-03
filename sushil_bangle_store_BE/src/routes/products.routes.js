const router = require('express').Router();
const Products = require('../models/products.model');

router.get('/', async (req, res) => {
    try {
        const response = await Products.find();

        return res.status(200).json({ success: true, mesaage: "Products Fetch Success", response });

    } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
        console.log("Error =>", error);
    }
});

router.post('/', async (req, res) => {
    try {
        const product = Products({
            category: req.body.category,
            company: req.body.company,
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity
        });

        const response = await product.save();

        res.status(200).json({ success: true, message: "New Product Added Successfully.", response });
    } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
        console.log("Error =>", error);
    }
});

router.put('/:id', async (req, res) => {
    const product = await Products.findOne({ _id: req.params.id });

    if (!product) return res.status(404).json({ success: false, message: "No such Product found with given ID." });

    try {
        const updatedProduct = await Products.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true });

        res.status(200).json({ success: true, message: "Product Update Success.", response: updatedProduct });

    } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
        console.log("Error =>", error);
    }
});

router.delete('/:id', async (req, res) => {
    const product = await Products.findOne({ _id: req.params.id });

    if (!product) return res.status(404).json({ success: false, message: "No such Product found with given ID." });

    try {
        const deletedProduct = await Products.findByIdAndDelete({ _id: req.params.id });

        res.status(200).json({ success: true, message: "Product Delete Success.", response: deletedProduct });

    } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
        console.log("Error =>", error);
    }
});

module.exports = router;