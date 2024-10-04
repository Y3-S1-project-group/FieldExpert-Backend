// diseaseClassification.js

import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';

// Function for classifying Potato diseases
const classifyPotatoDisease = async (imageFilePath) => {
  return classifyWithCustomVision(imageFilePath, 
    'https://potatodiseases-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/1c13d9d9-c8ac-429a-9c39-30edb823cf4e/classify/iterations/Iteration3/image',
    '604b224a05f14a8c827a5e97c9b53823');
};

// Function for classifying Cassava diseases
const classifyCassavaDisease = async (imageFilePath) => {
  return classifyWithCustomVision(imageFilePath, 
    'https://cassavadiseases-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/15f14b14-552f-4316-a8ff-445dee5540e1/classify/iterations/Iteration1/image',
    'a5ab3e9b725c480d849f539025c1ee82');
};

// Function for classifying Tomato diseases
const classifyTomatoDisease = async (imageFilePath) => {
  return classifyWithCustomVision(imageFilePath, 
    'https://tomatodiseases-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/83626ecd-b662-4b12-b227-82afbb1ee9bd/classify/iterations/Iteration1/image',
    '643285f2cdfe4950890deaaa389e2c95');
};

// Function for classifying Rice diseases
const classifyRiceDisease = async (imageFilePath) => {
  return classifyWithCustomVision(imageFilePath, 
    'https://ricediseases-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/fc13c71a-8745-4bf4-aa18-be31ca9533a0/classify/iterations/Iteration1/image',
    '23b1a6461aeb4daa9ad87062a520d1cb');
};

// Function for classifying Sugarcane diseases
const classifySugarcaneDisease = async (imageFilePath) => {
  return classifyWithCustomVision(imageFilePath, 
    'https://sugarcanediseases-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/515d99a1-6336-4289-8a66-b922c1dadc8a/classify/iterations/Iteration1/image',
    '1a5b386695154f7eb38a724470878709');
};

// Reusable function to classify images using Azure Custom Vision
const classifyWithCustomVision = async (imageFilePath, apiUrl, apiKey) => {
  try {
    const file = fs.createReadStream(imageFilePath);
    const form = new FormData();
    form.append('imageData', file);

    const response = await axios.post(apiUrl, form, {
      headers: {
        ...form.getHeaders(),
        'Prediction-Key': apiKey,
      },
    });

    const predictions = response.data.predictions;
    const bestResult = predictions.reduce((max, prediction) =>
      max.probability > prediction.probability ? max : prediction
    );

    return bestResult;
  } catch (error) {
    throw new Error('Error classifying image: ' + error.message);
  }
};

export {
  classifyPotatoDisease,
  classifyCassavaDisease,
  classifyTomatoDisease,
  classifyRiceDisease,
  classifySugarcaneDisease,
};
