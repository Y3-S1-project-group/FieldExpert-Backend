const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
// const classifyImage = require('./routes/imageClassification');

const app = express();
const port = 5000;
app.use(cors());

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// POST request to classify image
app.post('/classify', upload.single('image'), require('./routes/classifyImage'));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port number ${port}`);
});
