import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { RegisterUserRequestBody } from "../types/validator";

// Register a new user
export const registerUser = async (
  req: Request<{}, {}, RegisterUserRequestBody>,
  res: Response
) => {
  try {
    const { name, email, password } = req.body;
    // console.log(name, email, password);

    if (!name || !email || !password)
      res.send("Please add all required fields");

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      bcrypt.genSalt(10, function async(err, salt) {
        bcrypt.hash(password, salt, async function (err, hash) {
          // Store hash in your password DB.
          const NewUser = await User.create({
            name: name,
            email: email,
            password: hash,
          });
          const Token = jwt.sign(
            { id: NewUser._id },
            Bun.env.JWT_SECRET as string,
            {
              expiresIn: "1h",
            }
          );

          console.log(Token);
          res.cookie("token", Token);
          res.status(201).send({
            message: "User created successfully",
            user: [name, email, NewUser._id],
            Token: Token,
          });
        });
      });
    } else {
      res.status(400).send({
        message: "User already exists please Login",
        user: [name, email, existingUser._id],
      });
      res.clearCookie("token");
    }
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
};

// Login user
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) res.send("Please add all required fields");
    const user = await User.findOne({ email });

    if (!user) res.status(400).json({ message: "Invalid credentials" });
    else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.clearCookie("token"); // clear
        res.status(400).json({ message: "Invalid credentials" });
      }
      res.clearCookie("token");
      const token = jwt.sign({ id: user._id }, Bun.env.JWT_SECRET as string, {
        expiresIn: "1h",
      });
      res.cookie("token", token);
      res.redirect("/api/v1/user/profile");
      setTimeout(() => {
        res.redirect("/profile");
      }, 2000);
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
