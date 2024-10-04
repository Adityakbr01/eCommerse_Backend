import express from "express";
import { registerUser, loginUser } from "../controllers/user";
import jwt, { VerifyErrors } from "jsonwebtoken";

export const userRoutes = express.Router();

userRoutes.get("/", (req, res) => {
  res.send("Hello, world!");
});
userRoutes.post("/register", registerUser);

userRoutes.get("/register", (req, res) => {
  const token = req.cookies.token; // Use cookies to retrieve the token

  // If the token does not exist, render the registration page
  if (!token) {
    return res.render("register");
  }

  // Verify JWT token
  jwt.verify(
    token,
    "process.env.JWT_SECRET" as string,
    (err: VerifyErrors | null) => {
      if (err) {
        return res.render("register");
      }

      // If token is valid, redirect to profile page
      return res.redirect("/api/v1/user/profile");
    }
  );
});

userRoutes.post("/login", loginUser);

userRoutes.get("/login", (req, res) => {
  const token = req.cookies.token; // Use cookies to retrieve the token

  // If the token does not exist, render the registration page
  if (!token) {
    return res.render("login");
  }

  // Verify JWT token
  jwt.verify(
    token,
    "process.env.JWT_SECRET" as string,
    (err: VerifyErrors | null) => {
      if (err) {
        return res.render("login");
      }

      // If token is valid, redirect to profile page
      return res.redirect("/api/v1/user/profile");
    }
  );
});
