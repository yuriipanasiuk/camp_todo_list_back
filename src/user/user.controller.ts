import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create.user.dto';
import { IUser } from './interface/user.interface';
import { UserCredentialDto } from './dto/credential.user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  register(@Body() dto: CreateUserDto): Promise<IUser> {
    return this.userService.singUp(dto);
  }

  @Post('/signin')
  login(@Body() dto: UserCredentialDto): Promise<{ accessToken: string }> {
    return this.userService.singIn(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/logout')
  logout(@Request() req: any) {
    this.userService.logOut(req.user);
  }
}
