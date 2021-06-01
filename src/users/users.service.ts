import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.create(createUserDto);
    const results = await this.usersRepository.save(user);
    return results;
  }

  async findAll(page: number, limit: number) {
    const users = await paginate<User>(this.usersRepository, {
      page,
      limit,
      route: process.env.API_PATH + '/users',
    });
    return users;
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne(id);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne(id);
    this.usersRepository.merge(user, updateUserDto);
    const results = await this.usersRepository.save(user);
    return results;
  }

  async remove(id: number) {
    const results = await this.usersRepository.delete(id);
    return results;
  }
}
