const sql = require("mysql2/promise");
const dotenv = require("dotenv");
const connectDB = require("../config/db");


dotenv.config();

class Tutor {
  constructor({ userID, tutorID, degrees, identityCard, workplace, description }) {
    this.userID = userID;
    this.tutorID = tutorID;
    this.degrees = degrees;
    this.identityCard = identityCard;
    this.workplace = workplace;
    this.description = description;
  }

  static async registerTutor(userId, tutorID) {
    const connection = await connectDB();
    const [result] = await connection.execute(
      `INSERT INTO TutorRequests (userID, tutorID, status) VALUES (?, ?, ?)`,
      [userId, tutorID, "Pending"]
    );
    return result;
  }

  static async createTutorID() {
    const connection = await connectDB();
    const [rows] = await connection.execute(
      `SELECT * FROM Tutors ORDER BY CAST(SUBSTRING(tutorID, 2) AS UNSIGNED) DESC`
    );
    if (!rows.length) return "T1";
    const id = rows[0].tutorID;
    const prefix = id.match(/[A-Za-z]+/)[0];
    const number = parseInt(id.match(/\d+/)[0]) + 1;
    return prefix + number;
  }

  static async createTutor(userID, tutorData) {
    const connection = await connectDB();
    const tutorID = await this.createTutorID();
    await connection.execute(
      `INSERT INTO Tutors (userID, tutorID, degrees, identityCard, workplace, description)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userID, tutorID, tutorData.degrees, tutorData.identityCard, tutorData.workplace, tutorData.description]
    );
    return new Tutor({ userID, tutorID, ...tutorData });
  }

  static async updateTutor(userID, tutorData) {
    const connection = await connectDB();
    await connection.execute(
      `UPDATE Tutors SET degrees = ?, identityCard = ?, workplace = ?, description = ? WHERE userID = ?`,
      [tutorData.degrees, tutorData.identityCard, tutorData.workplace, tutorData.description, userID]
    );
    return this.findTutorByTutorUserID(userID);
  }

  static async getTutor(userID) {
    const connection = await connectDB();
    const [[user]] = await connection.execute(`SELECT * FROM Users WHERE userID = ?`, [userID]);
    const [[tutor]] = await connection.execute(`SELECT * FROM Tutors WHERE userID = ?`, [userID]);
    return { ...user, ...tutor };
  }

  static async findClassroom(classroomID) {
    const connection = await connectDB();
    const [[result]] = await connection.execute(`SELECT * FROM Classes WHERE classID = ?`, [classroomID]);
    return result;
  }

  static async findClassByTutorID(tutorID) {
    const connection = await connectDB();
    const [rows] = await connection.execute(`SELECT * FROM Classes WHERE tutorID = ?`, [tutorID]);
    return rows;
  }

  static async findTutorByTutorID(tutorID) {
    const connection = await connectDB();
    const [rows] = await connection.execute(`SELECT * FROM Tutors WHERE tutorID = ?`, [tutorID]);
    return rows;
  }

  static async findTutorByTutorUserID(userID) {
    const connection = await connectDB();
    const [[result]] = await connection.execute(`SELECT * FROM Tutors WHERE userID = ?`, [userID]);
    return result;
  }

  static async createClassID() {
    const connection = await connectDB();
    const [rows] = await connection.execute(
      `SELECT * FROM Classes ORDER BY CAST(SUBSTRING(classID, 2) AS UNSIGNED) DESC`
    );
    if (!rows.length) return "C1";
    const id = rows[0].classID;
    const prefix = id.match(/[A-Za-z]+/)[0];
    const number = parseInt(id.match(/\d+/)[0]) + 1;
    return prefix + number;
  }

  static async createClass(classroom) {
    const connection = await connectDB();
    const classID = await this.createClassID();
    const [result] = await connection.execute(
      `INSERT INTO Classes (classID, subject, studentID, PaymentID, length, available, type, description, price, tutorID, className, videoLink)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [classID, classroom.subject, classroom.studentID, classroom.PaymentID, classroom.length,
       classroom.available, classroom.type, classroom.description, classroom.price,
       classroom.tutorID, classroom.className, classroom.videoLink]
    );
    return { classID, ...classroom };
  }

