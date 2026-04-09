const express = require("express");
const mongoose = require("mongoose");
const Item = require("./models/Items");
const app = express();

app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/myapp")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

app.get("/api/items", async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching items",
            error: error.message
        });
    }
    
});

app.post("/api/items", async (req, res) => {
    try {
        const newItem = await Item.create({
            name: req.body.name,
            quantity: req.body.quantity
        });

        res.json({
            message: "Item added!",
            item: newItem

        });

    } catch (error) {
        res.status(500).json({
            message: "Error adding item",
            error: error.message
        });
    }
});

app.get("/", (req, res) => {
    res.send("I DID IT");
});

app.get("/api/test", (req, res) => {
    res.json({message: "Backend is working!" });
});

app.get("/api/drew", (req, res) => {
    res.json({message: "Andrew Rocks!"});

});

app.get("/love", (req, res) => {
    res.send("Andrew Loves Vince!!!");
});

app.delete("/api/items/:id", async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);

        if (deletedItem) {
            res.json({ message: "Item Deleted", item: deletedItem });
        } else {
            res.status(404).json({ message: "Item not found"});

        }
    } catch (error) {
        res.status(500).json({
            message: "Error deleting item",
            error: error.message

        });
    }
        
        
    

});

app.put("/api/items/:id", async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                quantity: req.body.quantity
            },
            { new: true }
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
        res.status(500).json({
            message: "Error updating item",
            error: error.message
        });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");

    
});