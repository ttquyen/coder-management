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
    let {
        limit,
        page,
        search,
        status,
        owner,
        createdAt,
        updatedAt,
        ...filterQuery
    } = req.query;

    limit = parseInt(limit) || 10;
    page = parseInt(page) || 1;

    const filterKeys = Object.keys(filterQuery);
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
        tasks = await Task.find(filter)
            .populate("owner")
            .sort({ createdAt, updatedAt })
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
// Get task by id
taskController.getTaskById = async (req, res, next) => {
    const { id } = req.params;

    try {
        if (!id) throw new AppError(402, "Bad request", "Cannot find task");
        if (!isValidObjectId(id))
            throw new AppError(400, "Bad request", "Invalid Task Id");
        // Find task by id
        const found = await Task.find({ _id: id, isDeleted: false });
        if (!found || found.length === 0) {
            throw new AppError(400, "Bad request", " Not Found Task");
        }

        return sendResponse(
            res,
            200,
            true,
            found,
            null,
            "Get task successfully"
        );
    } catch (error) {
        next(error);
    }
};

taskController.getTaskByUserId = async (req, res, next) => {
    const { id: userId } = req.params;
    try {
        if (!userId)
            throw new AppError(402, "Bad request", "Cannot find User Id");
        if (!isValidObjectId(userId))
            throw new AppError(400, "Bad request", "Invalid User Id");
        // Find task by id
        const found = await Task.find({ owner: userId, isDeleted: false });
        return sendResponse(
            res,
            200,
            true,
            found,
            null,
            found ? "Get task successfully" : "No task found"
        );
    } catch (error) {
        next(error);
    }
};

//Update task
taskController.updateTask = async (req, res, next) => {
    const { id } = req.params;
    let { status, owner } = req.body;
    const allowUpdate = ["pending", "working", "review", "done", "archive"];
    try {
        if (!id) throw new AppError(402, "Bad request", "Cannot access task");
        //check invalid mongo object id
        if (!isValidObjectId(id))
            throw new AppError(400, "Bad request", "Invalid Task Id");
        if (owner && !isValidObjectId(owner))
            throw new AppError(400, "Bad request", "Invalid Owner Id");

        //missing body
        if (!status && !owner)
            throw new AppError(400, "Bad request", "Missing status and owner");

        //check allowance status
        const currentStatus = allowUpdate.find((e) => e === status);
        if (status && !currentStatus) {
            throw new AppError(403, "Status is not allow", "Bad request");
        }
        let taskArr = await Task.find({ _id: id, isDeleted: false });

        if (!taskArr || taskArr.length === 0) {
            throw new AppError(400, "Bad Request", "Task Not Found");
        }
        let task = taskArr[0];
        if (owner) {
            let user = await User.findById(owner);
            if (!user) {
                throw new AppError(400, "Bad Request", "Owner Not Found");
            }
        }

        //Update Task Status
        //status is set done, it can’t be changed to other value except archive
        if (status && task.status === "done" && currentStatus !== "archive") {
            throw new AppError(
                400,
                "Bad request",
                "Done task can be changed to archive status only"
            );
        }
        let updated;
        if (owner && !status) {
            if (
                task.owner.length === 1 &&
                task.owner[0]?._id.toString() === owner
            ) {
                //this task is assigned to this employee => unassign
                owner = [];
            }
            updated = await Task.findOneAndUpdate(
                { _id: id },
                { owner },
                { new: true }
            );
        } else if (status && !owner) {
            updated = await Task.findOneAndUpdate(
                { _id: id },
                { status },
                { new: true }
            );
        } else {
            if (
                task.owner.length === 1 &&
                task.owner[0]?._id.toString() === owner
            ) {
                //this task is assigned to this employee => unassign
                owner = [];
            }
            updated = await Task.findOneAndUpdate(
                { _id: id },
                { status, owner },
                { new: true }
            );
        }

        return sendResponse(
            res,
            200,
            true,
            updated,
            null,
            "Update task successfully"
        );
    } catch (err) {
        next(err);
    }
};

// Delete tasks
taskController.deleteTask = async (req, res, next) => {
    const { id } = req.params;
    try {
        if (!isValidObjectId(id))
            throw new AppError(400, "Bad request", "Invalid Task Id");
        const deleteTask = await Task.findOneAndUpdate(
            { _id: id },
            { isDeleted: true },
            { new: true }
        );

        if (!deleteTask) {
            throw new AppError(400, "Bad request", "Task is not found");
        }
        sendResponse(
            res,
            200,
            true,
            deleteTask,
            null,
            "Delete task successfully"
        );
    } catch (error) {
        next(error);
    }
};
//export
module.exports = taskController;
