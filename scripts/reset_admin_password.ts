import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

async function main() {
  const [email, password] = process.argv.slice(2);
  if (!email || !password) {
    console.error("Usage: npm run reset-admin-password -- <email> <password>");
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 12);
  await db.adminUser.upsert({
    where: { email },
    update: { password_hash: hash },
    create: { email, password_hash: hash },
  });

  console.log("Admin password set for", email);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
