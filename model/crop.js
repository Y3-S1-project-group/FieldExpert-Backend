import mongoose from "mongoose";//importing mongoose

//creating a schema for crop
const Schema = mongoose.Schema; //creating a schema
const cropSchema = new Schema({
        cropName: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        area: {
            type: Number,
            required: true,
        },
        plantingDate: {
            type: Date,
            required: true,
        },
        
        harvestDate: {
            type: Date,
            required: true,
        },

    
    }, { timestamps: true }); //timestamps are used to store the time when the data is created or updated   


//exporting the model
     export default mongoose.model('Crop', cropSchema); //exporting the model

