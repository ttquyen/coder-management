const { isValidObjectId } = require("mongoose");
const { sendResponse, AppError } = require("../helpers/utils.js");

const User = require("../models/User.js");
const Task = require("../models/Task.js");

const userController = {};
//Create a user
userController.createUser = async (req, res, next) => {
    const info = req.body;
    try {
        if (!info.name)
            throw new AppError(406, "Bad request", "Field name is required");

        const haveEmployee = await User.findOne({ name: info.name });
        if (haveEmployee) {
            throw new AppError(400, "Bad request", "Employee is existed");
        }

        const created = await User.create(info);
        sendResponse(res, 200, true, created, null, "Create user Success");
    } catch (error) {
        next(error);
    }
};
//Get all user
userController.getAllUsers = async (req, res, next) => {
    let { limit, page, ...filterQuery } = req.query;

    limit = parseInt(limit) || 10;
    page = parseInt(page) || 1;

    const filterKeys = Object.keys(filterQuery);
    console.log(filterKeys);

    try {
        if (filterKeys.length) {
            filterKeys.map((key) => {
                if (!filterQuery[key]) {
                    delete filterQuery[key];
                    throw new AppError(
                        400,
                        "Bad Request",
                        `Query ${filterKeys.map((e) => e)} is not allowed`
                    );
                }
            });
        }

        //mongoose query
        const users = await User.find(filterQuery)
            .sort({ createAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        // const total = await User.find({ isDeleted: false }).count();
        // const data = { users, total };

        sendResponse(res, 200, true, users, null, "Get Users Success");
    } catch (err) {
        next(err);
    }
};
//Get user by Id
// userController.getUserById = async (req, res, next) => {
//     const { id } = req.params;

//     try {
//         // validate inputs

//         if (!ObjectId.isValid(id)) {
//             throw new AppError(400, "Bad request", "Invalid user id");
//         }

//         const userId = await User.findById(id);

//         if (!userId) {
//             throw new AppError(400, "Bad request", " Not Found Employee");
//         }
//         console.log(userId);
//         const getTask = await Task.find({ owner: id });
//         if (!getTask && getTask.length === 0) {
//             return sendResponse(
//                 res,
//                 200,
//                 true,
//                 userId,
//                 null,
//                 " Get list tasks success"
//             );
//         }
//         return sendResponse(
//             res,
//             200,
//             true,
//             { ...userId._doc, task: getTask },
//             null,
//             " Get list tasks success"
//         );
//     } catch (err) {
//         next(err);
//     }
// };

userController.getUserById = async (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    try {
        //validate input
        if (!isValidObjectId(id)) {
            throw new AppError(400, "Bad Request", "Invalid User Id");
        }
        const user = await User.findById(id);
        if (!user) {
            throw new AppError(400, "Bad Request", "Employee Not Found");
        }
        const tasks = await Task.find({ owner: id });
        console.log(tasks);
        return sendResponse(
            res,
            200,
            true,
            tasks,
            null,
            "Get task list success"
        );
    } catch (err) {
        next(err);
    }
};

//export
module.exports = userController;
