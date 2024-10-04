// diseaseRoutes.js

import express from 'express';
import multer from 'multer';
import fs from 'fs';
import {
  classifyPotatoDisease,
  classifyCassavaDisease,
  classifyTomatoDisease,
  classifyRiceDisease,
  classifySugarcaneDisease
} from '../routes/diseaseClassification.js';

const router = express.Router();

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

const cropNameMap = {
    'අරතාපල්': 'potato',
    'මඤ්ඤොක්කා': 'cassava',
    'තක්කාලි': 'tomato',
    'සහල්': 'rice',
    'උක්': 'sugarcane',
  };
  
  router.post('/classifyDisease/:crop', upload.single('image'), async (req, res) => {
    try {
      const imageFilePath = req.file.path;
      const cropInSinhala = req.params.crop;
      
      // Map the Sinhala crop name to the corresponding English crop name
      const crop = cropNameMap[cropInSinhala];
      if (!crop) {
        throw new Error('Invalid crop type');
      }
  
      let bestResult;
      switch (crop.toLowerCase()) {
        case 'potato':
          bestResult = await classifyPotatoDisease(imageFilePath);
          break;
        case 'cassava':
          bestResult = await classifyCassavaDisease(imageFilePath);
          break;
        case 'tomato':
          bestResult = await classifyTomatoDisease(imageFilePath);
          break;
        case 'rice':
          bestResult = await classifyRiceDisease(imageFilePath);
          break;
        case 'sugarcane':
          bestResult = await classifySugarcaneDisease(imageFilePath);
          break;
        default:
          throw new Error('Invalid crop type');
      }
  
      // Clean up the uploaded file after processing
      fs.unlinkSync(imageFilePath);
  
      // Send the classification result back to the frontend
      res.json(bestResult);
    } catch (error) {
      console.error('Error classifying image:', error);
      res.status(500).send('Error classifying image');
    }
  });
  

export default router;
