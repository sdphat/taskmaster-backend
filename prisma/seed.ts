import { Prisma, PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt';

const prisma = new PrismaClient();
const saltRounds = +process.env.SALT_ROUNDS;

const userData: Prisma.UserCreateInput[] = [
  {
    fullName: 'Alice Chau',
    email: 'alicechau@gmail.com',
    password: hashSync('12345678', saltRounds),
    avatarUrl:
      'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=',
  },
  {
    fullName: 'Harris Houston',
    email: 'harris@gmail.com',
    password: hashSync('12345678', saltRounds),
    avatarUrl:
      'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=',
  },
  {
    fullName: 'Hamza Eaton',
    email: 'hamza@gmail.com',
    password: hashSync('12345678', saltRounds),
    avatarUrl:
      'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=',
  },
  {
    fullName: 'Phat Sau',
    email: 'saudaiphat@gmail.com',
    password: hashSync('12345678', saltRounds),
    avatarUrl:
      'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=',
  },
];

const boardData: Prisma.BoardCreateInput[] = [
  {
    name: 'Thundermail',
    backgroundUrl:
      'https://st3.depositphotos.com/3271841/13147/i/450/depositphotos_131477174-stock-photo-simple-colorful-gradient-light-blurred.jpg',
    BoardLabels: {
      create: [
        {
          color: '#0062FF',
          name: 'Low priority',
        },
        {
          color: '#FFC100',
          name: 'Medium priority',
        },
        {
          color: '#FF003B',
          name: 'High priority',
        },
      ],
    },
    BoardMembers: {
      create: [
        {
          memberRole: 'ADMIN',
          User: {
            connect: {
              id: 4,
            },
          },
        },
        {
          memberRole: 'COLLABORATOR',
          User: {
            connect: {
              id: 1,
            },
          },
        },
        {
          memberRole: 'COLLABORATOR',
          User: {
            connect: {
              id: 2,
            },
          },
        },
      ],
    },
    BoardColumns: {
      create: [
        {
          name: 'Sprint 1',
          columnIdx: 0,
          BoardColumnCards: {
            create: [
              {
                summary: 'Create login page',
                description:
                  'Login page must include email field, password field, login button and a link to register page.',
                dueDate: new Date(2023, 10, 20),
                cardIdx: 0,
              },
              {
                summary: 'Create register page',
                description:
                  'Register page must include email, full name, password field, register button and a link to login page.',
                dueDate: new Date(2023, 10, 22),
                cardIdx: 1,
              },
            ],
          },
        },
        {
          name: 'Sprint 2',
          columnIdx: 1,
          BoardColumnCards: {
            create: [
              {
                summary: 'Support login with google',
                description: 'Support login with google',
                cardIdx: 0,
                Labels: {
                  connect: [
                    {
                      id: 1,
                    },
                    {
                      id: 2,
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
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

  for (const b of boardData) {
    const board = await prisma.board.create({
      data: b,
    });

    console.log(`Created board with id: ${board.id}`);
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
