const mongoose = require("mongoose");
//Create schema
const taskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        status: {
            type: String,
            enum: ["pending", "working", "review", "done", "archive"],
            default: "pending",
            required: true,
        },
        owner: { type: [mongoose.SchemaTypes.ObjectId], ref: "User" },
        isDeleted: { type: Boolean, default: false, required: true },
    },
    { timetamps: true }
);
//Create and export model
const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
