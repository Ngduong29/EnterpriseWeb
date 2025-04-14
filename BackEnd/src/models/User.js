const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sql = require("mysql2/promise");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const Student = require("./Student");
const Tutor = require("./Tutor");

dotenv.config();

// Format date to YYYY-MM-DD
const formatDate = (date) => {
  return new Date(date).toISOString().split("T")[0];
};

class User {
  // Constructor to initialize user properties
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

  // Get all users with their associated student or tutor IDs
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

  // Get all active users
  static async getActiveUser() {
    const connection = await connectDB();
    const [rows] = await connection.execute(
      `SELECT userID, userName, fullName, email, avatar, dateOfBirth, role, phone, address, isActive FROM Users WHERE isActive = 1`
    );
    return rows;
  }

  // Get user by userID
  static async getUsers(userID) {
    const connection = await connectDB();
    const [rows] = await connection.execute(
      `SELECT * FROM Users WHERE userID = ?`,
      [userID]
    );
    return rows[0];
  }

  // Get user by email
  static async getUserByEmail(email) {
    const connection = await connectDB();
    const [rows] = await connection.execute(
      `SELECT * FROM Users WHERE email = ?`,
      [email]
    );
    return rows[0];
  }

  // Find user by email
  static async findByEmail(email) {
    const connection = await connectDB();
    const [rows] = await connection.execute(
      "SELECT * FROM Users WHERE email = ?",
      [email]
    );
    return rows[0];
  }

  // Find user by userID
  static async findUserByID(userID) {
    const connection = await connectDB();
    const [rows] = await connection.execute("SELECT * FROM Users WHERE userID = ?", [userID]);
    console.log("Found user:", rows[0]); // Debug log
    return rows[0];
  }

  // Create a new user
  static async createUser(user) {
    const connection = await connectDB();
    const { userName, email, password, role } = user;
    const [result] = await connection.execute(
      `INSERT INTO Users (userName, email, password, role) 
       VALUES (?, ?, ?, ?)`,
      [userName, email, password, role]
    );
    return { userID: result.insertId, ...user };
  }

  // Update user information
  static async updateUser(userID, updates) {
    const connection = await connectDB();
    const fields = Object.keys(updates)
      .map(key => `${key} = ?`)
      .join(', ');
    const values = Object.values(updates);
    values.push(userID);
    
    const [result] = await connection.execute(
      `UPDATE Users SET ${fields} WHERE userID = ?`,
      values
    );
    return result.affectedRows > 0;
  }

  // Ban a user by setting isActive to 0
  static async banUser(userID) {
    const connection = await connectDB();
    const [result] = await connection.execute(
      `UPDATE Users SET isActive = 0 WHERE userID = ?`,
      [userID]
    );
    return result.affectedRows > 0 ? await this.findUserByID(userID) : null;
  }

  // Unban a user by setting isActive to 1
  static async unbanUser(userID) {
    const connection = await connectDB();
    const [result] = await connection.execute(
      `UPDATE Users SET isActive = 1 WHERE userID = ?`,
      [userID]
    );
    return result.affectedRows > 0 ? await this.findUserByID(userID) : null;
  }

  // Search for tutor requests by userID
  static async searchRequest(userID) {
    const connection = await connectDB();
    const [rows] = await connection.execute(
      `SELECT * FROM TutorRequests WHERE userID = ?`,
      [userID]
    );
    return rows[0];
  }

  // Get all tutor requests
  static async getRequest() {
    const connection = await connectDB();
    const [rows] = await connection.execute(`SELECT * FROM TutorRequests`);
    return rows;
  }

  // Update the status of a tutor request
  static async updateRequestStatus(userID, status) {
    const connection = await connectDB();
    console.log(userID, status); 
    const [result] = await connection.execute(
      `UPDATE TutorRequests SET status = ? WHERE userID = ?`,
      [status, userID]
    );
    return result.affectedRows > 0;
  }

  // Generate JWT token for user authentication
  static generateAuthToken(user) {
    return jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  }

  // Compare password with hashed password
  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  // Send a complaint from a user
  static async sendComplain(userID, message) {
    const connection = await connectDB();
    const [result] = await connection.execute(
      `INSERT INTO Complains (uID, message) VALUES (?, ?)`,
      [userID, message]
    );
    return { complainID: result.insertId, uID: userID, message };
  }

  // Get all complaints
  static async getComplain() {
    const connection = await connectDB();
    const [rows] = await connection.execute(`SELECT * FROM Complains`);
    return rows;
  }

  // Delete a complaint by ID
  static async deleteComplain(complainID) {
    const connection = await connectDB();
    const [result] = await connection.execute(
      `DELETE FROM Complains WHERE complainID = ?`,
      [complainID]
    );
    return result.affectedRows > 0;
  }

  // Update user password
  static async updatePassword(userID, newPassword) {
    const connection = await connectDB();
    const [result] = await connection.execute(
      `UPDATE Users SET password = ? WHERE userID = ?`,
      [newPassword, userID]
    );
    return result.affectedRows > 0;
  }
}

// Delete a user and all associated data based on their role
User.deleteUser = async (userID) => {
  const connection = await connectDB();
  try {
    // Start a transaction
    await connection.beginTransaction();

    // Get user role first
    const [[user]] = await connection.execute(
      `SELECT role FROM Users WHERE userID = ?`,
      [userID]
    );

    if (!user) {
      throw new Error('User not found');
    }

    // Delete based on role
    if (user.role === 'Student') {
      // Delete student and all related data
      await Student.deleteStudent(userID);
    } else if (user.role === 'Tutor') {
      // Delete tutor and all related data
      await Tutor.deleteTutor(userID);
    } else {
      // For other roles (Admin, Moderator), just delete the user
      const [result] = await connection.execute(
        `DELETE FROM Users WHERE userID = ?`,
        [userID]
      );
      if (result.affectedRows === 0) {
        throw new Error('Failed to delete user');
      }
    }

    // Commit the transaction
    await connection.commit();
    return true;
  } catch (error) {
    // Rollback the transaction in case of error
    await connection.rollback();
    throw error;
  }
};

module.exports = User;
