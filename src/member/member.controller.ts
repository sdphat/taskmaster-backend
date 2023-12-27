import { Body, Controller, Delete, Post, Put, UseGuards } from '@nestjs/common';
import { AddMemberToBoardDto } from './dto/add-member-to-board.dto';
import { AddMemberToCardDto } from './dto/add-member-to-card.dto';
import { RemoveMemberFromBoardDto } from './dto/remove-member-from-board.dto';
import { RemoveMemberFromCardDto } from './dto/remove-member-from-card.dto';
import { MemberService } from './member.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ChangeMemberRoleDto } from './dto/change-member-role.dto';

@UseGuards(RolesGuard)
@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Roles(['ADMIN'])
  @Post('board')
  addToBoard(@Body() addMemberDto: AddMemberToBoardDto) {
    return this.memberService.addMemberToBoard(addMemberDto);
  }

  @Roles(['ADMIN'])
  @Delete('board')
  removeFromBoard(@Body() removeMemberDto: RemoveMemberFromBoardDto) {
    return this.memberService.removeMemberFromBoard(
      removeMemberDto.boardId,
      removeMemberDto.memberUserId,
    );
  }

  @Roles(['ADMIN'])
  @Put('board/role')
  changeMemberRole(@Body() changeMemberRoleDto: ChangeMemberRoleDto) {
    return this.memberService.changeMemberRole(changeMemberRoleDto);
  }

  @Roles(['ADMIN', 'COLLABORATOR'])
  @Post('card')
  addToCard(@Body() addMemberDto: AddMemberToCardDto) {
    return this.memberService.addMemberToCard(
      addMemberDto.cardId,
      addMemberDto.memberId,
    );
  }

  @Roles(['ADMIN', 'COLLABORATOR'])
  @Delete('card')
  removeFromCard(@Body() removeMemberDto: RemoveMemberFromCardDto) {
    return this.memberService.removeMemberFromCard(
      removeMemberDto.cardId,
      removeMemberDto.memberId,
    );
  }
}
