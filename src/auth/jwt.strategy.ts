import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserJwtPayload } from 'src/user/interface/user.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: UserJwtPayload) {
    const user = await this.userService.findUserByEmail(payload._id);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
