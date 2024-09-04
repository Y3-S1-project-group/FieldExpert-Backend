// pestDetection.js
import axios from 'axios';
import fs from 'fs/promises';

const endpoint = "https://pestdetectorapp-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/6450a1f3-e357-447a-9fa3-342ed95edb1e/classify/iterations/Iteration2/image";
const predictionKey = "7d8f3b17455340fa9ecab2eb18b24ae9";

export async function detectPest(imagePath) {
    try {
        const image = await fs.readFile(imagePath);
        const response = await axios.post(endpoint, image, {
            headers: {
                'Prediction-Key': predictionKey,
                'Content-Type': 'application/octet-stream',
            },
        });

        // Clean up the uploaded file
        await fs.unlink(imagePath);

        return response.data.predictions;
    } catch (error) {
        throw new Error(`Pest detection failed: ${error.message}`);
    }
}
