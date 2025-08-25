import { PrismaClient } from "@prisma/client"



const prisma = new PrismaClient();




export const createLead = async(req, res) => {
    try {
        const lead = await prisma.lead.create({ data: req.body });
        return res.status(201).json(lead);

    } catch(error) {
        return res.status(400).json({ message: "Error creating leads", error: error.message });
    }
}



export const getLeads = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);
        const skip = (page -1 ) * limit;


        const filters = {};

    if (req.query.email_equals) filters.email = req.query.email_equals;
    if (req.query.email_contains) filters.email = { contains: req.query.email_contains, mode: "insensitive" };

    if (req.query.company_equals) filters.company = req.query.company_equals;
    if (req.query.company_contains) filters.company = { contains: req.query.company_contains, mode: "insensitive" };

    if (req.query.city_equals) filters.city = req.query.city_equals;
    if (req.query.city_contains) filters.city = { contains: req.query.city_contains, mode: "insensitive" };

    if (req.query.status) filters.status = req.query.status;
    if (req.query.status_in) filters.status = { in: req.query.status_in.split(",") };

    if (req.query.source) filters.source = req.query.source;
    if (req.query.source_in) filters.source = { in: req.query.source_in.split(",") };
    

    if (req.query.score_equals) filters.score = parseInt(req.query.score_equals);
    if (req.query.score_gt) filters.score = { gt: parseInt(req.query.score_gt) };
    if (req.query.score_lt) filters.score = { lt: parseInt(req.query.score_lt) };
    if (req.query.score_between) {
      const [min, max] = req.query.score_between.split(",").map(Number);
      filters.score = { gte: min, lte: max };
    }


    if (req.query.leadValue_equals) filters.leadValue = parseFloat(req.query.leadValue_equals);
    if (req.query.leadValue_gt) filters.leadValue = { gt: parseFloat(req.query.leadValue_gt) };
    if (req.query.leadValue_lt) filters.leadValue = { lt: parseFloat(req.query.leadValue_lt) };
    if (req.query.leadValue_between) {
      const [min, max] = req.query.leadValue_between.split(",").map(Number);
      filters.leadValue = { gte: min, lte: max };
    }

    
    if (req.query.createdAt_on) filters.createdAt = new Date(req.query.createdAt_on);
    if (req.query.createdAt_before) filters.createdAt = { lt: new Date(req.query.createdAt_before) };
    if (req.query.createdAt_after) filters.createdAt = { gt: new Date(req.query.createdAt_after) };
    if (req.query.createdAt_between) {
      const [start, end] = req.query.createdAt_between.split(",").map(d => new Date(d));
      filters.createdAt = { gte: start, lte: end };
    }

    if (req.query.lastActivityAt_on) filters.lastActivityAt = new Date(req.query.lastActivityAt_on);
    if (req.query.lastActivityAt_before) filters.lastActivityAt = { lt: new Date(req.query.lastActivityAt_before) };
    if (req.query.lastActivityAt_after) filters.lastActivityAt = { gt: new Date(req.query.lastActivityAt_after) };
    if (req.query.lastActivityAt_between) {
      const [start, end] = req.query.lastActivityAt_between.split(",").map(d => new Date(d));
      filters.lastActivityAt = { gte: start, lte: end };
    }


    if (req.query.isQualified) filters.isQualified = req.query.isQualified === "true";


    const [data, total] = await Promise.all([
        prisma.lead.findMany({
            where: filters,
            skip,
            take: limit,
            orderBy: {createdAt: "desc"},
        }),
        prisma.lead.count({ where: filters }),
    ]);

    return res.json({
        data,
        page,
        limit,
        total,
        totalPages: Math.ceil(total/limit)
    });
} catch(err) {
    return res.status(500).json({message: "Error fetching leads", error: err.message})
}

};




export const getLeadById = async(req, res) => {
    try {
        const lead = await prisma.lead.findUnique({ where: { id: req.params.id } });
        if(!lead) return res.status(404).json({ message: "Lead not found "});

        return res.json(lead);
    } catch(error) {
        return res.status(500).json({ message: "Error fetching lead", error: err.message })
    }
};




export  const updateLead = async(req, res) => {
    try {
        const lead = await prisma.lead.update({
            where: { id: req.params.id },
            data: req.body,
        });
        return res.json(lead);
    } catch(err) {
        return res.status(404).json({ message: "Lead not found or update failed "});
    }
}



export const deleteLead = async (req, res) => {
    try {
        await prisma.lead.delete({ 
            where: {
                id: req.params.id
            }
        })
        return res.status(204).json();
    } catch(err) {
        return res.status(404).json({ message: "Lead not found", error: err.message });
    }
}