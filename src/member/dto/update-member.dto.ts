import { PartialType } from '@nestjs/mapped-types';
import { AddMemberToBoardDto } from './add-member-to-board.dto';

export class UpdateMemberDto extends PartialType(AddMemberToBoardDto) {}
