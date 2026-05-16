import { Router } from "express";
import { protectRoute } from "../../../middlewares/auth.middleware.js";
import { getAllProducts } from "../../admin/controller/admin.controller.js";
import { getProductById } from "../controller/product.controller.js";

const router = Router();

router.get("/", protectRoute, getAllProducts);
router.get("/:id", protectRoute, getProductById);

export default router;
