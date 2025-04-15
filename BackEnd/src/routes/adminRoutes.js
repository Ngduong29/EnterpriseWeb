const express = require("express");
const adminController = require("../controllers/adminController");
const classController = require("../controllers/classController");
const router = express.Router();
const multer = require("multer");
const authController = require("../controllers/authController");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const auth = require("../middleware/auth");

router.put("/updateUsers/:id", adminController.updateUser);
router.put("/banUsers/:id", adminController.banUsers);
router.put("/unbanUsers/:id", adminController.unbanUsers);
router.get("/complainList", adminController.getComplainList);
router.get("/classList", classController.getAllClass);
router.get("/classListExisted", classController.getAllClassExisted);
router.get("/getRequest", adminController.getTutorRequest);
router.get("/getUser", adminController.getAllUser);
router.get("/getActiveUser", adminController.getActiveUser);
router.post("/handleTutor/:id", adminController.handleTutor);
router.delete("/deleteClass/:id", adminController.deleteClass);
// Delete student route (must be last due to :id parameter)
router.delete("/deleteStudent/:id", adminController.deleteStudent);

router.delete('/deleteComplains/:id', adminController.deleteComplain);

router.post(
    "/registerStudent",
    upload.fields([{ name: "avatar", maxCount: 1 }]),
    auth('Admin'),
    authController.registerStudent
);
router.post(
    "/registerTutor",
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "degreeFile", maxCount: 1 },
        { name: "credentialFile", maxCount: 1 },
    ]),
    auth('Admin'),
    authController.registerTutor
);
module.exports = router;
