const sql = require("mysql2/promise");
const connectDB = require("../config/db");

class Classroom {
  // Get all feedbacks for a specific class including student information
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
 
  // Get all active classes with tutor information
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

  // Get all classes including inactive ones with tutor information
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

  // Get detailed information of a specific class by classID
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

  // Search for classes by subject name
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

  // Get student information enrolled in a specific class
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

  // Delete a class by classID and return the deleted class information
  static async DeleteClass(classID) {
    const connection = await connectDB();
    const existing = await this.getClassroom(classID);
    
    // Start a transaction
    await connection.beginTransaction();
    
    try {
      // First delete related feedbacks
      await connection.execute(
        `DELETE FROM Feedbacks WHERE classID = ?`,
        [classID]
      );

      // Then delete related blog entries
      await connection.execute(
        `DELETE FROM Blogs WHERE class_id = ?`,
        [classID]
      );
      
      // Finally delete the class
      const [result] = await connection.execute(
        `DELETE FROM Classes WHERE classID = ?`,
        [classID]
      );
      
      // Commit the transaction
      await connection.commit();
      
      return result.affectedRows > 0 ? existing : null;
    } catch (error) {
      // If anything fails, rollback the transaction
      await connection.rollback();
      throw error;
    }
  }

  // Create a new class and validate tutor status
  static async CreateClass(classroom) {
    const connection = await connectDB();

    // Check tutor status first
    const [tutorStatus] = await connection.execute(
      `SELECT status FROM Tutors WHERE userID = ?`,
      [classroom.tutorID]
    );

    if (!tutorStatus[0] || tutorStatus[0].status !== 'Approved') {
      throw new Error('Tutor account is not approved for creating classes');
    }

    const [result] = await connection.execute(
      `INSERT INTO Classes (className, tutorID, subject, grade, description, maxStudent, price, schedule) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        classroom.className,
        classroom.tutorID,
        classroom.subject,
        classroom.grade,
        classroom.description,
        classroom.maxStudent,
        classroom.price,
        classroom.schedule,
      ]
    );
    return { classID: result.insertId, ...classroom };
  }

  static async GetClassByStudentId(studentID) {

    const connection = await connectDB();

    if (!studentID) {
      throw new Error('Student ID is required');
    }

    try {
      const [classes] = await connection.execute(
        `
        SELECT c.*
        FROM Classes c
        WHERE studentID = ?
        `,
        [studentID]
      );
      return classes[0];
    } catch (error) {
      throw new Error(`Failed to retrieve classes: ${error.message}`);
    }
  }

  static async GetClassByTutor(tutorID) {

    const connection = await connectDB();

    if (!studentID) {
      throw new Error('Student ID is required');
    }

    try {
      const [classes] = await connection.execute(
        `
        SELECT c.*
        FROM Classes c
        WHERE tutorID = ?
        `,
        [tutorID]
      );
      return classes[0];
    } catch (error) {
      throw new Error(`Failed to retrieve classes: ${error.message}`);
    }
  }
}

module.exports = Classroom;