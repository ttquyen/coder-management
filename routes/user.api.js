const express = require("express");
const router = express.Router();
const {
    createUser,
    getAllUsers,
    updateUserById,
    deleteUserById,
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
 * @route PUT api/user
 * @description update a user
 * @access public
 */
router.put("/:id", updateUserById);
//Delete
/**
 * @route DELETE api/user
 * @description delet a user
 * @access public
 */
router.delete("/:id", deleteUserById);

//export
module.exports = router;
