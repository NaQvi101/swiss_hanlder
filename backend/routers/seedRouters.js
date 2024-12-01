import express from "express";
import Product from "../models/productModel.js";
import data from "../data.js";
import User from "../models/userModel.js";
import Category from "../models/productCategoryModel.js";

const seedRouter = express.Router();

seedRouter.get("/", async (req, res) => {
  await Product.deleteMany({});
  const createProducts = await Product.insertMany(data.products);
  await User.deleteMany({});
  const createUsers = await User.insertMany(data.users);
  await Category.deleteMany({});
  const createCategory = await Category.insertMany(data.categories);
  res.send({ createProducts, createUsers, createCategory });
});

seedRouter.get("/categories", async (req, res) => {
  await Category.deleteMany({});
  const createCategory = await Category.insertMany(data.categories);
  res.send({ createCategory });
});

export default seedRouter;
