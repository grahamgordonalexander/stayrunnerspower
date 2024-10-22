import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCityDto } from './dtos/CreateCity.dto';
import { City } from 'src/schemas/City.schema';
import { Country } from 'src/schemas/Country.schema';

@Injectable()
export class CitiesService {
    constructor(
        @InjectModel(City.name) private cityModel: Model<City>,
        @InjectModel(Country.name) private countryModel: Model<Country>
    ) {}

    async createCity (createCityDto: CreateCityDto) {
        const { city_name, country } = createCityDto
        const findCountry = await this.countryModel.findById(country).exec();
        if (!findCountry) {
          return 'Country does not exist';
        }

        const findCity = await this.cityModel.findOne({city_name, country}).exec();
        if (findCity) {
          return 'City already exists';
        }

        const createdCity = new this.cityModel(createCityDto);
        return createdCity.save();
    }

    async getAllCities () {
      const cities = await this.cityModel.find().select('_id city_name').exec();
      return cities;
    }
}

