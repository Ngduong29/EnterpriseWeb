const Tutor = require("../models/Tutor");
const User = require("../models/User");
const Student = require("../models/Student");
const multer = require("multer");
const bcrypt = require("bcrypt");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

class authController {
  static registerStudent = async (req, res) => {
    const {
      email,
      userName,
      password,
      fullName,
      dateOfBirth,
      phone,
      address,
      grade,
      school,
    } = req.body;

    const { avatar } = req.body;
    try {
      // Check if user already exists
      let user = await User.findByEmail(email);
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create user
      user = await User.create({
        email,
        userName,
        password, // Make sure to hash the password in the User model's create method
        fullName,
        avatar,
        dateOfBirth,
        phone: "0866722601",
        address: "Ha Noi",
        role: "Student",
        isActive: 1,
      });

      console.log(user);
      
      // Create student
      const student = await Student.createStudent(user.userID, {
        grade,
        school,
      });
    
      if (!student) {
        return res.status(500).json({
          message: "Cannot create student",
        });
      }
      user = { ...user, ...student };

      // Generate authentication token
      const token = User.generateAuthToken(user);

      res.status(201).json({ token, user });
    } catch (error) {
      console.error("Error registering student:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  static registerTutor = async (req, res) => {
    const {
      email,
      userName,
      password,
      fullName,
      dateOfBirth,
      phone,
      address,
      workplace,
      description,
      avatar, // URL as a string
      identityCard, // URL as a string
      degrees, // URL as a string
    } = req.body;

    try {
      // Check if user already exists
      let user = await User.findByEmail(email);
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create user
      user = await User.create({
        email,
        userName,
        password, // Make sure to hash the password in the User model's create method
        fullName,
        avatar,
        dateOfBirth,
        phone,
        address,
        role: "Tutor",
        isActive: 0, //để inactive khi nào đc duyệt thì tự động active
      });

      // Create tutor
      const tutor = await Tutor.createTutor(user.userID, {
        degrees,
        identityCard: "ID123457",
        workplace,
        description,
      });
      console.log(identityCard);
      

      const request = await Tutor.registerTutor(user.userID, tutor.tutorID);
      if (!request) {
        return res.status(500).json({
          message: "Tutor request sent fail",
        });
      }

      user = { ...user, ...tutor };
      // Generate authentication token
      const token = User.generateAuthToken(user);

      res.status(201).json({
        message: "Tutor request sent, please wait for accept",
        token,
        user,
      });
    } catch (error) {
      console.error("Error registering tutor:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  static loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
      let user = await User.findByEmail(email);
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      
      const isMatch = await User.comparePassword(password, user.password);
      console.log(isMatch);
      if (!isMatch) {
        return res.status(400).json({ message: "Wrong Password" });
      }

      if (!user.isActive) {
        return res.status(403).json({
          message: "User banned!",
        });
      }

      if (user.role == "Student") {
        const student = await Student.findStudentByUserID(user.userID);
        user = { ...user, ...student };
      } else if (user.role == "Tutor") {
        const tutor = await Tutor.findTutorByTutorUserID(user.userID);
        user = { ...user, ...tutor };
      }

      const token = User.generateAuthToken(user);
      res.status(200).json({ token, user });
    } catch (error) {
      console.error("Error logging in user:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  static fetchUserProfile = async (req, res) => {
    try {
      const user = req.body.user;
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ user });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  static updateUserProfile = async (req, res) => {
    try {
      const { userName, fullName, email, phone, address, dateOfBirth } = req.body;
      const userID = req.user.userID;

      // Validate input
      if (!userName || !fullName || !email) {
        return res.status(400).json({ message: "Required fields are missing" });
      }

      // Check if email is already taken by another user
      const existingUser = await User.findByEmail(email);
      if (existingUser && existingUser.userID !== userID) {
        return res.status(400).json({ message: "Email is already taken" });
      }

      // Update user profile
      const updatedUser = await User.updateUser({
        userName,
        fullName,
        email,
        phone,
        address,
        dateOfBirth
      }, userID);

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: "Profile updated successfully",
        user: updatedUser
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Error updating profile" });
    }
  };

  static updatePassword = async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userID = req.user.userID;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current and new passwords are required" });
      }

      // Get user and verify current password
      const user = await User.findUserByID(userID);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      // Update password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.updatePassword(userID, hashedPassword);

      res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error updating password:", error);
      res.status(500).json({ message: "Error updating password" });
    }
  };
}


module.exports = authController;
