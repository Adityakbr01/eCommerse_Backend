import express, { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import user from "../models/user";

export const Profile = async (req: Request, res: Response): Promise<any> => {
  try {
    // Check if token exists in cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).send("Unauthorized: No token provided");
    }

    // Verify the token (ensure type correctness)
    const decoded = jwt.verify(token, Bun.env.JWT_SECRET as string);

    // Check if the decoded token is an object and has an 'id' property
    if (typeof decoded === "object" && (decoded as JwtPayload).id) {
      const userId = (decoded as JwtPayload).id;
      const findUser = await user.findById(userId);
      console.log(findUser);

      res.send({
        message: "Profile fetched successfully",
        user: findUser,
      });
    } else {
      return res.status(400).send("Invalid token payload");
    }
  } catch (error) {
    // Handle errors gracefully
    console.error(error);
    return res.status(401).send("Invalid token or session expired");
  }
};
