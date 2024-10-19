import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transfer } from 'src/entities/transfer.entity';
import { Connection, Repository } from 'typeorm';
import {
  IncrementBalanceDto,
  InitiateTransferDto,
} from './dtos/initiate-transfer.dto';
import { User } from 'src/entities/user.entity';
import { GetTransfersQueryDto } from './dtos/get-transfer-query.dto';
import { TransferTypeEnum } from './enum/transfer.enum';

interface TransferQueryConditions {
  otherPartyUsername?: string;
  date?: string;
  minimumAmount?: number;
  maximumAmount?: number;
  startDate?: string;
  endDate?: string;
}

@Injectable()
export class TransferService {
  constructor(
    @InjectRepository(Transfer) private transferRepo: Repository<Transfer>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly connection: Connection,
  ) {}

  /**
   * Initiates a transfer between the sender and the recipient using typeorm's transaction manager.
   *
   * @param {string} senderUsername - The username of the sender.
   * @param {InitiateTransferDto} initiateTransferDto - DTO containing transfer details.
   *
   * @returns {Promise<Transfer>} - A promise that resolves to the initiated transfer details.
   *
   * @throws {HttpException} - Throws an exception if there is insufficient balance, or if the sender and recipient are the same user or if the sender or receiver is not found or an internal error occurs.
   */

  async initiateTransfer(
    senderUsername: string,
    initiateTransferDto: InitiateTransferDto,
  ): Promise<Transfer> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { recipientUsername, amount } = initiateTransferDto;
      const sender = await queryRunner.manager
        .createQueryBuilder(User, 'user')
        .addSelect('user.balance')
        .where('user.username = :senderUsername', { senderUsername })
        .setLock('pessimistic_write')
        .getOne();
      const receiver = await queryRunner.manager
        .createQueryBuilder(User, 'user')
        .addSelect('user.balance')
        .where('user.username = :recipientUsername', { recipientUsername })
        .setLock('pessimistic_write')
        .getOne();

      if (!sender || !receiver) {
        throw new HttpException(
          'Sender or receiver not found!',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (senderUsername.toLowerCase() === recipientUsername.toLowerCase()) {
        throw new HttpException(
          'User cannot send to self!',
          HttpStatus.BAD_REQUEST,
        );
      }
      console.log('bal:', sender.balance);
      console.log('amt:', amount);
      if (sender.balance <= amount) {
        throw new HttpException('Insufficient amount!', HttpStatus.BAD_REQUEST);
      }

      sender.balance -= amount;
      await queryRunner.manager.save(sender);

      receiver.balance += amount;
      await queryRunner.manager.save(receiver);

      const transfer = queryRunner.manager.create(Transfer, {
        sender,
        receiver,
        amount,
      });
      await queryRunner.manager.save(transfer);
      await queryRunner.commitTransaction();

      return transfer;
    } catch (ex) {
      await queryRunner.rollbackTransaction();
      if (ex instanceof HttpException) {
        throw ex;
      }
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release(); // Ensure resources are released
    }
  }

  /**
   * Increments the balance of a user by a given amount.
   *
   * @param {string} userId - The ID of the user.
   * @param {IncrementBalanceDto} incrementBalanceDto - DTO containing the amount to increment.
   *
   * @returns {Promise<User>} - A promise that resolves to the updated user details.
   *
   * @throws {HttpException} - Throws an exception if the user is not found or an internal error occurs.
   */

  async incrementBalance(
    userId: string,
    incrementBalanceDto: IncrementBalanceDto,
  ): Promise<User> {
    try {
      const { amount } = incrementBalanceDto;
      const user = await this.userRepo
        .createQueryBuilder('user')
        .addSelect('user.balance')
        .where('user.id = :userId', { userId })
        .getOne();
      if (!user) {
        throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
      }
      console.log(user);
      user.balance += amount;
      return await this.userRepo.save(user);
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
   * Retrieves paginated transfer records for a user based on query conditions.
   *
   * @param {string} userId - The ID of the user making the request.
   * @param {GetTransfersQueryDto} getTransfersQueryDto - DTO containing query parameters such as page, limit, date range, and other filtering options.
   *
   * @returns {Promise<{ transfers: Transfer[], total: number, currentPage: number, totalPages: number }>} - A promise that resolves to a paginated list of transfers and associated metadata.
   *
   * @throws {HttpException} - Throws an exception if an internal error occurs.
   */

  async getTransfers(
    userId: string,
    getTransfersQueryDto: GetTransfersQueryDto,
  ): Promise<{
    transfers: Transfer[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    try {
      const {
        page,
        limit,
        otherPartyUsername,
        minimumAmount,
        maximumAmount,
        startDate,
        endDate,
        type,
      } = getTransfersQueryDto;
      const queryBuilder = this.transferRepo
        .createQueryBuilder('transfer')
        .leftJoinAndSelect('transfer.sender', 'sender')
        .leftJoinAndSelect('transfer.receiver', 'receiver');

      // Base condition to find transfers related to the user
      if (type === TransferTypeEnum.SENT) {
        queryBuilder.where('sender.id = :userId', { userId });
      } else if (type === TransferTypeEnum.RECEIVED) {
        queryBuilder.where('receiver.id = :userId', { userId });
      } else {
        queryBuilder.where('sender.id = :userId OR receiver.id = :userId', {
          userId,
        });
      }
      // Dynamic query conditions
      const queryConditions: TransferQueryConditions = {};

      // Add conditions based on provided parameters
      if (otherPartyUsername) {
        queryConditions['otherPartyUsername'] = otherPartyUsername;
        queryBuilder.andWhere(
          '(sender.username = :otherPartyUsername OR receiver.username = :otherPartyUsername)',
          { otherPartyUsername },
        );
      }

      if (minimumAmount) {
        queryConditions['minimumAmount'] = minimumAmount;
        queryBuilder.andWhere('transfer.amount >= :minimumAmount', {
          minimumAmount,
        });
      }

      if (maximumAmount) {
        queryConditions['maximumAmount'] = maximumAmount;
        queryBuilder.andWhere('transfer.amount <= :maximumAmount', {
          maximumAmount,
        });
      }

      if (startDate && endDate) {
        queryConditions['startDate'] = startDate;
        queryConditions['endDate'] = endDate;
        queryBuilder.andWhere(
          'DATE(transfer.createdAt) BETWEEN :startDate AND :endDate',
          {
            startDate,
            endDate,
          },
        );
      } else if (startDate) {
        queryConditions['startDate'] = startDate;
        queryBuilder.andWhere('DATE(transfer.createdAt) >= :startDate', {
          startDate,
        });
      } else if (endDate) {
        queryConditions['endDate'] = endDate;
        queryBuilder.andWhere('DATE(transfer.createdAt) <= :endDate', {
          endDate,
        });
      }

      // Pagination and ordering
      const [transfers, total] = await queryBuilder
        .skip((page! - 1) * limit!)
        .take(limit)
        .orderBy('transfer.createdAt', 'DESC')
        .getManyAndCount();

      return {
        transfers,
        total,
        currentPage: page!,
        totalPages: Math.ceil(total / limit!),
      };
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
}
