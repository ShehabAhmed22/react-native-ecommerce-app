import Category from "../../../models/Category.js";
import ApiError from "../../../utils/apiError.js";

// ─── Create Category ─────────────────────────────────────────
export const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return next(new ApiError(400, "Name is required"));

    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Get All Categories (with Pagination) ────────────────────
export const getCategories = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      Category.find().skip(skip).limit(limit),
      Category.countDocuments(),
    ]);

    res.json({
      success: true,
      results: categories.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Get Single Category ──────────────────────────────────────
export const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return next(new ApiError(404, "Category not found"));

    res.json({
      success: true,
      data: category,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Update Category ─────────────────────────────────────────
export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) return next(new ApiError(404, "Category not found"));

    res.json({
      success: true,
      data: category,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Delete Category ─────────────────────────────────────────
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) return next(new ApiError(404, "Category not found"));

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
