//imageRoutes.js

import express from 'express';
import upload from './path/to/your/upload'; // Adjust the path to your upload middleware
import fs from 'fs';
import { classifyImage } from './imageClassification.js'; // Adjust the path to your classifyImage function

const router = express.Router();

// POST request to classify image
router.post('/classify', upload.single('image'), async (req, res) => {
  try {
    const imageFilePath = req.file.path;
    const bestResult = await classifyImage(imageFilePath);

    // Clean up the file
    fs.unlinkSync(imageFilePath);

    // Send the best result back
    res.json(bestResult);
    console.log('Image classified:', bestResult);

  } catch (error) {
    res.status(500).send('Error classifying image');
  }
});

export default router;
