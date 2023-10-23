const express = require("express");
const router = express.Router();
const {
    createUser,
    getAllUsers,
    getUserById,
} = require("../controllers/user.controllers.js");

//Read
/**
 * @route GET api/user
 * @description get list of users
 * @access public
 */
router.get("/", getAllUsers);

/**
 * @route GET api/user
 * @description get a user by id
 * @access private manager
 */
router.get("/:id", getUserById);

//Create
/**
 * @route POST api/user
 * @description create a user
 * @access private manager
 */
router.post("/", createUser);

//export
module.exports = router;
