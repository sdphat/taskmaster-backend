import { Prisma, PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt';

const prisma = new PrismaClient();
const saltRounds = +process.env.SALT_ROUNDS;

const userData: Prisma.UserCreateInput[] = [
  {
    fullName: 'Alice Chau',
    email: 'alicechau@gmail.com',
    avatarUrl:
      'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=',
  },
  {
    fullName: 'Harris Houston',
    email: 'harris@gmail.com',
    avatarUrl:
      'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=',
  },
  {
    fullName: 'Hamza Eaton',
    email: 'hamza@gmail.com',
    avatarUrl:
      'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=',
  },
  {
    fullName: 'Phat Sau',
    email: 'saudaiphat@gmail.com',
    avatarUrl:
      'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=',
  },
];

const credentialData: Prisma.CredentialCreateInput[] = [
  {
    password: hashSync('12345678', saltRounds),
    user: {
      connect: {
        email: 'alicechau@gmail.com',
      },
    },
  },
  {
    user: {
      connect: {
        email: 'harris@gmail.com',
      },
    },
    password: hashSync('12345678', saltRounds),
  },
  {
    user: {
      connect: {
        email: 'hamza@gmail.com',
      },
    },
    password: hashSync('12345678', saltRounds),
  },
  {
    user: {
      connect: {
        email: 'saudaiphat@gmail.com',
      },
    },
    password: hashSync('12345678', saltRounds),
  },
];

const boardData: Prisma.BoardCreateInput[] = [
  {
    name: 'Thundermail',
  },
];

const boardLabels: Prisma.BoardLabelCreateInput[] = [
  {
    Board: {
      connect: {
        id: 1,
      },
    },
    color: '#0062FF',
    name: 'Low priority',
  },
  {
    Board: {
      connect: {
        id: 1,
      },
    },
    color: '#FFC100',
    name: 'Medium priority',
  },
  {
    Board: {
      connect: {
        id: 1,
      },
    },
    color: '#FF003B',
    name: 'High priority',
  },
];

const boardMembers: Prisma.BoardMemberCreateInput[] = [
  {
    Board: {
      connect: {
        id: 1,
      },
    },
    memberRole: 'ADMIN',
    hasJoined: true,
    User: {
      connect: {
        id: 4,
      },
    },
  },
  {
    Board: {
      connect: { id: 1 },
    },
    memberRole: 'COLLABORATOR',
    hasJoined: true,
    User: {
      connect: {
        id: 1,
      },
    },
  },
  {
    Board: {
      connect: { id: 1 },
    },
    memberRole: 'COLLABORATOR',
    hasJoined: true,
    User: {
      connect: {
        id: 2,
      },
    },
  },
];

const boardColumns: Prisma.BoardColumnCreateInput[] = [
  {
    name: 'Sprint 1',
    columnIdx: 0,
    Board: {
      connect: {
        id: 1,
      },
    },
    creator: {
      connect: {
        id: 1,
      },
    },
    BoardColumnCards: {
      create: [
        {
          summary: 'Create login page',
          description:
            'Login page must include email field, password field, login button and a link to register page.',
          cardIdx: 0,
        },
        {
          summary: 'Create register page',
          description:
            'Register page must include email, full name, password field, register button and a link to login page.',
          cardIdx: 1,
        },
      ],
    },
  },
  {
    name: 'Sprint 2',
    columnIdx: 1,
    Board: {
      connect: {
        id: 1,
      },
    },
    creator: {
      connect: {
        id: 1,
      },
    },
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
];

async function main() {
  console.log(`Start seeding ...`);

  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }

  for (const c of credentialData) {
    const credential = await prisma.credential.create({ data: c });
    console.log(`Created credentail with email: ${credential.email}`);
  }

  for (const b of boardData) {
    const board = await prisma.board.create({
      data: b,
    });

    console.log(`Created board with id: ${board.id}`);
  }

  for (const l of boardLabels) {
    const label = await prisma.boardLabel.create({
      data: l,
    });
    console.log(`Created label with id: ${label.id}`);
  }

  for (const m of boardMembers) {
    const member = await prisma.boardMember.create({
      data: m,
    });
    console.log(`Created label with id: ${member.id}`);
  }

  for (const col of boardColumns) {
    const column = await prisma.boardColumn.create({
      data: col,
    });
    console.log(`Created label with id: ${column.id}`);
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
