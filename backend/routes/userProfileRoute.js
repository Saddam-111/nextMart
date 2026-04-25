import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  uploadProfileImage,
  getUserOrders
} from "../controllers/userProfileController.js";
import { isAuth } from "../middleware/isAuth.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

// All routes require authentication
router.use(isAuth);

// Profile routes
router.route("/profile")
  .get(getUserProfile)
  .put(updateUserProfile);

router.route("/profile/upload-image")
  .post(upload.single('image'), uploadProfileImage);

router.route("/orders")
  .get(getUserOrders);

export default router;