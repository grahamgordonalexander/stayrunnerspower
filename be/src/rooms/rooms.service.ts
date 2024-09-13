import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from 'src/schemas/Room.schema';
import { CreateRoomDto } from './dtos/CreateRoom.dto';
import { UpdateRoomDto } from './dtos/UpdateRoomDto.dto';

@Injectable()
export class RoomsService {
  constructor(@InjectModel(Room.name) private roomModel: Model<Room>) {}

  async createRoom(id, filenames, createRoomDto: CreateRoomDto) {
    //console.log("aaaaaaaaaaaaaadress" ,createRoomDto.description, "formate address", createRoomDto.RoomGoogleMapAddress)
    createRoomDto.localhost = id;
    createRoomDto.pic_urls = filenames;

    const newRoom = new this.roomModel(createRoomDto);
    return await newRoom.save();
  }

  async updateRoom(id, room_id, filenames, updateRoomDto: UpdateRoomDto) {
    const room = await this.roomModel
      .findOne({
        _id: room_id,
        localhost: id,
        deleted: false,
      })
      .exec();

    if (!room) {
      return 'Room not found';
    }

    if (filenames?.length > 0) {
      room.pic_urls = filenames;
    }

    room.description = updateRoomDto.description;
    room.available = true;
    room.payment_option = updateRoomDto.payment_option;
    room.min_price_per_night = updateRoomDto.min_price_per_night;
    // room.city = updateRoomDto.city;
    room.room_Amentities = updateRoomDto.room_Amentities;
    room.updated_at = new Date();

    const updated = await room.save();

    if (updated) return room_id;
    return false;
  }

  async getLocalhostRooms(id) {
    const rooms = this.roomModel
      .find({ localhost: id, deleted: false })
      // .populate('city');
    return rooms;
  }

  async getLocalhostRoomsDetails(city_id, localhost) {
    const rooms = this.roomModel
      .find({
        localhost: localhost,
        available: true,
        city: city_id,
        deleted: false,
      })
      .populate('city');
    return rooms;
  }

  async getLocalhostRoomsForCustomer(id) {
    const rooms = this.roomModel
      .find({ localhost: id, available: true, deleted: false })
      .populate('city');
    return rooms;
  }
}
