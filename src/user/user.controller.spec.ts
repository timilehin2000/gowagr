import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response } from 'express';
import { getMockRes } from '@jest-mock/express';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;
  let resMock: Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            register: jest.fn(),
            getUserDetails: jest.fn(),
            getUserWithBalance: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
    resMock = getMockRes().res;
  });

  describe('register', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        firstName: 'testfirstname',
        lastName: 'testlastname',
        password: '$Password123',
      };
      const user = {
        username: 'testuser',
        firstName: 'testfirstname',
        lastName: 'testlastname',
        password: '$Password123',
      };
      jest.spyOn(service, 'register').mockResolvedValue(user);

      await controller.register(createUserDto, resMock);

      expect(service.register).toHaveBeenCalledWith(createUserDto);
      expect(resMock.status).toHaveBeenCalledWith(201);
      expect(resMock.json).toHaveBeenCalledWith({
        success: true,
        message: 'User created successfully!',
        data: user,
      });
    });
  });

  describe('getUserDetails', () => {
    it('should return user details', async () => {
      const username = 'testuser';
      const user = {
        id: 'userId123',
        username: 'testuser',
        firstName: 'testfirstname',
        lastName: 'testlastname',
        createdAt: new Date('2024-10-19T11:55:57.203Z'),
        updatedAt: new Date('2024-10-19T11:55:57.203Z'),
        deletedAt: null,
      };
      jest.spyOn(service, 'getUserDetails').mockResolvedValue(user);

      await controller.getUserDetails(username, resMock);

      expect(service.getUserDetails).toHaveBeenCalledWith(username);
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith({
        success: true,
        message: 'User details retrieved successfully!',
        data: user,
      });
    });

    it('should return bad request if username is missing', async () => {
      // const username = 'testuser';
      await controller.getUserDetails('', resMock);

      // expect(service.getUserDetails).toHaveBeenCalledWith(username);
      expect(resMock.status).toHaveBeenCalledWith(400);
      expect(resMock.json).toHaveBeenCalledWith({
        success: false,
        message: 'Username missing in request!',
      });
    });
  });

  describe('getUserWithBalance', () => {
    it('should return user details with balance', async () => {
      const id = 'userId123';
      const user = {
        id: 'userId123',
        username: 'testuser',
        firstName: 'testfirstname',
        lastName: 'testlastname',
        balance: 1000,
        createdAt: new Date('2024-10-19T11:55:57.203Z'),
        updatedAt: new Date('2024-10-19T11:55:57.203Z'),
        deletedAt: null,
      };
      jest.spyOn(service, 'getUserWithBalance').mockResolvedValue(user);

      await controller.getUserWithBalance(id, resMock);

      expect(service.getUserWithBalance).toHaveBeenCalledWith(id);
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith({
        success: true,
        message: 'User details retrieved successfully!',
        data: user,
      });
    });

    it('should return bad request if id is missing', async () => {
      await controller.getUserWithBalance('', resMock);

      expect(resMock.status).toHaveBeenCalledWith(400);
      expect(resMock.json).toHaveBeenCalledWith({
        success: false,
        message: 'Id missing in request!',
      });
    });
  });
});
