import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  const adminEmail = "admin@gmail.com"
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } })

  if (!existing) {
    const hashed = await bcrypt.hash("123456", 10)

    // Create a default Tenant for admin
    const tenant = await prisma.tenant.create({
      data: { name: "Default Clinic" },
    })

    await prisma.user.create({
      data: {
        fullName: "Super Admin",
        email: adminEmail,
        password: hashed,
        role: "ADMIN",
        tenantId: tenant.id,
      },
    })

    console.log("✅ Admin user created:", adminEmail)
  } else {
    console.log("⚡ Admin already exists")
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
