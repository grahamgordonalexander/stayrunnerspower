import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  // UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';
// import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import * as jwt from 'jsonwebtoken';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  // @UseGuards(JwtAuthGuard)
  @Get('User-details')
  async getUserDetails(@Req() req: Request, @Res() res) {
    const token = req.query.token as string;
    console.log('Token from query params:', token);

    const decodedToken = jwt.decode(token);

    // const decodedObject = JSON.parse(JSON.stringify(decodedToken));

    // Now you have access to decoded token data as an object
    // console.log('Decoded token as object:', decodedObject);

    // const jsonString = JSON.stringify(decodedToken)
    // // Example: Access decoded token data
    console.log('Decoded token:', decodedToken);
    // @ts-ignore
    const bitId = decodedToken?.bid;
      // @ts-ignore
    const userRole = decodedToken?.userRole;
    console.log('bitId:', bitId);
    console.log('userRole:', userRole);
    const a = await this.userService.findOne(bitId,userRole);
    res.send(a);

    // const localhost: any = (req.user as any).localhost;
    // console.log("testing",localhost)
    // const rooms =
    //   await this.roomsService.getLocalhostRoomsForCustomer(localhost);
    // if (rooms?.length === 0) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'Rooms not found',
    //   });
    // } else if (rooms?.length > 0) {
    //   return res.status(200).json({
    //     success: true,
    //     data: rooms,
    //   });
    // } else {
    //   return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    //     success: false,
    //     message: 'Internal server error',
    //   });
    // }
  }

  //find customer details

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   // console.log("iiidddd",id)
  //   return this.userService.findOne(id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
