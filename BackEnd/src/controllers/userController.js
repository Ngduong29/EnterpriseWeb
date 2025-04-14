const Student = require("../models/Student");
const Tutor = require("../models/Tutor");
const User = require("../models/User");

class userController {

  static updateUserForUser = async (req, res) => {
    try {
      const userID = req.params.id;
      if (!userID) {
        return res.status(404).json({
          message: "Missing user id",
        });
      }
      const realUser = await User.findUserByID(userID);
      console.log("Real user found:", realUser);

      const updatedUserData  = req.body;
      console.log("Updated user data:", updatedUserData);
      if (!updatedUserData) {
        return res.status(404).json({
          message: "Cannot found user",
        });
      }
      console.log("Update data received:", updatedUserData);

      // Separate user fields from role-specific fields
      const userFields = ['userName', 'fullName', 'email', 'avatar', 'dateOfBirth', 'phone', 'address'];
      const userUpdates = {};
      const roleSpecificUpdates = {};

      Object.keys(updatedUserData).forEach(key => {
        if (userFields.includes(key)) {
          if (key === 'dateOfBirth' && updatedUserData[key]) {
            // Format the date to YYYY-MM-DD
            userUpdates[key] = new Date(updatedUserData[key]).toISOString().split('T')[0];
          } else {
            userUpdates[key] = updatedUserData[key];
          }
        } else {
          roleSpecificUpdates[key] = updatedUserData[key];
        }
      });

      let updated;
      if (realUser.role == "Student") {
        let student = await Student.findStudentByUserID(userID);
        if (!student) {
          return res.status(404).json({
            message: "Student not found",
          });
        }
        console.log("Student found:", student);

        student.grade = roleSpecificUpdates.grade || student.grade;
        student.school = roleSpecificUpdates.school || student.school;
        updated = await Student.updateStudent(userID, student);
        if (!updated) {
          return res.status(500).json({
            message: "Student update fail",
          });
        }
        console.log("Student updated:", updated);
      } else if (realUser.role == "Tutor") {
        let tutor = await Tutor.findTutorByTutorUserID(userID);
        if (!tutor) {
          return res.status(404).json({
            message: "Tutor not found",
          });
        }
        console.log("Tutor found:", tutor);

        tutor.degrees = roleSpecificUpdates.degrees || tutor.degrees;
        tutor.identityCard = roleSpecificUpdates.identityCard || tutor.identityCard;
        tutor.workplace = roleSpecificUpdates.workplace || tutor.workplace;
        tutor.description = roleSpecificUpdates.description || tutor.description;
        updated = await Tutor.updateTutor(userID, tutor);
        if (!updated) {
          return res.status(500).json({
            message: "Tutor update fail",
          });
        }
        console.log("Tutor updated:", updated);
      }

      // Only update user fields in the Users table
      const data = await User.updateUser(userID, userUpdates);
      if (!data) {
        return res.status(500).json({
          message: "Error in update user",
        });
      }
      console.log("User updated:", data);

      // Get updated user data
      const updatedUser = await User.findUserByID(userID);
      if (!updatedUser) {
        return res.status(500).json({
          message: "Error fetching updated user data",
        });
      }
      console.log("Updated user fetched:", updatedUser);

      // Combine user data with role-specific data
      const finalUserData = { ...updatedUser, ...updated };
      console.log("Final user data:", finalUserData);

      const token = User.generateAuthToken(finalUserData);
      const response = {
        message: "User's detail updated",
        token,
        user: finalUserData
      };
      console.log("Final response:", response);

      return res.status(200).json(response);
    } catch (error) {
      console.log("Error in updateUserForUser:", error);
      res.status(500).json({
        message: "Error in update user in Server",
        error: error.message
      });
    }
  };
  static sendComplains = async (req, res) => {
    try {
      const { userID, message } = req.body;
      if (!userID) {
        return res.status(404).json({
          message: "Cannot find user id",
        });
      }
      if (!message) {
        return res.status(404).json({
          message: "Complain message cannot be blank",
        });
      }

      const data = await User.sendComplain(userID, message);
      res.status(200).json({
        message: "Complain sent!",
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error in sending complain api",
      });
    }
  };

  static updateUserPassword = async (req, res) => {
    try {
      const { email, newPassword } = req.body;

      if (!email) {
        return res.status(400).json({
          message: "Email is required",
        });
      }

      if (!newPassword) {
        return res.status(400).json({
          message: "New password is required",
        });
      }

      const user = await User.findByEmail(email);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const updated = await User.updateUserPasswordByEmail(email, newPassword);

      if (!updated) {
        return res.status(500).json({
          message: "Error updating password",
        });
      }

      res.status(200).json({
        message: "Password updated successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Server error",
        error,
      });
    }
  };

  static deleteUser = async (req, res) => {
    try {
      const userID = req.params.id;
      if (!userID) {
        return res.status(404).json({
          message: "Please provide user ID",
        });
      }

      const result = await User.deleteUser(userID);
      if (!result) {
        return res.status(404).json({
          message: "User not found or could not be deleted",
        });
      }

      res.status(200).json({
        message: "User deleted successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error deleting user",
        error: error.message,
      });
    }
  };

}

module.exports = userController;
