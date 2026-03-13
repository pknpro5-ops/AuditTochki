import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hash = await bcrypt.hash('admin007', 10)
  await prisma.user.upsert({
    where: { email: 'pro@mitinvlad.ru' },
    update: { passwordHash: hash, role: 'ADMIN' },
    create: { email: 'pro@mitinvlad.ru', passwordHash: hash, role: 'ADMIN' },
  })
  console.log('Admin seeded: pro@mitinvlad.ru')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
