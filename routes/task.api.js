const express = require("express");
const router = express.Router();
const {
    getTasks,
    createTask,
    getTaskById,
    getTaskByUserId,
    updateTask,
    deleteTask,
} = require("../controllers/task.controllers.js");

//Read
/**
 * @route GET api/task
 * @description get list of tasks
 * @access public
 */
router.get("/", getTasks);
//Create
/**
 * @route POST api/task
 * @description create a task
 * @access private manager
 */
router.post("/", createTask);

/**
 * @route GET api/task
 * @description get a task by id
 * @access private assigner manager
 */
router.get("/:id", getTaskById);

/**
 * @route GET api/task/user/id
 * @description get a task by id
 * @access private assigner manager
 */
router.get("/user/:id", getTaskByUserId);

/**
 * @route PUT api/task
 * @description update a task by taskId
 * @access private assigner manager
 */
router.put("/:id", updateTask);
/**
 * @route DEL api/task
 * @description delete a task by taskId
 * @access private assigner manager
 */
router.delete("/:id", deleteTask);

//export
module.exports = router;
