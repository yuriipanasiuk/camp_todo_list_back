import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UserCredentialDto } from './dto/credential.user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RefreshDto } from './dto/refresh.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  register(@Body() dto: CreateUserDto) {
    return this.userService.singUp(dto);
  }

  @Post('/signin')
  login(@Body() dto: UserCredentialDto) {
    return this.userService.singIn(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/logout')
  logout(@Request() req: any) {
    this.userService.logOut(req.user);
  }

  @Post('/refresh')
  refreshToken(@Body() dto: RefreshDto) {
    return this.userService.refresh(dto);
  }
}
