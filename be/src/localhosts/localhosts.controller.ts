import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LocalhostsService } from './localhosts.service';
import { CreateLocalhostDto } from './dtos/CreateLocalhost.dto';
import { Request, Response } from 'express';
import { VerifyLocalhostDto } from './dtos/VerifyLocalhost.dto';
import mongoose from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { EmailService } from 'src/utils/EmailService';
import { ForgotPasswordLocalhostDto } from './dtos/ForgotPasswordLocalhost.dto';

@Controller('localhosts')
export class LocalhostsController {
  constructor(
    private localhostsService: LocalhostsService,
    private emailService: EmailService,
  ) {}

  @Post()
  async createLocalhost(
    @Body() createLocalhostDto: CreateLocalhostDto,
    @Res() res: Response,
  ) {

console.log("createLocalhostDto--->", createLocalhostDto);


    const localhost =
      await this.localhostsService.createLocalhost(createLocalhostDto);
    if (localhost === 'Email already exists') {
      throw new HttpException('Email already exists', 400);
    } else if (localhost) {
      return res.status(201).json({
        data: localhost,
      });
    } else {
      throw new HttpException('Internal server error', 500);
    }
  }

  @Patch('/verify/:id')
  async verifyLocalhost(
    @Param('id') id: string,
    @Body() verifyLocalhostDto: VerifyLocalhostDto,
    @Res() res: Response,
  ) {
   
    console.log("PASSWORD--->", verifyLocalhostDto);
    console.log("id--->", id);
    
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Local does not exist', 400);
    const verified = await this.localhostsService.verifyLocalhost(
      id,
      verifyLocalhostDto,
    );
    if (verified === 'Verification code is incorrect') {
      throw new HttpException('Verification code is incorrect', 400);
    } else if (verified === 'Local does not exist') {
      throw new HttpException('Local does not exist', 400);
    } else if (verified === 'Code already verified') {
      throw new HttpException('Code already verified', 400);
    } else if (verified === 'Verification code has expired') {
      throw new HttpException('Verification code has expired', 400);
    } else if (verified) {
      return res.status(200).json({
        data: verified,
      });
    } else {
      throw new HttpException('Internal server error', 500);
    }
  }

