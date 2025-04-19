const Blog = require('../models/Blog');


exports.getAll = async (req, res) => {
    try {

        // lấy tất cả bài viết của học sinh
        // nếu có class_id thì chỉ lấy bài viết của lớp đó
        const blogs = await Blog.findByClassId(req.query.class_id || null);
        return res.json({ message: "List Blogs", data: blogs });

    } catch (error) {
        console.error('Error in getAll:', error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
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

    res.json({ message: "Chi tiết bài viết", data: blog });
};

exports.create = async (req, res) => {
    const { title, content, status, class_id } = req.body;
    const blog_id = await Blog.create({
        student_id: req.user.userID,
        class_id,
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