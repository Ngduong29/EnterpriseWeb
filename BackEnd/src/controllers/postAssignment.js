const Posts_Assignment = require("../models/Posts_Assignment");
const User = require("../models/User");

exports.getAllPostsAssignment = async (req, res) => {
    try {
        // const studentId  = req.user.userID;
        const { class_id } = req.body;
        const posts = await Posts_Assignment.getAll(class_id);
        return res.status(200).json({ message: "List Posts", data: posts });
    } catch (error) {
        console.error("Error in getAll:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}
// Tạo bài đăng + upload file
exports.createPostsAssignment = async (req, res) => {
    const { title, description, class_id } = req.body;
    const file = req.file; // Assuming you're using multer for file uploads
    const user_id = req.user.userID; // Get the tutor ID from the request
    const tutor_id = User.findUserByID(user_id).then((user) => user.tutorID); // Function to get tutor ID from class ID

    if (!title || !description) {
        return res.status(400).json({ message: "All fields are required" });
    }


    // Handle file upload logic here
    // For example, save the file to a specific directory and store the path in the database

    const post_id = await Posts_Assignment.create({
        tutorID: tutor_id,
        class_id,
        title,
        description
    });

    res.status(201).json({ message: "Tạo bài viết mới thành công", data: { post_id } });
};


