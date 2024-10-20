import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  /**
   * Registers a new user in the system.
   *
   * @param {CreateUserDto} createUserDto - Data transfer object containing the details of the user to be created.
   * @returns {Promise<Partial<User>>} - A promise that resolves to the newly created user's details, excluding the password.
   * @throws {HttpException} - Throws an exception if the user already exists or if there is a server error.
   */

  async register(createUserDto: CreateUserDto): Promise<Partial<User>> {
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
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

  /**
   * Retrieves a user along with their balance by user ID.
   *
   * @param {string} id - The ID of the user to retrieve.
   * @returns {Promise<User>} - A promise that resolves to the user entity, including their balance.
   * @throws {HttpException} - Throws an exception if the user is not found or there is a server error.
   */

  async getUserWithBalance(
    id: string,
  ): Promise<Omit<User, 'sentTransfers' | 'receivedTransfers' | 'password'>> {
    // Check if the user is in the cache and the cache is not expired
    const cachedUser:
      | Omit<User, 'sentTransfers' | 'receivedTransfers' | 'password'>
      | undefined = await this.cacheManager.get(id);

    if (cachedUser) {
      return cachedUser as Omit<
        User,
        'sentTransfers' | 'receivedTransfers' | 'password'
      >;
    }

    // Get from DB if user not in cache
    const user = await this.findUserWithBalance(id);
    if (!user) {
      throw new HttpException(
        `User with id : ${id} not found!`,
        HttpStatus.NOT_FOUND,
      );
    }
    // Set user with balance in cache
    await this.cacheManager.set(id, user, 30 * 60 * 1000);
    return user;
  }

  /**
   * Retrieves the details of a user by username.
   *
   * @param {string} username - The username of the user to retrieve.
   * @returns {Promise<User>} - A promise that resolves to the user entity.
   * @throws {HttpException} - Throws an exception if the user is not found or there is a server error.
   */

  async getUserDetails(
    username: string,
  ): Promise<
    Omit<User, 'sentTransfers' | 'receivedTransfers' | 'balance' | 'password'>
  > {
    const user = await this.findOneByUsername(username);
    if (!user) {
      throw new HttpException(
        `User with username : ${username} not found!`,
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  /**
   * Finds a user by their username.
   *
   * @param {string} username - The username of the user to find.
   * @returns {Promise<User | null>} - A promise that resolves to the user entity if found, or null if not found.
   * @private
   */

  private async findOneByUsername(username: string): Promise<User | null> {
    return await this.userRepo.findOne({
      where: { username },
    });
  }

  /**
   * Finds a user by their username and includes their password in the result.
   *
   * @param {string} username - The username of the user to find.
   * @returns {Promise<User | null>} - A promise that resolves to the user entity with the password, or null if not found.
   */

  async findUserWithPasswordByUsername(username: string): Promise<User | null> {
    return this.userRepo
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .addSelect('user.password')
      .getOne();
  }

  /**
   * Finds a user by their ID and includes their balance in the result.
   *
   * @param {string} id - The ID of the user to find.
   * @returns {Promise<User | null>} - A promise that resolves to the user entity with the balance, or null if not found.
   * @private
   */

  private async findUserWithBalance(id: string): Promise<User | null> {
    return (
      this.userRepo
        .createQueryBuilder('user')
        //   .leftJoinAndSelect('user.sentTransfers', 'sentTransfers')
        //   .leftJoinAndSelect('user.receivedTransfers', 'receivedTransfers')
        .where('user.id = :id', { id })
        .addSelect('user.balance')
        .getOne()
    );
  }
}
