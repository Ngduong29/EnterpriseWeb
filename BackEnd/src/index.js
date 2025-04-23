const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const sendEmail = require("./email/EmailOtp");
const corsMiddleware = require("./middleware/cors");
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const routes = require("./routes");
app.use("/api", routes);

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// Email recovery endpoint
app.post("/send_recovery_email", async (req, res, next) => {
  try {
    const { recipient_email, OTP } = req.body;
    if (!recipient_email || !OTP) {
      return res.status(400).json({ message: "Missing email or OTP" });
    }
    const response = await sendEmail({ recipient_email, OTP });
    res.json({ message: response.message });
  } catch (error) {
    next(error);
  }
});

// Socket.IO setup
io.on("connection", (socket) => {
  socket.on("sendMessage", async (message) => {
    try {
      if (!message || !message.senderID || !message.receiverID || !message.content) {
        socket.emit("error", { message: "Invalid message format" });
        return;
      }
      io.emit("receiveMessage", message);
    } catch (error) {
      console.error("Error processing message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  socket.on("disconnect", () => {
    // logic
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}); 