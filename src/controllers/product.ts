import { Request, Response } from "express";
import product from "../models/product";

export const Products = async (req: Request, res: Response) => {
  try {
    const allProducts = await product.find({});

    // Pass the products to the EJS view
    // res.render("allProducts", { products: allProducts });
    //pass Data

    res.status(200).json({ allProducts });
  } catch (error) {
    console.error("Error fetching products: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const CreateProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { name, description, price, category, image } = req.body;
    if (!name || !description || !price || !category || !image)
      return res.send("Please add all required fields");
    if (price < 0) return res.send("Price cannot be negative");

    if (
      category !== "mobile" &&
      category !== "electronics" &&
      category !== "clothes" &&
      category !== "furniture"
    )
      return res.send(
        "Category should be one of the following: mobile, clothes, electronics, furniture"
      );

    // Create a new product and save it to the database
    const NewProduct = await product.create({
      name,
      description,
      price,
      category,
      image,
    });
    NewProduct.save();
    res.status(200).json(NewProduct);
  } catch (error) {
    console.error("Error creating product: ", error);
    res.status(500).json({ message: "Server error" });
  }
};
