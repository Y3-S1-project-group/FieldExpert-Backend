import express from 'express';
const cropRouter = express.Router();
import Crop from '../model/crop.js';

// Route to add a new crop record (/addCrop)
cropRouter.post("/addCrop", async (req, res) => {
    try {
        const { cropName, quantity, area, city, plantingDate, harvestDate } = req.body;

        // Input validation
        if (!cropName || !quantity || !area ||!city ||!plantingDate || !harvestDate) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Create a new crop object
        const newCropData = {
            cropName,
            quantity,
            area,
            city,
            plantingDate,
            harvestDate
        };

        const newCrop = new Crop(newCropData);
        await newCrop.save();
        res.status(201).json({ message: "Crop record added successfully", crop: newCrop });
    } catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "Error adding crop record" });
    }
});

// Route to get all crop records (/getAllCrops)
cropRouter.get("/getCrops", async (req, res) => {
    try {
        const crops = await Crop.find().sort({ _id: 1 }); // Sort by ascending order of _id
        res.json(crops);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching crop records" });
    }
});
   


// Route to update a crop record (/updateCrop)
cropRouter.put("/updateCrop/:id", async (req, res) => {
    const { id } = req.params;
    const { cropName, quantity, area,city, plantingDate, harvestDate } = req.body;

    try {
        const updatedCrop = await Crop.findByIdAndUpdate(
            id,
            {
                cropName,
                quantity,
                area,
                city,
                plantingDate,
                harvestDate,
            },
            { new: true } // Return updated document
        );

        if (!updatedCrop) {
            return res.status(404).json({ message: 'Crop not found' });
        }

        res.status(200).json({ message: 'Crop updated successfully', data: updatedCrop });
    } catch (error) {
        res.status(500).json({ message: 'Error updating crop', error: error.message });
    }
});


// Route to delete a crop record (/deleteCrop)
cropRouter.delete("/deleteCrop/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCrop = await Crop.findByIdAndDelete(id);

        if (!deletedCrop) {
            return res.status(404).json({ message: 'Crop not found' });
        }

        res.status(200).json({ message: 'Crop deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting crop', error: error.message });
    }
});


export default cropRouter;


