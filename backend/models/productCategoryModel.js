import mongoose from "mongoose";

const productCategorySchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", productCategorySchema);

export default Category;
