// import mongoose so we can define a schema and interact with MongoDB
const mongoose = require("mongoose");

// define the structure (blueprint) of an Item in the database with validation rules
const itemSchema = new mongoose.Schema({
    // name of the item (e.g., "Milk")
    name: {
        type: String,
        // validation: require a non-empty string, trim whitespace, and limit length
        required: [true, "Item name is required"],
        trim: true,
        minlength: [1, "Item name cannot be empty"],
        maxlength: [25, "Item name must be 25 characters or less"]
    },

    // quantity of the item (number of units)
    quantity: {
        type: Number,
        // validation: require a number between 0 and 1000 (inclusive)
        required: [true, "Quantity is required"],
        min: [0, "Quantity cannot be negative"],
        max: [1000, "Quantity cannot exceed 1000"]
    }
});

// export the model so it can be used in routes (CRUD operations)
module.exports = mongoose.model("Item", itemSchema);