import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';

const classifyImage = async (imageFilePath) => {
  try {
    // Read the file
    const file = fs.createReadStream(imageFilePath);

    // Set up form data for the request
    const form = new FormData();
    form.append('imageData', file);

    // Azure Custom Vision API request
    const response = await axios.post(
      'https://pestdetectorapp-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/6450a1f3-e357-447a-9fa3-342ed95edb1e/classify/iterations/Iteration2/image',
      form,
      {
        headers: {
          ...form.getHeaders(),
          'Prediction-Key': '7d8f3b17455340fa9ecab2eb18b24ae9',
        },
      }
    );

    // Extract the prediction with the highest probability
    const predictions = response.data.predictions;
    const bestResult = predictions.reduce((max, prediction) => 
      max.probability > prediction.probability ? max : prediction
    );

    return bestResult;
  } catch (error) {
    throw new Error('Error classifying image: ' + error.message);
  }
};

export default classifyImage;
