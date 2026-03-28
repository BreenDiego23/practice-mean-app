const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/myapp")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));


const items = [
    { id: 1, name: "Paper Towels", quantity: 3 },
    { id: 2, name: "Bananas", quantity: 6 },
    { id: 3, name: "Chicken", quantity: 2 },
];

app.get("/api/items", (req, res) => {
    res.json(items);
});

app.post("/api/items", (req, res) => {
    const newItem = {
        id: items.length + 1,
        name: req.body.name,
        quantity: req.body.quantity
    };
    items.push(newItem);
    res.json({
        message: "Item added!",
        item: newItem
    });
})

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

app.delete("/api/items/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const index = items.findIndex(item => item.id === id);

    if (index !== -1) {
        const deletedItem = items.splice(index, 1);
        res.json({message: "Item deleted", item: deletedItem});
    }   else {
        res.status(404).json({message: "item not found lo siento"})
    }
    
    
});

app.put("/api/items/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const item = items.find(item => item.id === id);

    if (item) {
        item.name = req.body.name || item.name;
        item.quantity = req.body.quantity || item.quantity;

        res.json({
            message: "Item updated",
            item: item
        });
    } else {
        res.status(404).json({message: "item not foound"});
    }
    
}); 

app.listen(3000, () => {
    console.log("Server running on port 3000");

    
});