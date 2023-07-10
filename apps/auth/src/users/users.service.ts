import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    await this.validateCreateUserRequest(createUserDto);
    return this.usersRepository.save({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });
  }

  private async validateCreateUserRequest(createUserDto: CreateUserDto) {
    let user: User;
    try {
      user = await this.usersRepository.findOneBy({
        email: createUserDto.email,
      });
    } catch (err) {}

    if (user) {
      throw new UnprocessableEntityException('Email already exists.');
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOneBy({ email: email });
    if (user) {
      const passwordIsValid = await bcrypt.compare(password, user.password);
      if (!passwordIsValid) {
        throw new UnauthorizedException('Credentials are not valid.');
      }
      return user;
    }
    throw new UnauthorizedException('Credentials are not valid.');
  }

  async getUser(id: number) {
    return this.usersRepository.findOneBy({ id: id });
  }
}