  @Patch('/resend-verification-code/:id')
  async resendVerificationCode(@Param('id') id: string, @Res() res: Response) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Local does not exist', 400);
    const resent = await this.localhostsService.resendVerificationCode(id);
    if (resent === 'Local does not exist') {
      throw new HttpException('Local does not exist', 400);
    } else if (resent === 'Code already verified') {
      throw new HttpException('Code already verified', 400);
    } else if (resent) {
      return res.status(200).json({
        data: resent,
      });
    } else {
      throw new HttpException('Internal server error', 500);
    }
  }

  @Patch('/forgot-password')
  async forgotPasswordLocalhost(
    @Body() forgotPasswordLocalhostDto: ForgotPasswordLocalhostDto,
    @Res() res: Response,
  ) {
    const localhost = await this.localhostsService.forgotPasswordLocalhost(
      forgotPasswordLocalhostDto,
    );
    if (localhost === 'Email does not exist') {
      throw new HttpException('Email does not exist', 400);
    } else if (localhost) {
      return res.status(200).json({
        data: localhost,
      });
    } else {
      throw new HttpException('Internal server error', 500);
    }
  }

  @Get('/send-email')
  async sendEmail() {
    const res = await this.emailService.sendEmail(
      'ua92989@gmail.com',
      'test subject',
      `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification Code</title>
      </head>
      <body>
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Email Verification Code</h2>
              <p>Hello,</p>
              <p>Your email verification code is: <strong>{{verificationCode}}</strong></p>
              <p>Please use this code to verify your email address. The code will expire in {{expiryTime}}.</p>
              <p>If you did not request this verification code, you can safely ignore this email.</p>
              <p>Thank you!</p>
          </div>
      </body>
      </html>
      `,
    );
    console.log(res);
    return 'Email sent';
  }

  @Patch('/accept-room-request/:id')
  @UseGuards(JwtAuthGuard)
  async acceptRequest(
    @Req() req: Request,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Request does not exist', 400);
    const localhost: any = (req.user as any).id;
    const accepted = await this.localhostsService.acceptRoomRequest(
      id,
      localhost,
    );
    if (accepted === 'We Apologize, this Order is no Longer Available.') {
      throw new HttpException('Request does not exist', 400);
    } else if (accepted === 'Request already accepted') {
      throw new HttpException('Request already accepted', 400);
    } else if (accepted) {
      return res.status(200).json({
        data: accepted,
      });
    } else {
      throw new HttpException('Internal server error', 500);
    }
  }

  @Patch('/room-availability/:room_id')
  @UseGuards(JwtAuthGuard)
  async changeRoomAvailablity(
    @Req() req: Request,
    @Param('room_id') room_id: string,
    @Res() res: Response,
  ) {
    const isValid = mongoose.Types.ObjectId.isValid(room_id);
    if (!isValid) throw new HttpException('Room not found', 400);
    const localhost: any = (req.user as any).id;
    const room = await this.localhostsService.changeRoomAvailability(
      room_id,
      localhost,
    );
    if (room === 'Room not found') {
      throw new HttpException('Room not found', 400);
    } else if (room) {
      return res.status(200).json({
        data: room_id,
      });
    } else {
      throw new HttpException('Internal server error', 500);
    }
  }

  @Get('/room/:room_id')
  @UseGuards(JwtAuthGuard)
  async getRoom(
    @Req() req: Request,
    @Param('room_id') room_id: string,
    @Res() res: Response,
  ) {
    const isValid = mongoose.Types.ObjectId.isValid(room_id);
    if (!isValid) throw new HttpException('Room not found', 400);
    const localhost: any = (req.user as any).id;
    const room = await this.localhostsService.getRoom(room_id, localhost);
    if (room === 'Room not found') {
      throw new HttpException('Room not found', 400);
    } else if (room) {
      return res.status(200).json({
        data: room,
      });
    } else {
      throw new HttpException('Internal server error', 500);
    }
  }

  @Delete('/room/:room_id')
  @UseGuards(JwtAuthGuard)
  async deleteRoom(
    @Req() req: Request,
    @Param('room_id') room_id: string,
    @Res() res: Response,
  ) {
    const isValid = mongoose.Types.ObjectId.isValid(room_id);
    if (!isValid) throw new HttpException('Room not found', 400);
    const localhost: any = (req.user as any).id;
    const room = await this.localhostsService.deleteRoom(room_id, localhost);
    if (room === 'Room not found') {
      throw new HttpException('Room not found', 400);
    } else if (room) {
      return res.status(200).json({
        data: room_id,
      });
    } else {
      throw new HttpException('Internal server error', 500);
    }
  }

  @Post('/chatbot')
  async chatbot(@Body() body: any, @Res() res: Response) {
    console.log(body);
    // Extract the intent or any other needed information from the request body
    const intent = body.queryResult.intent.displayName; // Assuming the intent is directly in the body

    // Construct the response object
    return res.status(200).json({
      fulfillmentText: `Received ==${intent}== in the backend`,
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async myProfile(@Req() req: Request, @Res() res: Response) {
    const localhost: any = (req.user as any).id;
    const user = await this.localhostsService.getMyProfile(localhost);
    if (user) {
      return res.status(200).json({
        data: user,
      });
    } else {
      throw new HttpException('Internal server error', 500);
    }
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Req() req: Request,
    @Body() body: any,
    @Res() res: Response,
  ) {
    const localhost: any = (req.user as any).id;
    const user = await this.localhostsService.updateProfile(localhost, body);
    if (user === 'User not found') {
      throw new HttpException('User not found', 404);
    } else if (user) {
      return res.status(200).json({
        data: user,
      });
    } else {
      throw new HttpException('Internal server error', 500);
    }
  }

  @Patch('/change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Req() req: Request,
    @Body() body: any,
    @Res() res: Response,
  ) {
    const localhost: any = (req.user as any).id;
    if (body.password.length < 8) {
      throw new HttpException('Password contains atleast 8 characters', 400);
    }

    if (body.password != body.confirmPassword) {
      throw new HttpException('Passwords do not match', 400);
    }

    const user = await this.localhostsService.changePassword(localhost, body);
    if (user === 'User not found') {
      throw new HttpException('User not found', 404);
    } else if (user) {
      return res.status(200).json({
        data: user,
      });
    } else {
      throw new HttpException('Internal server error', 500);
    }
  }



  @Post('/reset-new-password')
  async newPassword(
    @Req() req: Request,
    @Body() body: any,
    @Res() res: Response,
  ) {
    //const localhost: any = (req.user as any).id;
    const user = await this.localhostsService.ResetPassword(body.localhost,body.password);
    if (user === 'User not found') {
      throw new HttpException('User not found', 404);
    } else if (user) {
      return res.status(200).json({
        data: user,
      });
    } else {
      throw new HttpException('Internal server error', 500);
    }
  }

}
