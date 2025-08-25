import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";



const JWT_SECRET = process.env.JWT_SECRET;
console.log(JWT_SECRET);
const prisma = new PrismaClient();



export const authMiddleware = async (req, res, next) =>  {
  try {
    const token = req.cookies?.token;
    if(!token) {
        return res.status(401).json({
            error: 'Access token required'
        });
    }

   const decoded = jwt.verify(token, JWT_SECRET);

   const user = await prisma.user.findUnique({ where: {email: decoded.email} });
   if(!user) return res.status(401).json({message: "Invalid token"});
   req.user = { id: user.id, email: user.email};
   next();
  } catch(e) {
    return res.status(403).json({
        message: "Incorrect creds"
    })
  } 
}
