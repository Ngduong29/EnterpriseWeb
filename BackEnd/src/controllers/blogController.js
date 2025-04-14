const Blog = require('../models/Blog');


exports.getAll = async (req, res) => {
    if (req.user.role === "Tutor") {
        return res.json({ message: "Tutor" });
    }
    if (req.user.role === "Student") {
        const blogs = await Blog.findByStudentId(req.user.userID , req.user.classID);
        return res.json({ message: "Danh sách bài viết", data: blogs });
    }
};

exports.getOne = async (req, res) => {
    if (req.user.role === 'Tutor') {
        // chỉ đc xem bài viết của học sinh của mình
        return res.status(404).json({ message: "Tutor" });

    }
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        return res.status(404).json({ message: "Không tìm thấy" });
    }

    if (req.user.role === 'Student' && blog.student_id !== req.user.userID) {
        return res.status(403).json({ message: "Không có quyền này" });
    }



    res.json({ message: "Chi tiết bài viết", data: blog });
};

exports.create = async (req, res) => {
    const { title, content, status } = req.body;
    const blog_id = await Blog.create({
        student_id: req.user.userID,
        title,
        content,
        status,
    });
    res.status(201).json({ message: "Tạo bài viết mới thành công", data: { blog_id } });
};

exports.update = async (req, res) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        return res.status(404).json({ message: "Không tìm thấy" });
    }
    if (blog.student_id !== req.user.userID) {
        return res.status(403).json({ message: "Bạn không có quyền này" });
    }
    console.log(req.body);

    await Blog.update(req.params.id, req.body);
    res.json({ message: "Cập nhật bài viết thành công" });
};

exports.remove = async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
        return res.status(404).json({ message: "Không tìm thấy" });
    }
    if (blog.student_id !== req.user.userID) {
        return res.status(403).json({ message: "Bạn không có quyền này" });
    }
    await Blog.remove(req.params.id);
    res.json({ message: "Xoá bài viết thành công" });
};