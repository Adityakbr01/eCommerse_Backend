import { Request, Response, NextFunction } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";

export const isAuthenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const token = req.cookies.token;

  // Agar token nahi hai, user ko login par redirect karein
  if (!token) return res.send("Unauthorized: No token provided");

  // Verify JWT token
  jwt.verify(
    token,
    "process.env.JWT_SECRET",
    (err: VerifyErrors | null, decoded: any) => {
      if (err) {
        return res.send("Unauthorized: Invalid token");
      }

      // Agar decoded token mil jata hai, hum token ko refresh karenge (naya token create karenge)
      const refreshedToken = jwt.sign(
        { id: decoded.id },
        "process.env.JWT_SECRET",
        {
          expiresIn: "1h",
        }
      );

      // Naya token cookie mein set karein
      res.cookie("token", refreshedToken, {
        httpOnly: true, // Client side se token ko access nahi kiya ja sake
        secure: process.env.NODE_ENV === "production", // Sirf HTTPS par kaam karega production mein
        maxAge: 3600000, // 1 hour
      });

      // Middleware ke baad aage request ko jane dena
      next();
    }
  );
};
