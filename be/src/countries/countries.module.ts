import { Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Country, CountrySchema } from 'src/schemas/Country.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Country.name, schema: CountrySchema }
    ]),
  ],
  providers: [CountriesService],
  controllers: [CountriesController]
})
export class CountriesModule {}
