import express from 'express';
const salesRouter = express.Router();
import Sale from '../model/sale.js';

// Route to add a new sale record (/addSD)
salesRouter.post("/addSD", async (req, res) => {
    try {
        const { cropType, quantity, onitemPrice, saleDate, customerInfo, distributionMethod, additionalDetails } = req.body;

        // Input validation
        if (!cropType || !quantity || !onitemPrice || !saleDate || !customerInfo || !distributionMethod) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Additional input validation for Unicode support
        const unicodeValidation = /^[\u0000-\uFFFF]*$/;
        if (!unicodeValidation.test(cropType) || !unicodeValidation.test(customerInfo) || !unicodeValidation.test(distributionMethod) || (additionalDetails && !unicodeValidation.test(additionalDetails))) {
            return res.status(400).json({ error: "Invalid characters in input" });
        }

        // Calculate totalPrice
        const totalPrice = quantity * onitemPrice;

        // Create a new sale object
        const newSaleData = {
            cropType,
            quantity,
            onitemPrice,
            saleDate,
            customerInfo,
            distributionMethod,
            additionalDetails: additionalDetails || '',
            totalPrice // Add totalPrice to the new sale object
        };

        const newSale = new Sale(newSaleData);
        await newSale.save();
        res.status(201).json({ message: "Sale record added successfully", sale: newSale });
    } catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "Error adding sale record" });
    }
});

// Route to get all sale records (/getAllSD)
salesRouter.get("/SD", async (req, res) => {
    try {
        const sales = await Sale.find().sort({ _id: 1 }); // Sort by ascending order of _id
        res.json(sales);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching sale records" });
    }
});

// Route to update a sale record (/updateSD)
salesRouter.put("/updateSD/:id", async (req, res) => {
    try {
        const { cropType, quantity, onitemPrice, saleDate, customerInfo, distributionMethod, additionalDetails } = req.body;

        // Additional input validation for Unicode support
        const unicodeValidation = /^[\u0000-\uFFFF]*$/;
        if (!unicodeValidation.test(cropType) || !unicodeValidation.test(customerInfo) || !unicodeValidation.test(distributionMethod) || (additionalDetails && !unicodeValidation.test(additionalDetails))) {
            return res.status(400).json({ error: "Invalid characters in input" });
        }

        // Calculate totalPrice
        const totalPrice = quantity * onitemPrice;

        const updatedSale = {
            cropType,
            quantity,
            onitemPrice,
            saleDate,
            customerInfo,
            distributionMethod,
            additionalDetails,
            totalPrice // Add totalPrice to the updated sale object
        };

        const updatedRecord = await Sale.findByIdAndUpdate(req.params.id, updatedSale, { new: true });

        if (!updatedRecord) {
            return res.status(404).json({ error: "Sale record not found" });
        }

        res.json({ message: "Sale record updated successfully", sale: updatedRecord });
    } catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "Error updating sale record" });
    }
});

// Route to delete a sale record (/deleteSD)
salesRouter.delete("/deleteSD/:id", async (req, res) => {
    try {
        const deletedRecord = await Sale.findByIdAndDelete(req.params.id);

        if (!deletedRecord) {
            return res.status(404).json({ error: "Sale record not found" });
        }

        res.json({ message: "Sale record deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error deleting sale record" });
    }
});

// Route to get a sale record by ID (/getSD/:id)
salesRouter.get("/getSD/:id", async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id);

        if (!sale) {
            return res.status(404).json({ error: "Sale record not found" });
        }

        res.json(sale);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching sale record" });
    }
});

export default salesRouter;
