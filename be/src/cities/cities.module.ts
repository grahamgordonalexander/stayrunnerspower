import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { City, CitySchema } from 'src/schemas/City.schema';
import { Country, CountrySchema } from 'src/schemas/Country.schema';

@Module({
    imports: [
      MongooseModule.forFeature([
        { name: City.name, schema: CitySchema },
        { name: Country.name, schema: CountrySchema },
      ]),
    ],
    providers: [CitiesService],
    controllers: [CitiesController]
  })
export class CitiesModule {}
