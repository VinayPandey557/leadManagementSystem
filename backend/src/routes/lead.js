import express from "express";
import { authMiddleware } from "../middleware/auth.js";

import { 
    createLead,
    getLeadById,
    getLeads,
    updateLead,
    deleteLead
 } from "../controller/leadController.js";


 const router = express.Router();


 router.use(authMiddleware);


 router.post("/", createLead);
 router.get("/", getLeads);
 router.get("/:id", getLeadById);
 router.put("/:id", updateLead);
 router.delete("/:id", deleteLead);


 export default router;
 