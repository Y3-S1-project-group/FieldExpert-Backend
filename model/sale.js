import mongoose from 'mongoose';

const { Schema } = mongoose;

const saleSchema = new Schema({
    cropType: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^[\u0000-\uFFFF]*$/.test(v);  // Allows all Unicode characters, including English and Sinhala
            },
            message: props => `${props.value} contains invalid characters!`
        }
    },
    quantity: {
        type: Number,
        required: true
    },

    onitemPrice: {
        type: Number,
        required: true,
        min: 0
    },
    
    saleDate: {
        type: Date,
        required: true
    },
    customerInfo: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^[\u0000-\uFFFF]*$/.test(v);  // Allows all Unicode characters
            },
            message: props => `${props.value} contains invalid characters!`
        }
    },
    distributionMethod: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^[\u0000-\uFFFF]*$/.test(v);  // Allows all Unicode characters
            },
            message: props => `${props.value} contains invalid characters!`
        }
    },
    additionalDetails: {
        type: String,
        default: '',
        validate: {
            validator: function(v) {
                return /^[\u0000-\uFFFF]*$/.test(v);  // Allows all Unicode characters
            },
            message: props => `${props.value} contains invalid characters!`
        }
    },
    totalPrice: {
        type: Number,
        required: true
    }
}, { timestamps: true });  // Adds createdAt and updatedAt fields

const Sale = mongoose.model('Sale', saleSchema);

export default Sale;
