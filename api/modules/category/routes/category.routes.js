import express from "express";
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../controller/category.controller.js";

import {
  protectRoute,
  adminOnly,
} from "../../../middlewares/auth.middleware.js";

const router = express.Router();

// Public
router.get("/", getCategories);
router.get("/:id", getCategory);

// Admin
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
