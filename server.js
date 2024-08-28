const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const classifyImage = require('./routes/imageClassification');

const app = express();
const port = 5000;

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

app.use(cors());

// POST request to classify image
app.post('/classify', upload.single('image'), async (req, res) => {
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
app.get('/', (req, res) => {
  res.send('Hello from the Node.js backend!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port number ${port}`);
});
