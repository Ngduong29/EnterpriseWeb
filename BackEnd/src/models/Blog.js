const connectDB = require('../config/db');

const Blog = {
    findByStudentId: async (studentId, classID) => {
        const db = await connectDB();
        console.log(classID);

        const [rows] = await db.execute('SELECT title,status,created_at FROM Blogs WHERE student_id = ? AND class_id = ?', [studentId, classID]);
        return rows;
    },

    findById: async (id) => {
        const db = await connectDB();
        const [rows] = await db.execute('SELECT * FROM Blogs WHERE blog_id = ?', [id]);
        return rows[0];
    },

    create: async (blog) => {
        const db = await connectDB();
        const now = new Date();
        const [result] = await db.execute(
            `INSERT INTO Blogs (student_id, title, content, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [blog.student_id, blog.title, blog.content, blog.status, now, now]
        );
        return result.insertId;
    },

    update: async (id, blog) => {
        const db = await connectDB();
        await db.execute(
            `UPDATE Blogs SET title = ?, content = ? WHERE blog_id = ?`,
            [blog.title, blog.content, id]
        );
    },

    remove: async (id) => {
        const db = await connectDB();
        await db.execute('DELETE FROM Blogs WHERE blog_id = ?', [id]);
    }
};

module.exports = Blog;
