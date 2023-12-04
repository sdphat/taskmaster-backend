export class Board {
  id: number;
  name: string;
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
  Members: any[];
  summary: string;
}

export class Comment {
  id: number;
  content: string;
  creatorId: number;
  boardColumnCardId: number;
}

export class Label {
  id: number;
  name: string;
  color: string;
  boardId: number;
  boardColumnCardId: number | null;
}

export class BoardMember {
  Member: Member;
  memberRole: string;
  memberId: number;
}

export class Member {
  id: number;
  email: string;
  fullName: string;
}
