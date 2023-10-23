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
//Create
/**
 * @route POST api/user
 * @description create a user
 * @access public
 */
router.post("/", createUser);
//Update
/**
 * @route GET api/user
 * @description get a user by id
 * @access public
 */
router.get("/:id", getUserById);

//export
module.exports = router;
