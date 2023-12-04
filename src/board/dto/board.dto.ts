import { Board, BoardColumn, BoardMember, Label } from '../../types/board';

export class BoardDto extends Board {
  id: number;
  name: string;
  BoardColumns: BoardColumn[];
  BoardLabels: Label[];
  BoardMembers: BoardMember[];
}
