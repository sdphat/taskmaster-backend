import { Body, Controller, Delete, Post } from '@nestjs/common';
import { AddMemberToBoardDto } from './dto/add-member-to-board.dto';
import { AddMemberToCardDto } from './dto/add-member-to-card.dto';
import { RemoveMemberFromBoardDto } from './dto/remove-member-from-board.dto';
import { RemoveMemberFromCardDto } from './dto/remove-member-from-card.dto';
import { MemberService } from './member.service';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post('board')
  addToBoard(@Body() addMemberDto: AddMemberToBoardDto) {
    return this.memberService.addMemberToBoard(addMemberDto);
  }

  @Delete('board')
  removeFromBoard(@Body() removeMemberDto: RemoveMemberFromBoardDto) {
    return this.memberService.removeMemberFromBoard(
      removeMemberDto.boardId,
      removeMemberDto.memberUserId,
    );
  }

  @Post('card')
  addToCard(@Body() addMemberDto: AddMemberToCardDto) {
    return this.memberService.addMemberToCard(
      addMemberDto.cardId,
      addMemberDto.memberId,
    );
  }

  @Delete('card')
  removeFromCard(@Body() removeMemberDto: RemoveMemberFromCardDto) {
    return this.memberService.removeMemberFromCard(
      removeMemberDto.cardId,
      removeMemberDto.memberId,
    );
  }
}
