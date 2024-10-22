import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from './dtos/AuthPayload.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Localhost } from 'src/schemas/Localhost.schema';
import { Model } from 'mongoose';
import { comparePasswords } from 'src/utils/bcrypt';

const fakeUsers = [
  {
    id: 1,
    email: 'anson',
    password: 'password',
  },
  {
    id: 2,
    email: 'jack',
    password: 'password123',
  },
];

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Localhost.name) private localhostModel: Model<Localhost>,
  ) {}

  async validateUser(authPayloadDto: AuthPayloadDto) {
    const user = await this.localhostModel.findOne({
      email: authPayloadDto.email,
    });

    if (user) {
      if (user?.code_verified) {
        const matchPasswords = comparePasswords(
          authPayloadDto.password,
          user.password,
        );
        if (matchPasswords) {
          const payload = {
            email: user.email,
            id: user._id,
            verified: user.code_verified,
            userRole: 'localhost',
          };
          const accessToken = this.jwtService.sign(payload);
          return { token: accessToken };
        } else {
          return null;
        }
      } else if (!user?.code_verified) {
        return 'Email is not verified!';
      }
    }

    return null;
  }
}
