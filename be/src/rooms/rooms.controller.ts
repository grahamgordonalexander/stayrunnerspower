import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Post,
  Get,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Param,
  HttpException,
  Patch,
} from '@nestjs/common';
import { CreateRoomDto } from './dtos/CreateRoom.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Request } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { diskStorage } from 'multer';
import { RoomsService } from './rooms.service';
import mongoose from 'mongoose';
import { UpdateRoomDto } from './dtos/UpdateRoomDto.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          console.log(file);
          const filename: string =
            path.parse(file.originalname).name.replace(/\s/g, '') +
            '-' +
            Date.now();
          const extension: string = path.parse(file.originalname).ext;

          cb(null, `${filename}${extension}`);
        },
      }),
    }),
  )
  async addRoom(
    @Req() req: Request,
    @Body() createRoomDto: CreateRoomDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Res() res,
  ) {
    console.log("create room dto", createRoomDto.RoomGoogleMapAddress)
    console.log("files", files)
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one image is required');
    }

    const id: any = (req.user as any).id;
    const filenames = files.map((file) => file.filename);
    console.log("controller create Room dto", createRoomDto.RoomGoogleMapAddress)
    console.log("filenames", filenames)
    const room = await this.roomsService.createRoom(
      id,
      filenames,
      createRoomDto,
    );
    if (room) {
      return res.status(HttpStatus.CREATED).json({
        success: true,
        data: room,
      });
    } else {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  @Patch('/:room_id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          console.log(file);
          const filename: string =
            path.parse(file.originalname).name.replace(/\s/g, '') +
            '-' +
            Date.now();
          const extension: string = path.parse(file.originalname).ext;

          cb(null, `${filename}${extension}`);
        },
      }),
    }),
  )
  async editRoom(
    @Req() req: Request,
    @Body() updateRoomDto: UpdateRoomDto,
    @Param('room_id') room_id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Res() res,
  ) {
    let filenames = [];

    if (files && files.length > 0) {
      filenames = files.map((file) => file.filename);
    }

    const id: any = (req.user as any).id;

    const room = await this.roomsService.updateRoom(
      id,
      room_id,
      filenames,
      updateRoomDto,
    );

    if (room) {
      return res.status(200).json({
        success: true,
        data: room,
      });
    } else {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getLocalhostRooms(@Req() req: Request, @Res() res) {
    const id: any = (req.user as any).id;
    const rooms = await this.roomsService.getLocalhostRooms(id);
    if (rooms?.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Rooms not found',
      });
    } else if (rooms?.length > 0) {
      return res.status(200).json({
        success: true,
        data: rooms,
      });
    } else {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  @Get('/:city_id/:localhost')
  async getLocalhostRoomsForCustomer(
    @Param('city_id') city_id: string,
    @Param('localhost') localhost: string,
    @Res() res,
  ) {
    const isValidCity = mongoose.Types.ObjectId.isValid(city_id);
    if (!isValidCity) throw new HttpException('City does not exist', 400);

    const isValidLocalhost = mongoose.Types.ObjectId.isValid(localhost);
    if (!isValidLocalhost)
      throw new HttpException('Localhost does not exist', 400);

    const rooms = await this.roomsService.getLocalhostRoomsDetails(
      city_id,
      localhost,
    );
    if (rooms?.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Rooms not found',
      });
    } else if (rooms?.length > 0) {
      return res.status(200).json({
        success: true,
        data: rooms,
      });
    } else {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  @Get('rooms-details')
  @UseGuards(JwtAuthGuard)
  async getLocalhostAvailableRooms(@Req() req: Request, @Res() res) {
    const localhost: any = (req.user as any).localhost;
    const rooms =
      await this.roomsService.getLocalhostRoomsForCustomer(localhost);
    if (rooms?.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Rooms not found',
      });
    } else if (rooms?.length > 0) {
      return res.status(200).json({
        success: true,
        data: rooms,
      });
    } else {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}
