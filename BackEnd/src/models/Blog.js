const connectDB = require('../config/db');

const Blog = {
    findByStudentId: async (studentId, classID) => {
        const db = await connectDB();
        console.log('Student ID:', studentId, 'Class ID:', classID);

        let query = 'SELECT blog_id, title, status, created_at FROM Blogs WHERE student_id = ?';
        const params = [studentId];

        if (classID !== null) {
            query += ' AND class_id = ?';
            params.push(classID);
        }

        const [rows] = await db.execute(query, params);
        return rows;
    },

    findByClassId: async (classId) => {
        const db = await connectDB();
        const [rows] = await db.execute('SELECT * FROM Blogs WHERE class_id = ?', [classId]);
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
            `INSERT INTO Blogs (student_id, class_id, title, content, status)
       VALUES (?, ?, ?, ?, ?)`,
            [blog.student_id, blog.class_id, blog.title, blog.content, blog.status]
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
