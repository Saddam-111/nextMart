import express from "express";
import {
  getAllUsers,
  toggleUserBlock,
  updateUserTags,
  getUserDetails
} from "../controllers/userController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// All routes require admin authentication
router.use(adminAuth);

router.route("/all")
  .get(getAllUsers);

router.route("/:userId/block")
  .put(toggleUserBlock);

router.route("/:userId/tags")
  .put(updateUserTags);

router.route("/:userId/details")
  .get(getUserDetails);

export default router;