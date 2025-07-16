import { Role } from 'src/utils/enum';
import { PrismaClient } from '../src/generated/client';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
const config = new ConfigService();
const prisma = new PrismaClient();
async function main() {
  const userRole = await prisma.role.create({ data: { name: Role.USER } });
  const adminRole = await prisma.role.create({ data: { name: Role.ADMIN } });
  const passwordHash = await argon.hash(config.get('ADMIN_PASSWORD') as string);
  const createAdmin = await prisma.user.create({
    data: {
      firstName: 'labeille',
      lastName: 'coule',
      email: 'labellecouille@gmail.com',
      username: 'maya',
      roleId: adminRole.id,
      password: passwordHash,
      isActive: true,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
