import { Body, Controller, Delete, Post, Put, UseGuards } from '@nestjs/common';
import { AddMemberToBoardDto } from './dto/add-member-to-board.dto';
import { AddMemberToCardDto } from './dto/add-member-to-card.dto';
import { RemoveMemberFromBoardDto } from './dto/remove-member-from-board.dto';
import { RemoveMemberFromCardDto } from './dto/remove-member-from-card.dto';
import { MemberService } from './member.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ChangeMemberRoleDto } from './dto/change-member-role.dto';
import { Public } from '../auth/decorators/public.decorator';
import { InvitationDto } from './dto/invitation.dto';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @UseGuards(RolesGuard)
  @Roles(['ADMIN'])
  @Post('board')
  addToBoard(@Body() addMemberDto: AddMemberToBoardDto) {
    return this.memberService.addMemberToBoard(addMemberDto);
  }

  @UseGuards(RolesGuard)
  @Roles(['ADMIN'])
  @Delete('board')
  removeFromBoard(@Body() removeMemberDto: RemoveMemberFromBoardDto) {
    return this.memberService.removeMemberFromBoard(
      removeMemberDto.boardId,
      removeMemberDto.memberUserId,
    );
  }

  @Public()
  @Post('board/invitation')
  handleInvitation(@Body() invitationDto: InvitationDto) {
    return this.memberService.handleInvitation(invitationDto);
  }

  @UseGuards(RolesGuard)
  @Roles(['ADMIN'])
  @Put('board/role')
  changeMemberRole(@Body() changeMemberRoleDto: ChangeMemberRoleDto) {
    return this.memberService.changeMemberRole(changeMemberRoleDto);
  }

  @UseGuards(RolesGuard)
  @Roles(['ADMIN', 'COLLABORATOR'])
  @Post('card')
  addToCard(@Body() addMemberDto: AddMemberToCardDto) {
    return this.memberService.addMemberToCard(
      addMemberDto.cardId,
      addMemberDto.memberId,
    );
  }

  @UseGuards(RolesGuard)
  @Roles(['ADMIN', 'COLLABORATOR'])
  @Delete('card')
  removeFromCard(@Body() removeMemberDto: RemoveMemberFromCardDto) {
    return this.memberService.removeMemberFromCard(
      removeMemberDto.cardId,
      removeMemberDto.memberId,
    );
  }
}
