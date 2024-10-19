import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { TransferService } from './transfer.service';
import {
  IncrementBalanceDto,
  InitiateTransferDto,
} from './dtos/initiate-transfer.dto';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetTransfersQueryDto } from './dtos/get-transfer-query.dto';

@Controller('transfers')
export class TransferController {
  constructor(@Inject() private transferService: TransferService) {}

  /**
   * POST: Initiates a money transfer for the authenticated user.
   *
   * @param {InitiateTransferDto} initiateTransferDto - Data Transfer Object containing transfer details.
   * @param {any} req - The request object containing the authenticated user's information.
   * @param {Response} res - The response object used to send the HTTP response.
   *
   * @returns {Promise<any>} - A promise that resolves with the response containing the transfer details.
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async initiateTransfer(
    @Body() initiateTransferDto: InitiateTransferDto,
    @Request() req: any,
    @Res() res: Response,
  ): Promise<any> {
    const transfer = await this.transferService.initiateTransfer(
      req.user.username,
      initiateTransferDto,
    );
    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Transfer initiated successfully!',
      data: transfer,
    });
  }

  /**
   * POST: Increments the balance of the authenticated user.
   *
   * @param {IncrementBalanceDto} incrementBalanceDto - Data Transfer Object containing balance increment details.
   * @param {any} req - The request object containing the authenticated user's information.
   * @param {Response} res - The response object used to send the HTTP response.
   *
   * @returns {Promise<any>} - A promise that resolves with the response containing the updated user details.
   */
  @UseGuards(JwtAuthGuard)
  @Post('increment')
  async incrementBalance(
    @Body() incrementBalanceDto: IncrementBalanceDto,
    @Request() req: any,
    @Res() res: Response,
  ): Promise<any> {
    const user = await this.transferService.incrementBalance(
      req.user.id,
      incrementBalanceDto,
    );
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Balance incremented successfully!',
      data: user,
    });
  }

  /**
   * GET: Retrieve a paginated list of transfers for the current user.
   *
   * @param {GetTransfersQueryDto} getTransfersQueryDto - The pagination and filter parameters.
   * @param {any} req - The request object containing the authenticated user's information.
   * @param {Response} res - The response object used to send the HTTP response.
   * @returns {Promise<any>} Returns a paginated list of transfers.
   */

  @UseGuards(JwtAuthGuard)
  @Get()
  async getTransfers(
    @Query() getTransfersQueryDto: GetTransfersQueryDto,
    @Request() req: any,
    @Res() res: Response,
  ): Promise<any> {
    const { transfers, total, currentPage, totalPages } =
      await this.transferService.getTransfers(
        req.user.id,
        getTransfersQueryDto,
      );
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Transfers retrieved successfully!',
      currentPage,
      totalPages,
      total,
      data: transfers,
    });
  }
}
