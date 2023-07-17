import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { User } from './users/entities/user.entity';
import { CreateUserDto } from './users/dto/create-user.dto';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { UsersService } from './users/users.service';

export interface TokenPayload {
  userId: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly elasticsearchService: ElasticsearchService,
    private readonly usersService: UsersService,
  ) {}

  async login(user: User, response: Response) {
    const tokenPayload: TokenPayload = {
      userId: user.id.toString(),
    };

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );

    const token = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });
  }

  async signup(createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);
    await this.elasticsearchService.index({
      index: 'users_index',
      body: createUserDto,
    });
    return user;
  }

  logout(response: Response) {
    response.cookie('Authentication', '', {
      httpOnly: true,
      expires: new Date(),
    });
  }
}
