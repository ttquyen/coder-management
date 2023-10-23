const { sendResponse, AppError } = require("../helpers/utils.js");

const User = require("../models/User.js");

const userController = {};
//Create a user
userController.createUser = async (req, res, next) => {
    //in real project you will getting info from req
    const info = {
        name: "user",
        flag: false,
    };
    try {
        //always remember to control your inputs
        if (!info) throw new AppError(402, "Bad Request", "Create User Error");
        //mongoose query
        const created = await User.create(info);
        sendResponse(
            res,
            200,
            true,
            { data: created },
            null,
            "Create User Success"
        );
    } catch (err) {
        next(err);
    }
};
//Get all user
userController.getAllUsers = async (req, res, next) => {
    //in real project you will getting condition from from req then construct the filter object for query
    // empty filter mean get all
    const filter = {};
    try {
        //mongoose query
        const listOfFound = await User.find(filter);
        sendResponse(
            res,
            200,
            true,
            { data: listOfFound },
            null,
            "Found list of users success"
        );
    } catch (err) {
        next(err);
    }
};
//Update a user
userController.updateUserById = async (req, res, next) => {
    //in real project you will getting id from req. For updating and deleting, it is recommended for you to use unique identifier such as _id to avoid duplication
    //you will also get updateInfo from req
    // empty target and info mean update nothing
    const targetId = null;
    const updateInfo = "";

    //options allow you to modify query. e.g new true return lastest update of data
    const options = { new: true };
    try {
        //mongoose query
        const updated = await User.findByIdAndUpdate(
            targetId,
            updateInfo,
            options
        );

        sendResponse(
            res,
            200,
            true,
            { data: updated },
            null,
            "Update user success"
        );
    } catch (err) {
        next(err);
    }
};
//Delete user
//HARD DELETE
userController.deleteUserById = async (req, res, next) => {
    //in real project you will getting id from req. For updating and deleting, it is recommended for you to use unique identifier such as _id to avoid duplication

    // empty target mean delete nothing
    const targetId = null;
    //options allow you to modify query. e.g new true return lastest update of data
    const options = { new: true };
    try {
        //mongoose query
        const updated = await User.findByIdAndDelete(targetId, options);

        sendResponse(
            res,
            200,
            true,
            { data: updated },
            null,
            "Delete user success"
        );
    } catch (err) {
        next(err);
    }
};
//export
module.exports = userController;
