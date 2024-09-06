import mongoose from 'mongoose';

const { Schema } = mongoose;

const saleSchema = new Schema({
    cropType: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    saleDate: {
        type: Date,
        required: true
    },
    customerInfo: {
        name: {
            type: String,
            required: true
        },
        contact: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        }
    },
    distributionMethod: {
        type: String,
        required: true
    },
    additionalDetails: {
        type: String,
        default: ''
    }
}, { timestamps: true });  // Adds createdAt and updatedAt fields

const Sale = mongoose.model('Sale', saleSchema);

export default Sale;
