// pestDetectionHandler.js
import { detectPest } from '../services/pestDetection.js';

export async function handlePestDetection(req, res) {
    const imagePath = req.file.path;

    try {
        const predictions = await detectPest(imagePath);
        res.json(predictions);
    } catch (error) {
        res.status(500).send(error.toString());
    }
}