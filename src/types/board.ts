import { BoardRole } from '@prisma/client';

export class Board {
  id: number;
  name: string;
  background?: Attachment;
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
  Labels: Label[];
  summary: string;
  BoardColumnCardMembers: BoardColumnCardMember[];
  Attachments: Attachment[];
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

export class Attachment {
  id: number;
  url: string;
  name: string;
  type: string;
}
