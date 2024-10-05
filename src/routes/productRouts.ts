import express from "express";
import { CreateProduct, Products } from "../controllers/product";
import { IsAdmin } from "../middlewares/isAdmin";

export const productRoutes = express.Router();

productRoutes.get("/", Products);
productRoutes.post("/createProduct", CreateProduct);
