import { Test, TestingModule } from '@nestjs/testing';
import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import {
  InitiateTransferDto,
  IncrementBalanceDto,
} from './dtos/initiate-transfer.dto';
import { GetTransfersQueryDto } from './dtos/get-transfer-query.dto';

// Mock the TransferService
const mockTransferService = {
  initiateTransfer: jest.fn(),
  incrementBalance: jest.fn(),
  getTransfers: jest.fn(),
};

describe('TransferController', () => {
  let controller: TransferController;
  let transferService: TransferService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransferController],
      providers: [
        {
          provide: TransferService,
          useValue: mockTransferService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard) // Mock JwtAuthGuard to bypass it in tests
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    controller = module.get<TransferController>(TransferController);
    transferService = module.get<TransferService>(TransferService);
  });

  // Test for the initiateTransfer method
  describe('initiateTransfer', () => {
    it('should initiate a transfer and return status 201 with success message', async () => {
      const mockReq = { user: { username: 'testuser' } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const initiateTransferDto: InitiateTransferDto = {
        amount: 100,
        recipientUsername: 'recipientuser',
      };

      mockTransferService.initiateTransfer.mockResolvedValue({
        id: 'transfer1',
        amount: 100,
        recipient: {},
        sender: {},
        createdAt: new Date('2024-10-19T11:55:57.203Z'),
        updatedAt: new Date('2024-10-19T11:55:57.203Z'),
        deletedAt: null,
      });

      await controller.initiateTransfer(
        initiateTransferDto,
        mockReq,
        mockRes as unknown as Response,
      );

      expect(mockTransferService.initiateTransfer).toHaveBeenCalledWith(
        'testuser',
        initiateTransferDto,
      );
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Transfer initiated successfully!',
        data: {
          id: 'transfer1',
          amount: 100,
          recipient: {},
          sender: {},
          createdAt: new Date('2024-10-19T11:55:57.203Z'),
          updatedAt: new Date('2024-10-19T11:55:57.203Z'),
          deletedAt: null,
        },
      });
    });
  });

  // Test for the incrementBalance method
  describe('incrementBalance', () => {
    it('should increment the user balance and return status 200 with success message', async () => {
      const mockReq = { user: { id: 'user1' } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const incrementBalanceDto: IncrementBalanceDto = { amount: 500 };

      mockTransferService.incrementBalance.mockResolvedValue({
        id: 'user1',
        username: 'testuser',
        balance: 1500,
        createdAt: new Date('2024-10-19T11:55:57.203Z'),
        updatedAt: new Date('2024-10-19T11:55:57.203Z'),
        deletedAt: null,
      });

      await controller.incrementBalance(
        incrementBalanceDto,
        mockReq,
        mockRes as unknown as Response,
      );

      expect(mockTransferService.incrementBalance).toHaveBeenCalledWith(
        'user1',
        incrementBalanceDto,
      );
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Balance incremented successfully!',
        data: {
          id: 'user1',
          username: 'testuser',
          balance: 1500,
          createdAt: new Date('2024-10-19T11:55:57.203Z'),
          updatedAt: new Date('2024-10-19T11:55:57.203Z'),
          deletedAt: null,
        },
      });
    });
  });

  // Test for the getTransfers method
  describe('getTransfers', () => {
    it('should retrieve a paginated list of transfers and return status 200 with success message', async () => {
      const mockReq = { user: { id: 'user1' } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const getTransfersQueryDto: GetTransfersQueryDto = { page: 1, limit: 10 };

      mockTransferService.getTransfers.mockResolvedValue({
        transfers: [
          {
            id: 'transfer1',
            amount: 100,
            recipient: {},
            sender: {},
            createdAt: new Date('2024-10-19T11:55:57.203Z'),
            updatedAt: new Date('2024-10-19T11:55:57.203Z'),
            deletedAt: null,
          },
        ],
        total: 1,
        currentPage: 1,
        totalPages: 1,
      });

      await controller.getTransfers(
        getTransfersQueryDto,
        mockReq,
        mockRes as unknown as Response,
      );

      expect(mockTransferService.getTransfers).toHaveBeenCalledWith(
        'user1',
        getTransfersQueryDto,
      );
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Transfers retrieved successfully!',
        currentPage: 1,
        totalPages: 1,
        total: 1,
        data: [
          {
            id: 'transfer1',
            amount: 100,
            recipient: {},
            sender: {},
            createdAt: new Date('2024-10-19T11:55:57.203Z'),
            updatedAt: new Date('2024-10-19T11:55:57.203Z'),
            deletedAt: null,
          },
        ],
      });
    });
  });
});
