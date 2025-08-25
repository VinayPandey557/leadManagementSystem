import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware/auth.js";


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
console.log(JWT_SECRET);
const router = express.Router();
const prisma = new PrismaClient();

function signToken(payload, expiresIn = "60m") {
  return jwt.sign(payload, JWT_SECRET, {
    algorithm: "HS256",
    expiresIn,
  });
}



router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "email and password is required" });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ error: "Email is already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, hashedPassword: hashed },
    });

    return res.status(201).json({ id: user.id, email: user.email});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("SIGNIN ATTEMPT:", email, password);
    if (!email || !password)
      return res.status(400).json({ error: "email and password is required" });

    const user = await prisma.user.findUnique({ where: { email } });
    console.log("USER FOUND:", user);

    if (!user)
      return res.status(400).json({ error: "Invalid email or password" });

    const comparePassword = await bcrypt.compare(password, user.hashedPassword);
    console.log("PASSWORD MATCH:", comparePassword);

    if (!comparePassword)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken({ id: user.id, email: user.email });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, 
    });

    return res.status(200).json({ id: user.id, email: user.email });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/signout", (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Signed out successfully" });
});



router.get("/me", authMiddleware, async(req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id:true, email: true }
    });
    if(!user) return res.status(404).json({ error: "User not found"});

    return res.json(user);
  } catch(error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error "});
  }
})

export default router;
