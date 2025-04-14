const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sql = require("mysql2/promise");
const dotenv = require("dotenv");
const connectDB = require("../config/db");

dotenv.config();

class Student {
  constructor({ userID, studentID, grade, school }) {
    this.userID = userID;
    this.studentID = studentID;
    this.grade = grade;
    this.school = school;
  }

  static async createStudentID() {
    const connection = await connectDB();
    const [rows] = await connection.execute(
      `SELECT * FROM Students ORDER BY CAST(SUBSTRING(studentID, 2) AS UNSIGNED) DESC`
    );
    if (!rows[0]) {
      return "S1";
    } else {
      let lastID = rows[0].studentID.toString(); // Ensure lastID is a string  
      const alphabet = lastID.match(/[A-Za-z]+/)[0];
      const number = parseInt(lastID.match(/\d+/)[0]) + 1;
      return alphabet + number;
    }
  }

  static async createStudent(userId, studentData) {
    const connection = await connectDB();
    try {
      await connection.beginTransaction();
      
      // Verify that the user exists
      const [userRows] = await connection.execute(
        "SELECT * FROM Users WHERE userID = ?",
        [userId]
      );
      
      if (!userRows[0]) {
        throw new Error("User not found");
      }
      
      const studentID = await this.createStudentID();
      
      await connection.execute(
        `INSERT INTO Students (userID, studentID, grade, school) VALUES (?, ?, ?, ?)`,
        [userId, studentID, studentData.grade, studentData.school]
      );
      
      // Verify the student was created
      const [studentRows] = await connection.execute(
        "SELECT * FROM Students WHERE userID = ?",
        [userId]
      );
      
      if (!studentRows[0]) {
        throw new Error("Failed to create student record");
      }
      
      await connection.commit();
      return new Student({ userID: userId, studentID, ...studentData });
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  }

  static async updateStudent(userID, studentData) {
    const connection = await connectDB();
    const [rows] = await connection.execute(
      `UPDATE Students SET grade = ?, school = ? WHERE userID = ?`,
      [studentData.grade, studentData.school, userID]
    );
    return rows.affectedRows > 0 ? await this.findStudentByUserID(userID) : null;
  }

  static async sendRequestToTutor(tutorID, studentID, message) {
    const connection = await connectDB();
    const [rows] = await connection.execute(
      `INSERT INTO Requests (tutorID, studentID, message) VALUES (?, ?, ?)`,
      [tutorID, studentID, message]
    );
    return { tutorID, studentID, message };
  }

  static async getRequest(studentID) {
    const connection = await connectDB();
    const [rows] = await connection.execute(
      `SELECT * FROM Requests WHERE studentID = ?`,
      [studentID]
    );
    return rows;
  }

  static async findStudentByID(studentID) {
    const connection = await connectDB();
    const [rows] = await connection.execute(
      `SELECT * FROM Students WHERE studentID = ?`,
      [studentID]
    );
    return rows[0];
  }

  static async findStudentByUserID(userID) {
    const connection = await connectDB();
    const [rows] = await connection.execute(
      `SELECT * FROM Students WHERE userID = ?`,
      [userID]
    );
    return rows[0];
  }

  static async findClassByTutorName(search) {
    const connection = await connectDB();
    const [rows] = await connection.execute(
      `SELECT * FROM Classes WHERE tutorID IN (
         SELECT tutorID FROM Tutors WHERE userID IN (
           SELECT userID FROM Users WHERE fullName LIKE ?
         )
       )`,
      ["%" + search + "%"]
    );
    return rows;
  }

  static async findClassByName(name) {
    const connection = await connectDB();
    const [rows] = await connection.execute(
      `SELECT * FROM Classes WHERE className LIKE ?`,
      ["%" + name + "%"]
    );
    return rows;
  }

  static async findClassByID(classID) {
    const connection = await connectDB();
    const [rows] = await connection.execute(
      `SELECT * FROM Classes WHERE classID = ?`,
      [classID]
    );
    return rows[0];
  }

  static async enrollClasses(classID, studentID) {
    const connection = await connectDB();
    await connection.execute(
      `UPDATE Classes SET studentID = ? WHERE classID = ?`,
      [studentID, classID]
    );
    return await this.findClassByID(classID);
  }

  static async unEnrollClasses(classID) {
    const connection = await connectDB();
    await connection.execute(
      `UPDATE Classes SET studentID = NULL WHERE classID = ?`,
      [classID]
    );
    return await this.findClassByID(classID);
  }

  static async sendFeedback(classroom, message, rating, date) {
    const connection = await connectDB();
    await connection.execute(
      `INSERT INTO Feedbacks (tutorID, studentID, classID, message, rating, feedbackDate) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        classroom.tutorID,
        classroom.studentID,
        classroom.classID,
        message,
        rating,
        date,
      ]
    );
    const [avgRows] = await connection.execute(
      `SELECT ROUND(AVG(rating), 1) AS avg_rating FROM Feedbacks WHERE tutorID = ?`,
      [classroom.tutorID]
    );
    const avgRating = avgRows[0]?.avg_rating?.toString() || "0.0";
    await connection.execute(
      `UPDATE Tutors SET rating = ? WHERE tutorID = ?`,
      [avgRating, classroom.tutorID]
    );
    return { classroom, message, rating, date };
  }

  // Delete a student and all associated data
  static async deleteStudent(userID) {
    const connection = await connectDB();
    try {
      await connection.beginTransaction();

      const [[student]] = await connection.execute(
        `SELECT studentID FROM Students WHERE userID = ?`,
        [userID]
      );

      if (!student) {
        throw new Error('Student not found');
      }

      const studentID = student.studentID;

      // Delete blogs first
      await connection.execute(
        `DELETE FROM Blogs WHERE student_id = ?`,
        [userID]
      );

      // Delete feedbacks
      await connection.execute(
        `DELETE FROM Feedbacks WHERE studentID = ?`,
        [studentID]
      );

      // Delete messages
      await connection.execute(
        `DELETE FROM Messages WHERE senderID = ? OR receiverID = ?`,
        [userID, userID]
      );

      // Unenroll from classes
      await connection.execute(
        `UPDATE Classes SET studentID = NULL WHERE studentID = ?`,
        [studentID]
      );

      // Delete requests
      await connection.execute(
        `DELETE FROM Requests WHERE studentID = ?`,
        [studentID]
      );

      // Delete complains
      await connection.execute(
        `DELETE FROM Complains WHERE uID = ?`,
        [userID]
      );

      // Delete student record
      const [result] = await connection.execute(
        `DELETE FROM Students WHERE userID = ?`,
        [userID]
      );

      // Delete user record
      await connection.execute(
        `DELETE FROM Users WHERE userID = ?`,
        [userID]
      );
      
      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  }
}

module.exports = Student;