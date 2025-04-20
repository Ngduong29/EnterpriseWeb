const Classroom = require("../models/Class");
const User = require("../models/User");
const Student = require("../models/Student");
const Tutor = require("../models/Tutor");
const Payment = require("../models/Payment");
const { sendApprovalEmail, sendDenialEmail } = require("../email/EmailApproved");

class adminController {
  static getAllUser = async (req, res) => {
    try {
      const data = await User.getAllUser();
      if (!data) {
        return res.status(404).json({
          message: "Cannot find user list",
        });
      }

      return res.status(200).json({
        message: "User list",
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error in get user in Server",
        error,
      });
    }
  };

  static getActiveUserByMonthAndYear = async (req, res) => {
    try {
      const data = await User.getAllUserActiveGroupByMonthAndYear();
      if (!data) {
        return res.status(404).json({
          message: "Cannot find user list",
        });
      }

      return res.status(200).json({
        message: "User list",
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error in get user in Server",
        error,
      });
    }
  };

  static getActiveUser = async (req, res) => {
    try {
      const data = await User.getActiveUser();
      if (!data) {
        return res.status(404).json({
          message: "Cannot find active user list",
        });
      }

      return res.status(200).json({
        message: "Active user list",
        count: data.length,
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error in get active user in Server",
        error,
      });
    }
  };

  static getTutorRequest = async (req, res) => {
    try {
      const data = await User.getRequest();
      if (!data) {
        return res.status(404).json({
          message: "Cannot find request",
        });
      }

      return res.status(200).json({
        message: "Request Tutor list",
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error in search tutor request in Server",
        error,
      });
    }
  };

