const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sql = require("mysql2/promise");
const dotenv = require("dotenv");
const connectDB = require("../config/db");

dotenv.config();

const formatDate = (date) => {
  return new Date(date).toISOString().split("T")[0]; // => 'YYYY-MM-DD'
};

class User {
  constructor({
    userID,
    userName,
    fullName,
    email,
    password,
    avatar,
    dateOfBirth,
    role,
    phone,
    address,
    isActive,
  }) {
    this.userID = userID;
    this.userName = userName;
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.avatar = avatar;
    this.dateOfBirth = formatDate(dateOfBirth);
    this.role = role;
    this.phone = phone;
    this.address = address;
    this.isActive = isActive;
  }

  static async getModerator() {
    const connection = await connectDB();
    const [rows] = await connection.execute(
      "SELECT * FROM Users WHERE role = ?",
      ["Moderator"]
    );
    return rows;
  }

  static async getAllUser() {
    const connection = await connectDB();
    const [rows] = await connection.execute(
      `SELECT U.userID, U.userName, U.fullName, U.email, U.avatar, U.dateOfBirth, U.role, U.phone, U.address, U.isActive, S.studentID, T.tutorID
       FROM Users U
       LEFT JOIN Students S ON U.userID = S.userID AND U.role = 'Student'
       LEFT JOIN Tutors T ON U.userID = T.userID AND U.role = 'Tutor'`
    );
    return rows;
  }

  static async getActiveUser() {
    const connection = await connectDB();
    const [rows] = await connection.execute(
      `SELECT userID, userName, fullName, email, avatar, dateOfBirth, role, phone, address, isActive FROM Users WHERE isActive = 1`
    );
    return rows;
  }

  static async getUsers(userID) {
    const connection = await connectDB();
    const [rows] = await connection.execute(
      "SELECT * FROM Users WHERE userID = ?",
      [userID]
    );
    return rows[0];
  }

  static async findByEmail(email) {
    const connection = await connectDB();
    const [rows] = await connection.execute(
      "SELECT * FROM Users WHERE email = ?",
      [email]
    );
    return rows[0];
  }

  static async findUserByID(userID) {
    const connection = await connectDB();
    const [rows] = await connection.execute("SELECT * FROM Users WHERE userID = ?", [userID]);
    console.log("Found user:", rows[0]); // Debug log
    return rows[0];
  }

  static async create(user) {
    const connection = await connectDB();
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const [result] = await connection.execute(
      `INSERT INTO Users (userName, fullName, email, password, avatar, dateOfBirth, role, phone, address, isActive)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.userName,
        user.fullName,
        user.email,
        hashedPassword,
        user.avatar,
        formatDate(user.dateOfBirth),
        user.role,
        user.phone,
        user.address,
        user.isActive,
      ]
    );
    return { ...user, password: hashedPassword, userID: result.insertId };
  }

  static async updateUserForAdmin(user, userID) {
    const connection = await connectDB();
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const [result] = await connection.execute(
      `UPDATE Users SET userName = ?, fullName = ?, email = ?, password = ?, avatar = ?, dateOfBirth = ?, phone = ?, address = ?, isActive = ? WHERE userID = ?`,
      [
        user.userName,
        user.fullName,
        user.email,
        hashedPassword,
        user.avatar,
        formatDate(user.dateOfBirth),
        user.phone,
        user.address,
        user.isActive,
        userID,
      ]
    );
    return result.affectedRows > 0 ? await this.findByEmail(user.email) : null;
  }

  static async updateUser(user, userID) {
    const connection = await connectDB();
    await connection.execute(
      `UPDATE Users SET userName = ?, fullName = ?, email = ?, avatar = ?, dateOfBirth = ?, phone = ?, address = ? WHERE userID = ?`,
      [
        user.userName,
        user.fullName,
        user.email,
        user.avatar,
        formatDate(user.dateOfBirth),
        user.phone,
        user.address,
        userID,
      ]
    );
    return await this.findUserByID(userID);
  }

  static async banUser(userID) {
    const connection = await connectDB();
    const [result] = await connection.execute(
      `UPDATE Users SET isActive = 0 WHERE userID = ?`,
      [userID]
    );
    return result.affectedRows > 0 ? await this.findUserByID(userID) : null;
  }

  static async unbanUser(userID) {
    const connection = await connectDB();
    const [result] = await connection.execute(
      `UPDATE Users SET isActive = 1 WHERE userID = ?`,
      [userID]
    );
    return result.affectedRows > 0 ? await this.findUserByID(userID) : null;
  }

  static async searchRequest(userID) {
    const connection = await connectDB();
    const [rows] = await connection.execute(
      `SELECT * FROM TutorRequests WHERE userID = ?`,
      [userID]
    );
    return rows[0];
  }

  static async getRequest() {
    const connection = await connectDB();
    const [rows] = await connection.execute(`SELECT * FROM TutorRequests`);
    return rows;
  }

  static async updateRequestStatus(userID, status) {
    const connection = await connectDB();
    console.log(userID, status); 
    const [result] = await connection.execute(
      `UPDATE TutorRequests SET status = ? WHERE userID = ?`,
      [status, userID]
    );
    return result.affectedRows > 0;
  }

  static generateAuthToken(user) {
    return jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  }

  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  static async sendComplain(userID, message) {
    const connection = await connectDB();
    const [result] = await connection.execute(
      `INSERT INTO Complains (uID, message) VALUES (?, ?)`,
      [userID, message]
    );
    return { complainID: result.insertId, uID: userID, message };
  }

  static async getComplain() {
    const connection = await connectDB();
    const [rows] = await connection.execute(`SELECT * FROM Complains`);
    return rows;
  }

  static async deleteComplain(complainID) {
    const connection = await connectDB();
    const [result] = await connection.execute(
      `DELETE FROM Complains WHERE complainID = ?`,
      [complainID]
    );
    return result.affectedRows > 0;
  }

  static async updateUserPasswordByEmail(email, newPassword) {
    const connection = await connectDB();
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const [result] = await connection.execute(
      `UPDATE Users SET password = ? WHERE email = ?`,
      [hashedPassword, email]
    );
    return result.affectedRows > 0;
  }

  static async updatePassword(userID, hashedPassword) {
    const connection = await connectDB();
    await connection.execute(
      `UPDATE Users SET password = ? WHERE userID = ?`,
      [hashedPassword, userID]
    );
  }
}

module.exports = User;
