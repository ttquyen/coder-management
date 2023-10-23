const { isValidObjectId } = require("mongoose");
const { sendResponse, AppError } = require("../helpers/utils.js");

const User = require("../models/User.js");
const Task = require("../models/Task.js");

const taskController = {};
//Create a task
taskController.createTask = async (req, res, next) => {
    const task = req.body;
    try {
        if (!task.title || !task.description)
            throw new AppError(400, "Bad request", "Missing title/description");
        const existedTask = await Task.findOne({ title: task.title });
        if (existedTask) {
            throw new AppError(400, "Bad request", "Task is existed");
        }
        const created = await Task.create(task);
        sendResponse(res, 200, true, created, null, "Create Task Success");
    } catch (error) {
        next(error);
    }
};

// Get all tasks
taskController.getTasks = async (req, res, next) => {
    //filter by Title, Status
    //Sort by CreatedAt, updatedAt
    let { limit, page, search, status, owner, ...filterQuery } = req.query;

    limit = parseInt(limit) || 10;
    page = parseInt(page) || 1;

    const filterKeys = Object.keys(filterQuery);
    console.log(filterKeys);
    try {
        if (filterKeys.length) {
            filterKeys.map((key) => {
                throw new AppError(
                    400,
                    "Bad Request",
                    `Query ${key} is not allowed`
                );
            });
        }

        let filter = { isDeleted: false };
        let searchRegex;
        if (search) {
            searchRegex = {
                $or: [
                    { description: { $regex: search, $options: "i" } },
                    { title: { $regex: search, $options: "i" } },
                    // { title: { $regex: `.*${search}.*` } },
                ],
            };
        }
        let tasks = [];
        if (owner && status && search) {
            filter = {
                ...filter,
                ...searchRegex,
                owner,
                status,
            };
        } else if (status && search) {
            filter = {
                ...filter,
                ...searchRegex,
                status,
            };
        } else if (search && owner) {
            filter = {
                ...filter,
                ...searchRegex,
                owner,
            };
        } else if (status && owner) {
            filter = { ...filter, status, owner };
        } else if (status) {
            filter = { ...filter, status };
        } else if (owner) {
            filter = { ...filter, owner };
        } else if (search) {
            filter = { ...filter, ...searchRegex };
        }
        //mongoose query
        console.log(filter);
        tasks = await Task.find(filter)
            .populate("owner")
            .sort({ createAt: -1, updatedAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        const total = await Task.find({ isDeleted: false }).count();

        sendResponse(
            res,
            200,
            true,
            { tasks, total },
            null,
            "Get Tasks Success"
        );
    } catch (err) {
        next(err);
    }
};

//export
module.exports = taskController;