  static handleTutor = async (req, res) => {
    try {
      const userID = req.params.id;
      if (!userID) {
        return res.status(404).json({
          message: "Please provide user id",
        });
      }
      const check = await User.searchRequest(userID);
      if (!check) {
        return res.status(404).json({
          message: "Cannot find request of this user",
        });
      }

      const { status } = req.body;
      console.log("Received status:", status);

      if (status == "Accept") {
        // Update TutorRequests status
        const statusUpdated = await User.updateRequestStatus(userID, "Accept");
        
        // Update Tutor status and unban user
        const tutorStatusUpdated = await Tutor.updateTutorStatus(userID, "Accept");
        const userUnbanned = await User.unbanUser(userID);
        
        if (!statusUpdated || !tutorStatusUpdated || !userUnbanned) {
          return res.status(500).json({
            message: "Error in confirming tutor",
          });
        }

        // Send approval email
        const user = await User.findUserByID(userID);
        console.log("User data for email:", user);
      
        if (user && user.email) {
          try {
            await sendApprovalEmail(user.email);
            console.log("Approval email sent to:", user.email);
          } catch (emailError) {
            console.error("Error sending email:", emailError);
          }
        }

        return res.status(200).json({
          message: "Tutor Confirmed",
          user: user
        });
      } else if (status == "Deny") {
        // Update both TutorRequests and Tutor status
        const statusUpdated = await User.updateRequestStatus(userID, "Deny");
        const tutorStatusUpdated = await Tutor.updateTutorStatus(userID, "Deny");
        
        if (!statusUpdated || !tutorStatusUpdated) {
          return res.status(500).json({
            message: "Error in rejecting tutor",
          });
        }

        const user = await User.findUserByID(userID);
        
        if (user && user.email) {
          try {
            await sendDenialEmail(user.email);
            console.log("Denial email sent to:", user.email);
          } catch (emailError) {
            console.error("Error sending email:", emailError);
          }
        }
        
        return res.status(200).json({
          message: "Tutor Rejected",
          user: user
        });
      }

      return res.status(500).json({
        message: "Status not correct",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error in confirming tutor on server",
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

  static deleteClass = async (req, res) => {
    try {
      const classId = req.params.id;
      if (!classId) {
        return res.status(404).json({
          message: "Please provide class id",
        });
      }

      const result = await Classroom.DeleteClass(classId);
      if (!result) {
        return res.status(404).json({
          message: "Error in deleting class",
        });
      }

      return res.status(200).json({
        message: "Class deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting class:', error);
      res.status(500).json({
        message: "Error in deleting class on server",
        error: error.message,
      });
    }
  };

  static deleteStudent = async (req, res) => {
    try {
      const userID = req.params.id;
      if (!userID) {
        return res.status(404).json({
          message: "Please provide user ID",
        });
      }

      const result = await Student.deleteStudent(userID);
      if (!result) {
        return res.status(404).json({
          message: "Student not found or could not be deleted",
        });
      }

      res.status(200).json({
        message: "Student deleted successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error deleting student",
        error: error.message,
      });
    }
  };

  static updateUser = async (req, res) => {
    try {
      const userID = req.params.id;
      if (!userID) {
        return res.status(404).json({
          message: "Missing user id",
        });
      }
      const user = req.body;
      if (!user) {
        return res.status(404).json({
          message: "Cannot found user",
        });
      }

      const data = await User.updateUserForAdmin(user, userID);
      if (!data) {
        return res.status(500).json({
          message: "Error in update user",
        });
      }

      return res.status(200).json({
        message: "User's detail updated",
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error in update user in Server",
        error,
      });
    }
  };

  static banUsers = async (req, res) => {
    try {
      const userID = req.params.id;
      if (!userID) {
        return res.status(404).json({
          message: "Please provide user id",
        });
      }

      const data = await User.banUser(userID);
      if (!data) {
        return res.status(500).json({
          message: "Error in ban user",
        });
      }

      return res.status(200).json({
        message: "User banned",
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error in ban user in Server",
        error,
      });
    }
  };

  static unbanUsers = async (req, res) => {
    try {
      const userID = req.params.id;
      if (!userID) {
        return res.status(404).json({
          message: "Please provide user id",
        });
      }

      const data = await User.unbanUser(userID);
      if (!data) {
        return res.status(500).json({
          message: "Error in unban user",
        });
      }

      return res.status(200).json({
        message: "User unbanned",
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error in unban user in Server",
        error,
      });
    }
  };

  static deleteTutor = async (req, res) => {
    try {
      const userID = req.params.id;
      if (!userID) {
        return res.status(404).json({
          message: "Please provide user ID",
        });
      }

      const result = await Tutor.deleteTutor(userID);
      if (!result) {
        return res.status(404).json({
          message: "Tutor not found or could not be deleted",
        });
      }

      res.status(200).json({
        message: "Tutor deleted successfully",
      });
    } catch (error) {
      console.log(error);
      if (error.message === 'Cannot delete tutor with active classes') {
        return res.status(400).json({
          message: "Cannot delete tutor with active classes. Please deactivate or delete the classes first.",
        });
      }
      res.status(500).json({
        message: "Error deleting tutor",
        error: error.message,
      });
    }
  };

  static getPaymentInfoThisMonth = async (req, res) => {
    try {
      const data = await Payment.getPaymentInfoThisMonth();
      if (!data) {
        return res.status(404).json({
          message: "Cannot find payment info",
        });
      }

      return res.status(200).json({
        message: "Payment info",
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error in getting payment info this month",
        error,
      });
    }
  }

  static getComplainList = async (req, res) => {
    try {
      const data = await User.getComplain();
      if (!data) {
        return res.status(500).json({
          message: "Error in getting complain list",
        });
      }

      return res.status(200).json({
        message: "Get complain list success",
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Error in getting complain list in Server",
        error,
      });
    }
  };
  static deleteComplain = async (req, res) => {
    try {
      const complainID = parseInt(req.params.id);
      const deletedComplain = await User.deleteComplain(complainID);
      if (deletedComplain) {
        return res.status(200).json({
          message: 'Complaint deleted successfully',
          deletedComplain,
        });
      } else {
        return res.status(404).json({
          message: 'Complaint not found',
        });
      }
    } catch (error) {
      console.error('Error deleting complaint:', error);
      res.status(500).json({
        message: 'Internal server error',
        error,
      });
    }
  };

}

module.exports = adminController;
