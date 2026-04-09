const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    name: String,
    quanitity: Number
});

module.exports = mongoose.model("Item", itemSchema)