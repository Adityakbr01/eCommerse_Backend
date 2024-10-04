import express from "express";
import { Profile } from "../controllers/profile";

export const profileRoutes = express.Router();

profileRoutes.get("/", (req, res) => {
  res.send("Profile Root Page");
});

profileRoutes.get("/profile", Profile);
