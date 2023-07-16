import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { IUser } from './interface/user.interface';
import { CreateUserDto } from './dto/create.user.dto';
import { User } from './schemas/user.schema';
import { UserPayloadDto } from './dto/payload.user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserCredentialDto } from './dto/credential.user.dto';

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

  async singIn(dto: UserCredentialDto): Promise<{ accessToken: string }> {
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
    const payload: UserPayloadDto = { email, id };
    const accessToken: string = this.jwtService.sign(payload);
    await this.userModel.findByIdAndUpdate(user._id, { accessToken });

    return { accessToken };
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    return this.userModel.findOne({ email });
  }

  async logOut(user: IUser) {
    await this.userModel.findByIdAndUpdate(user.id, { accessToken: '' });
  }
}
