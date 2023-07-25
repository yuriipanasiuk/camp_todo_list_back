import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IPayload, IRefresh, IUser } from './interface/user.interface';
import { CreateUserDto } from './dto/create.user.dto';
import { User } from './schemas/user.schema';
import { UserPayloadDto } from './dto/payload.user.dto';
import { UserCredentialDto } from './dto/credential.user.dto';
import { LoginResponseDto } from './dto/login.response.dto';
import { RefreshDto } from './dto/refresh.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: mongoose.Model<User>,
    private jwtService: JwtService,
  ) {}

  async singUp(dto: CreateUserDto): Promise<IUser> {
    const { name, email } = dto;
    const findUser = await this.userModel.findOne({ email });

    if (findUser) {
      throw new ConflictException('User email in use!');
    }

    const hash = await bcrypt.hash(dto.password, 10);

    const user = await this.userModel.create({
      name,
      email,
      password: hash,
    });

    return user.save();
  }

  async singIn(dto: UserCredentialDto): Promise<LoginResponseDto> {
    const email: string = dto.email;
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException(
        'Incorrect login or password credentials!',
      );
    }

    const comparePassword = await bcrypt.compare(dto.password, user.password);

    if (!comparePassword) {
      throw new UnauthorizedException(
        'Incorrect login or password credentials!',
      );
    }

    const id = user._id.toString();
    const payload: UserPayloadDto = { _id: id };
    const accessToken: string = this.jwtService.sign(payload);
    const refreshToken: string = this.jwtService.sign(payload, {
      expiresIn: '7h',
    });

    await this.userModel.findByIdAndUpdate(user._id, {
      accessToken,
      refreshToken,
    });

    const response = {
      name: user.name,
      email: user.email,
      accessToken,
      refreshToken,
    };

    return response;
  }

  async findUserById(_id: string): Promise<IUser> {
    return this.userModel.findOne({ _id });
  }

  async logOut(user: IUser) {
    await this.userModel.findByIdAndUpdate(user.id, {
      accessToken: '',
      refreshToken: '',
    });
  }

  async refresh(dto: RefreshDto): Promise<IRefresh> {
    const { refreshToken: token } = dto;

    const user = await this.userModel.findOne({ refreshToken: token });

    if (!user) {
      throw new ForbiddenException('Token invalid');
    }

    const id = user._id.toString();
    const payload: IPayload = { _id: id };
    const accessToken: string = this.jwtService.sign(payload);
    const refreshToken: string = this.jwtService.sign(payload, {
      expiresIn: '7h',
    });

    await this.userModel.findByIdAndUpdate(id, {
      accessToken,
      refreshToken,
    });

    return { accessToken, refreshToken };
  }
}
