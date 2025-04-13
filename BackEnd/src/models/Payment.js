const dotenv = require("dotenv");
const connectDB = require("../config/db");
const sql = require("mysql2/promise");

dotenv.config();

class Payment {
  static async getPaymentInfo() {
    const connection = await connectDB();
    const [rows] = await connection.execute(`SELECT * FROM Payments`);
    return rows;
  }

  static async getAllPayment() {
    const connection = await connectDB();
    const [rows] = await connection.execute(`SELECT * FROM Payment`);
    return rows;
  }

  static async createPayment(paymentInfo, tutorID) {
    const connection = await connectDB(); 
    const { id, orderCode, amount, status, createdAt } = paymentInfo;
    const [check] = await connection.execute(
      "SELECT COUNT(*) AS count FROM Payments WHERE id = ?",
      [id]
    );
    if (check[0].count === 0) {
      const [result] = await connection.execute(
        `INSERT INTO Payments (id, tutorID, orderCode, amount, status, createdAt) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, tutorID, orderCode, amount, status, new Date(createdAt)]
      );
      return {
        id,
        tutorID,
        orderCode,
        amount,
        status,
        createdAt,
      };
    }
    return check[0];
  }

  static async getTransaction() {
    const connection = await connectDB();
    const [rows] = await connection.execute(`SELECT 
                tutorID,
                orderCode,
                amount,
                status,
                createdAt
              FROM 
                Payments`);
    return rows;
  }
}

module.exports = Payment;