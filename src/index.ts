import cookie from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
import path from "path";
import ConnectDB from "./config/DB";
import { isAuthenticate } from "./middlewares/isAutheniticate";
import { profileRoutes } from "./routes/profileRouts";
import { userRoutes } from "./routes/userRoutes";
import { productRoutes } from "./routes/productRouts";
import cors from "cors";

const app = express();

// Middleware for parsing JSON request bodies
app.use(
  cors({
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie());
// Set the view engine to EJS
app.set("view engine", "ejs");

// Set the directory where the EJS templates (views) will be stored
app.set("views", path.join(__dirname, "views"));

// Serve static files (optional, if you have any assets like CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB
ConnectDB();

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Define routes
app.use("/api/v1/auth", userRoutes);
app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/api/v1/auth/login");
});
app.use("/api/v1/user", isAuthenticate, profileRoutes);

//Procts Route
app.use("/api/v1/products", productRoutes);

// 404 Route Handler (Catch-all for undefined routes)
app.use((req, res, next) => {
  res.status(404).render("error", { message: "Page not found" });
});

// Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log the error for debugging
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});
const PORT = Bun.env.PORT || 3000;
console.log(PORT);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
