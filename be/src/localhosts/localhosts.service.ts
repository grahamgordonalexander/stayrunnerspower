import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Localhost } from 'src/schemas/Localhost.schema';
import { CreateLocalhostDto } from './dtos/CreateLocalhost.dto';
import { VerifyLocalhostDto } from './dtos/VerifyLocalhost.dto';
import { hashPassword } from 'src/utils/bcrypt';
//import { generatePassword } from 'src/utils/generatePassword';
import { RoomRequests } from 'src/schemas/RoomRequests.schema';
import { Room } from 'src/schemas/Room.schema';
import { EmailService } from 'src/utils/EmailService';
import { ForgotPasswordLocalhostDto } from './dtos/ForgotPasswordLocalhost.dto';
import { Customer } from 'src/schemas/Customer.schema';
import { Bid } from 'src/schemas/Bid.schema';


@Injectable()
export class LocalhostsService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Localhost.name) private localhostModel: Model<Localhost>,
    @InjectModel(RoomRequests.name)
    private roomRequestsModel: Model<RoomRequests>,
    @InjectModel(Room.name) private roomModel: Model<Room>,
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    @InjectModel(Bid.name) private bidModel: Model<Bid>,
    private emailService: EmailService,
  ) {}

  async createLocalhost(createLocalhostDto: CreateLocalhostDto) {
    const email = createLocalhostDto.email;
    const findByEmail = await this.localhostModel.findOne({ email }).exec();
    if (findByEmail && findByEmail.code_verified) {
      return 'Email already exists';
    }

    if (findByEmail && !findByEmail.code_verified) {
      const verificationcode = Math.floor(100000 + Math.random() * 900000);
      findByEmail.verification_code = verificationcode;
      findByEmail.verification_code_created_at = new Date();
      await findByEmail.save();
      const sent = await this.emailService.sendEmail(
        email,
        'Last Minute Booking Email Verification Alert',
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
                <p>Your email verification code is: <strong>${verificationcode}</strong></p>
                <p>Please use this code to verify your email address. The code will expire in 10 minutes.</p>
                <p>If you did not request this verification code, you can safely ignore this email.</p>
                <p>Thank you!</p>
            </div>
        </body>
        </html>
        `,
      );
      console.log('EMAIL SENT', sent);
      return { _id: findByEmail._id, code_verified: false };
    }

    const verificationcode = Math.floor(100000 + Math.random() * 900000);
    createLocalhostDto.verification_code = verificationcode;
    // verification code send to local host's email

    const Pass = await hashPassword(createLocalhostDto.password);
    createLocalhostDto.password = Pass;

    const createdLocalhost = new this.localhostModel(createLocalhostDto);
    const savedUser = await createdLocalhost.save();
    const { _id, code_verified } = savedUser;
    if (savedUser) {
      await this.emailService.sendEmail(
        email,
        'Last Minute Booking Email Verification Alert',
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
                    <p>Your email verification code is: <strong>${verificationcode}</strong></p>
                    <p>Please use this code to verify your email address. The code will expire in 10 minutes.</p>
                    <p>If you did not request this verification code, you can safely ignore this email.</p>
                    <p>Thank you!</p>
                </div>
            </body>
            </html>
            `,
      );
      return { _id, code_verified };
    }
  }

  async forgotPasswordLocalhost(
    forgotPasswordLocalhostDto: ForgotPasswordLocalhostDto,
  ) {
    const email = forgotPasswordLocalhostDto.email;
    const findByEmail = await this.localhostModel.findOne({ email }).exec();
    if (!findByEmail) {
      return 'Email does not exist';
    }

    const verificationcode = Math.floor(100000 + Math.random() * 900000);
    findByEmail.verification_code = verificationcode;
    findByEmail.verification_code_created_at = new Date();
    findByEmail.code_verified = false;
    findByEmail.password = undefined;
    await findByEmail.save();
    await this.emailService.sendEmail(
      email,
      'Last Minute Booking Email Verification Alert',
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
                <p>Your email verification code is: <strong>${verificationcode}</strong></p>
                <p>Please use this code to verify your email address. The code will expire in 10 minutes.</p>
                <p>If you did not request this verification code, you can safely ignore this email.</p>
                <p>Thank you!</p>
            </div>
        </body>
        </html>
        `,
    );
    return { _id: findByEmail._id, code_verified: false };
  }

  async verifyLocalhost(id, verifyLocalhostDto: VerifyLocalhostDto) {
 
    
    const { verification_code } = verifyLocalhostDto;
    const localhost = await this.localhostModel.findById(id).exec();

    if (!localhost) {
      return 'Local does not exist';
    }
    if (localhost.code_verified) {
      return 'Code already verified';
    }

    if (localhost.verification_code !== verification_code) {
      return 'Verification code is incorrect';
    }

    const currentTime = new Date();
    const expirationTimeInMinutes = 10;
    const expirationTime = new Date(
    localhost.verification_code_created_at.getTime() +
    expirationTimeInMinutes * 60000,
    );

    if (currentTime > expirationTime) {
      return 'Verification code has expired';
    }

if(localhost?.password){
    localhost.code_verified = true;
    localhost.code_verified_at = new Date();
    await localhost.save();
    return {
      _id: localhost._id,
      name: localhost.name,
      code_verified: true,
      password: "",
    };
  }
  else{
    localhost.code_verified = true;
    localhost.code_verified_at = new Date();
    await localhost.save();
    return {
      _id: localhost._id,
      name: localhost.name,
      code_verified: true,
      password: undefined
    };
  }
  }

  async resendVerificationCode(id) {
    const localhost = await this.localhostModel.findById(id).exec();
    if (!localhost) {
      return 'Local does not exist';
    }
    if (localhost?.code_verified) {
      return 'Code already verified';
    }
    const verificationcode = Math.floor(100000 + Math.random() * 900000);
    localhost.verification_code = verificationcode;
    localhost.verification_code_created_at = new Date();
    await localhost.save();
    await this.emailService.sendEmail(
      localhost.email,
      'Last Minute Booking Email Verification Alert',
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
                    <p>Your email verification code is: <strong>${verificationcode}</strong></p>
                    <p>Please use this code to verify your email address. The code will expire in 10 minutes.</p>
                    <p>If you did not request this verification code, you can safely ignore this email.</p>
                    <p>Thank you!</p>
                </div>
            </body>
            </html>
            `,
    );
    return { _id: localhost._id, code_verified: false };
  }

  async acceptRoomRequest(id, localhost) {
    const Isdealed = await this.roomRequestsModel
      .findOne({
        bid: id,
        dealed: true,
      })
      .exec();

    if (Isdealed) {
      return 'We Apologize, this Order is no Longer Available.';
    }

    const IsAvailable = await this.roomRequestsModel
      .findOne({
        bid: id,
        localhost: localhost,
        accepted: false,
      })
      .exec();

    if (!IsAvailable) {
      return 'Request already accepted';
    }

    IsAvailable.accepted = true;
    IsAvailable.accepted_at = new Date();
    const accepted = await IsAvailable.save();
    let rooms = [];
    if (accepted) {
      rooms = await this.roomModel
        .find({
          localhost: localhost,
          available: true,
        })
        .exec();

      const customerBid = await this.bidModel
        .findOne({
          _id: id,
        })
        .exec();

      const customer = await this.customerModel
        .findOne({
          _id: customerBid.customer,
        })
        .exec();

      let localh = await this.localhostModel
        .findOne({
          _id: localhost,
        })
        .exec();

      const payload = {
        userRole: 'customer',
        bid: id,
        localhost,
      };
      const accessToken = this.jwtService.sign(payload);

      this.emailService.sendEmail(
        customer.email,
        'A New Room Request - Last Minute Booking',
        `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Request Accepted</title>
          </head>
          <body>
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2>Request Accepted</h2>
                  <p>Hello,</p>
                  <p>A Last Minute Local Host has accepted 
                  your Request:</p>
                  <ul>
                      <li><strong>Localhost Name:</strong> ${localh.name}</li>
                  </ul>
                  <a href="http://localhost:3003/customer/negotiate?token=${accessToken}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none;">Negotiate</a>
                  <p>If you have any questions or concerns, please contact us.</p>
                  <p>Thank you!</p>
              </div>
          </body>
          </html>

        `,
      );

      return { bid: id, accepted: true, roomsCount: rooms.length, rooms };
    }

    return false;
  }

  async changeRoomAvailability(id, localhost) {
    const room = await this.roomModel
      .findOne({
        _id: id,
        localhost,
      })
      .exec();

    if (!room) {
      return 'Room not found';
    }

    room.available = !room.available;
    room.updated_at = new Date();
    const roomSaved = await room.save();
    if (roomSaved) {
      return true;
    }
    return false;
  }

  async deleteRoom(id, localhost) {
    const room = await this.roomModel
      .findOne({
        _id: id,
        localhost,
        deleted: false,
      })
      .exec();

    if (!room) {
      return 'Room not found';
    }

    room.deleted = true;
    room.deleted_at = new Date();
    const roomSaved = await room.save();
    if (roomSaved) {
      return true;
    }
    return false;
  }

  async getRoom(id, localhost) {
    const room = await this.roomModel
      .findOne({
        _id: id,
        localhost,
        deleted: false,
      })
      .exec();

    if (!room) {
      return 'Room not found';
    }

    return room;
  }

  async getMyProfile(localhost) {
    const user = await this.localhostModel
      .findOne({
        _id: localhost,
        code_verified: true,
      })
      .exec();

    if (!user) {
      return 'User not found';
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      city: user.city,
    };
  }

  async updateProfile(localhost, data) {
    const user = await this.localhostModel
      .findOne({
        _id: localhost,
        code_verified: true,
      })
      .exec();

    if (!user) {
      return 'User not found';
    }

    user.name = data.name;
    user.city = data.city;
    user.updated_at = new Date();
    const saved = await user.save();
    if (saved) {
      return { localhost };
    }
    return false;
  }

  async changePassword(localhost, data) {
    const user = await this.localhostModel
      .findOne({
        _id: localhost,
        code_verified: true,
      })
      .exec();

    if (!user) {
      return 'User not found';
    }

    const hashedPassword = hashPassword(data.password);
    user.password = hashedPassword;
    user.updated_at = new Date();
    const saved = await user.save();
    if (saved) {
      return { localhost };
    }
    return false;
  }

  async ResetPassword(localhost,password) {
    const user = await this.localhostModel
      .findOne({
        _id: localhost,
        code_verified: true,
      })
      .exec();

    if (!user) {
      return 'User not found';
    }

    const hashedPassword = hashPassword(password);
    user.password = hashedPassword;
    user.updated_at = new Date();
    const saved = await user.save();
    if (saved) {
      return { localhost };
    }
    return false;
  }
}
