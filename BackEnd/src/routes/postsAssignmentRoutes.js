
const express = require("express");
const router = express.Router();

const postsAssignment = require("../controllers/postAssignment");
const authorize = require("../middleware/auth");


router.use(authorize("Student", "Tutor"));

router.get("/getAll", postsAssignment.getAllPostsAssignment);
router.post('/create', postsAssignment.createPostsAssignment);


module.exports = router; 