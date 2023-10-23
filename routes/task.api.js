const express = require("express");
const router = express.Router();
const { getTasks, createTask } = require("../controllers/task.controllers.js");

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
 * @access public
 */
router.post("/", createTask);
//Update
/**
 * @route GET api/task
 * @description get a task by id
 * @access public
 */
// router.get("/:id", getUserById);

//export
module.exports = router;
