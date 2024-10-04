import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema(
  {
    ItemID: {
      type: String,
      required: true,
      unique: true,
      trim: true, //Removes leading or trailing whitespace
    },
    ItemName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
      trim: true, //Removes leading or trailing spaces
    },
    Category: {
      type: String,
      required: true,
      enum: ["බීජ", "පොහොර", "මෙවලම්", "පළිබෝධනාශක", "වල් නාශක"], // Categories defined
    },
    Quantity: {
      type: Number,
      required: true,
      min: 0, // stock cannot be negative
    },
    UnitOfMeasure: {
      type: String,
      required: true,
      enum: ["කිලෝග්රෑම්", "ලීටර්", "ඒකක"], // Defines units
    },
    SupplierName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
      trim: true,
    },
    PurchaseDate: {
      type: Date,
      required: true,
      //default: Date.now, //sets the current date
    },
    ExpiryDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return value > this.PurchaseDate; // Expiry must be after purchase
        },
        message: "Expiry Date should be after Purchase Date",
      },
      required: true,
    },
    PricePerUnit: {
      type: Number,
      required: true,
      min: 0, // Price cannot be negative
    },
    Location: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    BatchNumber: {
      type: String,
      required: true,
      unique: true, //to track and trace
    },
    Description: {
      type: String,
      maxlength: 500, // Optional field for additional notes
      trim: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

export default mongoose.model("Inventory", InventorySchema);