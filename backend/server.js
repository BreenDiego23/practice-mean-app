// import required libraries: Express for server, Mongoose for MongoDB, and Item model for database operations
const express = require("express");
const mongoose = require("mongoose");
const Item = require("./models/Items");

// create the Express application instance
const app = express();

// middleware to parse incoming JSON requests (makes req.body usable)
app.use(express.json());

// connect to local MongoDB database called "myapp"
mongoose.connect("mongodb://127.0.0.1:27017/myapp")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// GET all items from the database
app.get("/api/items", async (req, res) => {
    try {
        // fetch all items from MongoDB
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching items",
            error: error.message
        });
    }
    
});

// POST create a new item in the database
// POST create a new item in the database
app.post("/api/items", async (req, res) => {
    try {
        // validate that both required fields were sent in the request body
        if (req.body.name === undefined || req.body.quantity === undefined) {
            return res.status(400).json({
                message: "Name and quantity are required"
            });
        }

        // validate that the name is not empty after trimming spaces
        if (!req.body.name.trim()) {
            return res.status(400).json({
                message: "Item name cannot be empty"
            });
        }

        // validate that quantity is a number before sending it to Mongoose
        if (typeof req.body.quantity !== "number") {
            return res.status(400).json({
                message: "Quantity must be a number"
            });
        }

        // validate that quantity is not negative
        if (req.body.quantity < 0) {
            return res.status(400).json({
                message: "Quantity cannot be negative"
            });
        }

        // create and save a new item using data from the request body
        const newItem = await Item.create({
            name: req.body.name,
            quantity: req.body.quantity
        });

        res.json({
            message: "Item added!",
            item: newItem
        });

    } catch (error) {
        // return a client error for schema validation problems
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Validation failed",
                error: error.message
            });
        }

        res.status(500).json({
            message: "Error adding item",
            error: error.message
        });
    }
});

// root route for quick test in browser (returns simple text)
app.get("/", (req, res) => {
    res.send("I DID IT");
});

// test API route to confirm backend is working
app.get("/api/test", (req, res) => {
    res.json({message: "Backend is working!" });
});

// DELETE remove an item by its MongoDB _id
// DELETE remove an item by its MongoDB _id
app.delete("/api/items/:id", async (req, res) => {
    try {
        // validate that the id from the URL is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid item id" });
        }

        // find the item by id and delete it from the database
        const deletedItem = await Item.findByIdAndDelete(req.params.id);

        if (deletedItem) {
            res.json({ message: "Item deleted", item: deletedItem });
        } else {
            res.status(404).json({ message: "Item not found" });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error deleting item",
            error: error.message
        });
    }
});

// PUT update an existing item by its MongoDB _id
// PUT update an existing item by its MongoDB _id
app.put("/api/items/:id", async (req, res) => {
    try {
        // validate that the id from the URL is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid item id" });
        }

        // validate that at least one field was provided for the update
        if (req.body.name === undefined && req.body.quantity === undefined) {
            return res.status(400).json({
                message: "At least name or quantity is required to update"
            });
        }

        // validate name only if the client is trying to update it
        if (req.body.name !== undefined && !req.body.name.trim()) {
            return res.status(400).json({
                message: "Item name cannot be empty"
            });
        }

        // validate quantity only if the client is trying to update it
        if (req.body.quantity !== undefined && typeof req.body.quantity !== "number") {
            return res.status(400).json({
                message: "Quantity must be a number"
            });
        }

        // validate that updated quantity is not negative
        if (req.body.quantity !== undefined && req.body.quantity < 0) {
            return res.status(400).json({
                message: "Quantity cannot be negative"
            });
        }

        // build the update object dynamically so only provided fields are changed
        const updateFields = {};

        if (req.body.name !== undefined) {
            updateFields.name = req.body.name;
        }

        if (req.body.quantity !== undefined) {
            updateFields.quantity = req.body.quantity;
        }

        // find the item by id and update only the provided fields
        // new: true returns the updated document
        // runValidators: true applies schema validation rules during update
        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            updateFields,
            { new: true, runValidators: true }
        );

        if (updatedItem) {
            res.json({
                message: "Item updated",
                item: updatedItem
            });
        } else {
            res.status(404).json({ message: "Item not found" });
        }
    } catch (error) {
        // return a client error for schema validation problems
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Validation failed",
                error: error.message
            });
        }

        res.status(500).json({
            message: "Error updating item",
            error: error.message
        });
    }
});

// start the server and listen on port 3000
app.listen(3000, () => {
    console.log("Server running on port 3000");

    
});