import { Prisma, PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt';

const prisma = new PrismaClient();
const saltRounds = +process.env.SALT_ROUNDS;

const userData: Prisma.UserCreateInput[] = [
  {
    fullName: 'Alice Chau',
    email: 'alicechau@gmail.com',
    password: hashSync('12345678', saltRounds),
  },
  {
    fullName: 'Harris Houston',
    email: 'harris@gmail.com',
    password: hashSync('12345678', saltRounds),
  },
  {
    fullName: 'Hamza Eaton',
    email: 'hamza@gmail.com',
    password: hashSync('12345678', saltRounds),
  },
  {
    fullName: 'Phat Sau',
    email: 'saudaiphat@gmail.com',
    password: hashSync('12345678', saltRounds),
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }
  console.log(`Seeding finished.`);
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
