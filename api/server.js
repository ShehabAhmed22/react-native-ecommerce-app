import express from "express";
import path from "path";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import cors from "cors";

import { functions, inngest } from "./config/inngest.js";

import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

import adminRoutes from "./modules/admin/routes/admin.routes.js";
import userRoutes from "./modules/user/routes/user.routes.js";
import orderRoutes from "./modules/order/routes/order.routes.js";
import reviewRoutes from "./modules/review/routes/review.routes.js";
import productRoutes from "./modules/product/routes/product.routes.js";
import cartRoutes from "./modules/cart/routes/cart.routes.js";
import categoryRoutes from "./modules/category/routes/category.routes.js"; // ✅ NEW
import paymentRoutes from "./modules/payment/routes/payment.route.js";

const app = express();

const __dirname = path.resolve();

// special handling: Stripe webhook needs raw body BEFORE any body parsing middleware
// apply raw body parser conditionally only to webhook endpoint
app.use(
  "/api/payment",
  (req, res, next) => {
    if (req.originalUrl === "/api/payment/webhook") {
      express.raw({ type: "application/json" })(req, res, next);
    } else {
      express.json()(req, res, next); // parse json for non-webhook routes
    }
  },
  paymentRoutes,
);

app.use(express.json());
app.use(clerkMiddleware());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api/inngest", serve({ client: inngest, functions }));

app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/categories", categoryRoutes); // ✅ NEW

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Success" });
});

// make our app ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../admin/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../admin", "dist", "index.html"));
  });
}

const startServer = async () => {
  await connectDB();
  app.listen(ENV.PORT, () => {
    console.log("Server is up and running");
  });
};

startServer();
