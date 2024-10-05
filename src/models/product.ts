import mongoose, { Document, Schema } from "mongoose";

// Define the interface for a product document
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: "mobile" | "clothes" | "electronics" | "furniture";
  image: string;
  state: "shipped" | "pending" | "delivered";
}

// Define the schema for the product
const productSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ["mobile", "clothes", "electronics", "furniture"], // Enum for categories
    required: true,
  },
  image: { type: String, required: true },
  state: {
    type: String,
    enum: ["shipped", "pending", "delivered"], // Enum for states
    default: "shipped",
  },
});
export default mongoose.model<IProduct>("Product", productSchema);
