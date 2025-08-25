import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding users...");
  const users = [];

  // Create 100 users
  for (let i = 1; i <= 100; i++) {
    const email = `user${i}@test.com`;
    const password = await bcrypt.hash("password123", 10);

    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword: password,
      },
    });

    users.push(user);
  }
  console.log("✅ 100 users created.");

  console.log("🌱 Seeding leads...");
  const sources = ["website", "facebook_ads", "google_ads", "referral", "events", "other"];
  const statuses = ["new", "contacted", "qualified", "lost", "won"];

  // Create 100 leads and assign each to a random user
  for (let i = 1; i <= 100; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)]; // pick a random user

    await prisma.lead.create({
      data: {
        firstName: `First${i}`,
        lastName: `Last${i}`,
        email: `lead${i}@example.com`,
        phone: `+1-555-000${i}`,
        company: `Company${i}`,
        city: `City${i}`,
        state: `State${i}`,
        source: sources[Math.floor(Math.random() * sources.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        score: Math.floor(Math.random() * 100),
        leadValue: parseFloat((Math.random() * 10000).toFixed(2)),
        lastActivityAt: Math.random() > 0.3 ? new Date() : null,
        isQualified: Math.random() > 0.5,
        userId: randomUser.id, // <-- assign lead to user
      },
    });
  }

  console.log("✅ 100 leads created with user relation.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seeding complete.");
  })
  .catch(async (e) => {
    console.error("Seeding failed", e);
    await prisma.$disconnect();
    process.exit(1);
  });
