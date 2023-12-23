import { BoardRole } from '@prisma/client';

export class Board {
  id: number;
  name: string;
  backgroundUrl: string;
  BoardColumns: BoardColumn[];
  BoardLabels: Label[];
  BoardMembers: BoardMember[];
}

export class BoardColumn {
  name: string;
  id: number;
  BoardColumnCards: BoardColumnCard[];
}

export class BoardColumnCard {
  id: number;
  cardIdx: number;
  Comments: Comment[];
  description: string;
  dueDate: null | Date;
  Labels: Label[];
  summary: string;
  BoardColumnCardMembers: BoardColumnCardMember[];
}

export class Comment {
  id: number;
  content: string;
  createdDate: Date;
  Creator: BoardMember;
}

export class Label {
  id: number;
  name: string;
  color: string;
  boardId: number;
}

export class BoardMember {
  id: number;
  User: User;
  memberRole: BoardRole;
}

export class User {
  id: number;
  email: string;
  fullName: string;
  avatarUrl: string;
}

export class BoardColumnCardMember {
  boardMemberId: number;
  Member: BoardMember;
}