  static async updateClass(classroom, classID) {
    const connection = await connectDB();
    await connection.execute(
      `UPDATE Classes SET subject = ?, studentID = ?, PaymentID = ?, length = ?, available = ?, type = ?,
       description = ?, price = ?, tutorID = ?, className = ?, videoLink = ? WHERE classID = ?`,
      [classroom.subject, classroom.studentID, classroom.PaymentID, classroom.length, classroom.available,
       classroom.type, classroom.description, classroom.price, classroom.tutorID,
       classroom.className, classroom.videoLink, classID]
    );
    return this.findClassroom(classID);
  }

  static async deleteClass(classID) {
    const connection = await connectDB();
    await connection.execute(`UPDATE Classes SET isActive = 0 WHERE classID = ?`, [classID]);
    return this.findClassroom(classID);
  }

  static async activeClasses(classID) {
    const connection = await connectDB();
    await connection.execute(`UPDATE Classes SET isActive = 1 WHERE classID = ?`, [classID]);
    return this.findClassroom(classID);
  }

  static async findTutorByName(search = "") {
    const connection = await connectDB();
    const [rows] = await connection.execute(
      `SELECT Tutors.*, Users.fullName
       FROM Tutors
       JOIN Users ON Tutors.userID = Users.userID
       WHERE Users.fullName LIKE ? AND Users.isActive = 1`,
      ["%" + search + "%"]
    );
    return rows;
  }

  static async getRequest(tutorID) {
    const connection = await connectDB();
    const [rows] = await connection.execute(`SELECT * FROM Requests WHERE tutorID = ?`, [tutorID]);
    return rows;
  }

  static async getRequestByID(requestID) {
    const connection = await connectDB();
    const [[result]] = await connection.execute(`SELECT * FROM Requests WHERE requestID = ?`, [requestID]);
    return result;
  }

  static async deleteRequest(requestID) {
    const connection = await connectDB();
    const [result] = await connection.execute(`DELETE FROM Requests WHERE requestID = ?`, [requestID]);
    return result.affectedRows > 0;
  }

  static async updateTutorStatus(userID, status) {
    const connection = await connectDB();
    console.log("Updating tutor status:", userID, status);
    
    const [result] = await connection.execute(
      `UPDATE Tutors SET status = ? WHERE userID = ?`,
      [status, userID]
    );
    return result.affectedRows > 0;
  }

  static async checkTutorStatus(userID) {
    const connection = await connectDB();
    const [rows] = await connection.execute(
      `SELECT status FROM Tutors WHERE userID = ?`,
      [userID]
    );
    return rows[0]?.status;
  }

  static async deleteTutor(userID) {
    const connection = await connectDB();
    try {
      // Start a transaction
      await connection.beginTransaction();

      // Get tutorID first
      const [[tutor]] = await connection.execute(
        `SELECT tutorID FROM Tutors WHERE userID = ?`,
        [userID]
      );

      if (!tutor) {
        throw new Error('Tutor not found');
      }

      const tutorID = tutor.tutorID;

      // 1. Delete all feedbacks for tutor
      await connection.execute(
        `DELETE FROM Feedbacks WHERE tutorID = ?`,
        [tutorID]
      );

      // 2. Delete all messages related to tutor
      await connection.execute(
        `DELETE FROM Messages WHERE senderID = ? OR receiverID = ?`,
        [userID, userID]
      );

      // 3. Delete all classes of tutor
      await connection.execute(
        `DELETE FROM Classes WHERE tutorID = ?`,
        [tutorID]
      );

      // 4. Delete all requests to/from tutor
      await connection.execute(
        `DELETE FROM Requests WHERE tutorID = ?`,
        [tutorID]
      );

      // 5. Delete all tutor requests
      await connection.execute(
        `DELETE FROM TutorRequests WHERE tutorID = ?`,
        [tutorID]
      );

      // 6. Delete all complains from tutor
      await connection.execute(
        `DELETE FROM Complains WHERE uID = ?`,
        [userID]
      );

      // 7. Delete tutor record
      const [result] = await connection.execute(
        `DELETE FROM Tutors WHERE userID = ?`,
        [userID]
      );

      // 8. Delete user account
      await connection.execute(
        `DELETE FROM Users WHERE userID = ?`,
        [userID]
      );

      // Commit the transaction
      await connection.commit();

      return result.affectedRows > 0;
    } catch (error) {
      // Rollback the transaction in case of error
      await connection.rollback();
      throw error;
    }
  }
}

module.exports = Tutor;