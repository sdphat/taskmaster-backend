import { Body, Controller, Put, Request } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { Request as ExpressRequest } from 'express';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Put()
  async update(
    @Body() data: UpdateUserDto,
    @Request() request: ExpressRequest,
  ) {
    return this.usersService.update(
      { ...data, id: (request as any).user.sub },
      {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
      },
    );
  }
}
