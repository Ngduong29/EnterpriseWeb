const sql = require("mysql2/promise");
const connectDB = require("../config/db");

class Classroom {
  static async getFeedback(classID) {
    const connection = await connectDB();
    const [rows] = await connection.execute(`
      SELECT
        f.feedbackID,
        f.tutorID,
        f.classID,
        u.fullName AS studentName,
        u.avatar as studentAvatar,
        f.feedbackDate as date,
        f.message,
        f.rating
      FROM Feedbacks f
      JOIN Students s ON f.studentID = s.studentID
      JOIN Users u ON s.userID = u.userID
      WHERE f.classID = ?`, [classID]);
    return rows;
  }

  static async getAllClass() {
    const connection = await connectDB();
    const [rows] = await connection.execute(`
      SELECT 
        c.classID, c.className, c.videoLink, c.subject, c.tutorID,
        t.userID, u.fullName AS tutorFullName, c.studentID, c.paymentID,
        c.length, c.available, c.type, c.description, c.price,
        t.rating, c.isActive
      FROM Classes c
      JOIN Tutors t ON c.tutorID = t.tutorID
      JOIN Users u ON t.userID = u.userID
      WHERE c.isActive = 1;
    `);
    return rows;
  }

  static async getAllClassExisted() {
    const connection = await connectDB();
    const [rows] = await connection.execute(`
      SELECT 
        c.classID, c.className, c.videoLink, c.subject, c.tutorID,
        t.userID, u.fullName AS tutorFullName, c.studentID, c.paymentID,
        c.length, c.available, c.type, c.description, c.price,
        t.rating, c.isActive
      FROM Classes c
      JOIN Tutors t ON c.tutorID = t.tutorID
      JOIN Users u ON t.userID = u.userID;
    `);
    return rows;
  }

  static async getClassroom(classID) {
    const connection = await connectDB();
    const [rows] = await connection.execute(`
      SELECT 
        c.classID, c.className, c.videoLink, c.subject, c.tutorID,
        t.userID, u.fullName AS tutorFullName, c.studentID, c.paymentID,
        c.length, c.available, c.type, c.description, c.price,
        t.rating, c.isActive
      FROM Classes c
      JOIN Tutors t ON c.tutorID = t.tutorID
      JOIN Users u ON t.userID = u.userID
      WHERE c.classID = ?;
    `, [classID]);
    return rows[0];
  }

  static async findClassroomBySubject(subject) {
    const connection = await connectDB();
    const [rows] = await connection.execute(`
      SELECT 
        c.classID, c.className, c.videoLink, c.subject, c.tutorID,
        t.userID, u.fullName AS tutorFullName, c.studentID, c.paymentID,
        c.length, c.available, c.type, c.description, c.price,
        t.rating, c.isActive
      FROM Classes c
      JOIN Tutors t ON c.tutorID = t.tutorID
      JOIN Users u ON t.userID = u.userID
      WHERE c.subject LIKE ?;
    `, [`%${subject}%`]);
    return rows;
  }

  static async viewStudent(classID) {
    const connection = await connectDB();
    const [rows] = await connection.execute(`
      SELECT Students.studentID, fullName, Students.grade, Students.school
      FROM Users
      JOIN Students ON Users.userID = Students.userID
      WHERE Students.studentID = (
        SELECT studentID FROM Classes WHERE classID = ?
      );
    `, [classID]);
    return rows[0];
  }

  static async DeleteClass(classID) {
    const connection = await connectDB();
    const existing = await this.getClassroom(classID);
    const [result] = await connection.execute(
      `DELETE FROM Classes WHERE classID = ?`, [classID]);
    return result.affectedRows > 0 ? existing : null;
  }
}

module.exports = Classroom;
