import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    try {
      const userExists = await this.findOneByUsername(createUserDto.username);
      if (userExists) {
        throw new HttpException(
          `User with username: ${createUserDto.username} already exists!`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const user = this.userRepo.create(createUserDto);

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
      user.password = hashedPassword;

      const updatedUser = await this.userRepo.save(user);
      return updatedUser;
    } catch (ex) {
      if (ex instanceof HttpException) {
        throw ex;
      }
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserWithBalance(id: string): Promise<User> {
    const user = await this.findUserWithBalance(id);
    if (!user) {
      throw new HttpException(
        `User with id : ${id} not found!`,
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async getUserDetails(username: string): Promise<User> {
    const user = await this.findOneByUsername(username);
    if (!user) {
      throw new HttpException(
        `User with username : ${username} not found!`,
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  private async findOneByUsername(username: string): Promise<User | null> {
    return await this.userRepo.findOne({
      where: { username },
    });
  }

  private async findUserWithPassword(id: string): Promise<User | null> {
    return this.userRepo
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .addSelect('user.password')
      .getOne();
  }

  async findUserWithPasswordByUsername(username: string): Promise<User | null> {
    return this.userRepo
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .addSelect('user.password')
      .getOne();
  }

  private async findUserWithBalance(id: string): Promise<User | null> {
    return this.userRepo
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .addSelect('user.walletBalance')
      .getOne();
  }

  private async findOne(id: string): Promise<User | null> {
    return await this.userRepo.findOne({
      where: { id },
    });
  }

  private async findAll(): Promise<User[] | null> {
    return await this.userRepo.find({});
  }

  private async delete(id: string): Promise<UpdateResult> {
    return await this.userRepo.softDelete(id);
  }
}
