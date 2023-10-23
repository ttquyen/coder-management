const mongoose = require("mongoose");
//Create schema
const userSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        flag: { type: Boolean, enum: [true, false], require: true },
    },
    {
        timestamps: true,
    }
);
//Create and export model
const User = mongoose.model("User", userSchema);
module.exports = User;
