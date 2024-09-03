// routes.js (or imageRoutes.js)

const express = require('express');
const router = express.Router();
const upload = require('./path/to/your/upload'); // Adjust the path to your upload middleware
const fs = require('fs');
const { classifyImage } = require('./path/to/your/classifyImage'); // Adjust the path to your classifyImage function

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

// A simple route to check if the server is working
router.get('/', (req, res) => {
  res.send('Hello from the Node.js backend!');
});

module.exports = router;
