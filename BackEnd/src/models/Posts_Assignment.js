const connectDB = require('../config/db');

const Posts_Assignment = {
    getAll: async (classID) => {
        const db = await connectDB();
        console.log('Class ID:', classID);

        let query = 'SELECT * FROM Posts_Assignment WHERE class_id = ?';
        const params = [classID];

        const [rows] = await db.execute(query, params);
        return rows;
    }
    ,
    create: async (post) => {
        const db = await connectDB();
        const now = new Date();
        const [result] = await db.execute(
            `INSERT INTO Posts_Assignment (tutorID, class_id, title, description)
        VALUES (?, ?, ?, ?)`,
            [post.tutorID, post.class_id, post.title, post.description]
        );
        return result.insertId;
    },

    // Other methods can be added here as needed
}

module.exports = Posts_Assignment;

