const router = require('express').Router();
const Invoices = require('../models/invoices.model');

router.get('/', async (req, res) => {
    try {
        const response = await Invoices.find();

        return res.status(200).json({ success: true, mesaage: "Invoices Fetch Success", response });

    } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
        console.log("Error =>", error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const invoice = await Invoices.findOne({ _id: req.params.id });

        if (!invoice) return res.status(404).json({ success: false, message: "No such invoice found with given ID." });

        return res.status(200).json({ success: true, mesaage: "Invoice Fetch Success", response: invoice });

    } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
        console.log("Error =>", error);
    }
});

router.post('/', async (req, res) => {
    try {
        const invoice = Invoices({
            customerName: req.body.customerName,
            customerGST: req.body.customerGST,
            customerPhone: req.body.customerPhone,
            productList: req.body.productList
        });

        const response = await invoice.save();

        res.status(200).json({ success: true, message: "New Invoice Added Successfully.", response });

    } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
        console.log("Error =>", error);
    }
});

module.exports = router;