import { Body, Controller, Post, HttpException, Res, Get } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dtos/CreateCity.dto';
import { Response } from 'express';

@Controller('cities')
export class CitiesController {
    constructor(private citiesService: CitiesService) {}

    @Post()
    async createCity(@Body() createCityDto: CreateCityDto, @Res() res: Response) {

      const city = await this.citiesService.createCity(createCityDto);
      
      if (city === 'Country does not exist') {
        throw new HttpException('Country does not exist', 400);
      } else if (city === 'City already exists') {
        throw new HttpException('City already exists', 400);
      } else if (city) {
        return res.status(201).json({
          data: city,
        });
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }

    @Get()
    async getAllCities(@Res() res: Response) {

      const cities = await this.citiesService.getAllCities();
      if (cities) {
        return res.status(200).json({
          data: cities,
        });
      } else {
        throw new HttpException('Internal server error', 500);
      }
    }
}

