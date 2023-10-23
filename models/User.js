const mongoose = require("mongoose");
//Create schema
const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        role: {
            type: String,
            default: "employee",
            enum: ["manager", "employee"],
            required: true,
        },

        isDeleted: { type: Boolean, default: false, required: true },
    },
    { timestamps: true }
);
//Create and export model
const User = mongoose.model("User", userSchema);
module.exports = User;
