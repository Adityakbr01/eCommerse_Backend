import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import user from "../models/user";

// Middleware to check if user is an admin
export const IsAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send("Unauthorized: No token provided");
    }
    const decoded = jwt.verify(token, Bun.env.JWT_SECRET as string);
    if (typeof decoded === "object" && (decoded as JwtPayload).id) {
      const userId = (decoded as JwtPayload).id;
      const findUser = await user.findById(userId);
      if (!findUser) return res.status(400).send("Invalid token payload");
      if (findUser.role === Bun.env.ROLE_ADMIN) {
        next();
      } else {
        res.status(401).send("Unauthorized: User is not an admin");
      }
    } else {
      return res.status(400).send("Invalid token payload");
    }
  } catch (error) {
    console.error(error);
    return res.status(401).send("Invalid token or session expired");
  }
};
