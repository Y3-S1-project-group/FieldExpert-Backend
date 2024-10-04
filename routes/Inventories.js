import express from "express";
import Inventory from "../model/Inventory.js";

const router = express.Router();
// Create Inventory
router.route("/addInventory").post(async (req, res) => {
  const { 
    ItemID, 
    ItemName, 
    Category, 
    Quantity, 
    UnitOfMeasure, 
    SupplierName, 
    PurchaseDate, 
    ExpiryDate, 
    PricePerUnit, 
    Location, 
    BatchNumber, 
    Description 
  } = req.body;

  const newInventory = new Inventory({
    ItemID,
    ItemName,
    Category,
    Quantity,
    UnitOfMeasure,
    SupplierName,
    PurchaseDate,
    ExpiryDate,
    PricePerUnit,
    Location,
    BatchNumber,
    Description
  });

  newInventory
    .save()
    .then(() => {
      res.status(200).json(newInventory);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
});

// Get All Inventory Items
router.route("/getAllInventory").get(async (req, res) => {
  try {
    const inventoryItems = await Inventory.find();
    res.status(200).json(inventoryItems);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// Get Single Inventory Item by ItemId
router.route("/getInventory/:itemId").get(async (req, res) => {
  try {
    const inventoryItem = await Inventory.findOne({ ItemID: req.params.itemId });
    if (!inventoryItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }
    res.status(200).json(inventoryItem);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// Update Inventory Item
router.route("/updateInventory/:itemId").put(async (req, res) => {
  try {
    const updatedInventory = await Inventory.findOneAndUpdate(
      { ItemID: req.params.itemId },
      { $set: req.body },
      { new: true }
    );
    if (!updatedInventory) {
      return res.status(404).json({ message: "Inventory item not found" });
    }
    res.status(200).json(updatedInventory);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// Delete Inventory Item
router.route("/deleteInventory/:itemId").delete(async (req, res) => {
  try {
    const deletedInventory = await Inventory.findOneAndDelete({ ItemID: req.params.itemId });
    if (!deletedInventory) {
      return res.status(404).json({ message: "Inventory item not found" });
    }
    res.status(200).json({ message: "Inventory item deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// Search Inventory Items by ItemName or Category
router.route("/searchInventory").get(async (req, res) => {
  try {
    const search = req.query.search;
    const query = {
      $or: [
        { ItemName: { $regex: search, $options: "i" } },
        { Category: { $regex: search, $options: "i" } },
      ],
    };
    const inventoryItems = await Inventory.find(query);
    res.status(200).json(inventoryItems);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

    router.route("/calculateMonthlyPurchasesByCategory").get(async (req, res) => {
      try {
        const inventoryItems = await Inventory.find();
    
        // Initialize an object to store monthly purchases by category
        const monthlyPurchasesByCategory = {};
        const annualTotals = {}; // To store the total purchases by year
    
        // Loop through each inventory item
        inventoryItems.forEach((item) => {
          // Extract the month and year from the PurchaseDate
          const month = new Date(item.PurchaseDate).getMonth();
          const year = new Date(item.PurchaseDate).getFullYear();
          const monthYear = `${year}-${month + 1}`; // Format as "YYYY-MM"
    
          // Initialize the month-year key if not already present
          if (!monthlyPurchasesByCategory[monthYear]) {
            monthlyPurchasesByCategory[monthYear] = {};
          }
    
          // Initialize the category key within the month-year if not already present
          if (!monthlyPurchasesByCategory[monthYear][item.Category]) {
            monthlyPurchasesByCategory[monthYear][item.Category] = 0;
          }
    
          // Add the PricePerUnit * Quantity to the corresponding category's total
          monthlyPurchasesByCategory[monthYear][item.Category] +=
            item.PricePerUnit * item.Quantity;
    
          // Track the annual total for the year
          if (!annualTotals[year]) {
            annualTotals[year] = 0;
          }
          annualTotals[year] += item.PricePerUnit * item.Quantity;
        });
    
        // Convert monthlyPurchasesByCategory object into an array of objects
        const monthlyPurchasesArray = Object.entries(monthlyPurchasesByCategory).map(
          ([monthYear, categories]) => {
            // Extract the year from the monthYear string
            const year = monthYear.split("-")[0];
    
            // Calculate the total for the month across all categories
            const totalForMonth = Object.values(categories).reduce(
              (sum, categoryTotal) => sum + categoryTotal,
              0
            );
    
            // Convert categories object into an array of category totals
            const categoriesArray = Object.entries(categories).map(
              ([category, total]) => ({
                Category: category,
                Total: total,
              })
            );
    
            // Return the month-year, categories, total purchase for the month, and the annual total for the year
            return {
              MonthYear: monthYear,
              Categories: categoriesArray,
              TotalPurchase: totalForMonth, // Add total purchase for the month
              AnnualTotal: annualTotals[year], // Add annual total for the year
            };
          }
        );
    
        // Send the response with the calculated data
        res.json(monthlyPurchasesArray);
      } catch (error) {
        res.status(500).json({ error: "Error calculating monthly purchases" });
      }
    });

export default router;