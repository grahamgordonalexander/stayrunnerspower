import { Body, Controller, Post } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CreateCountryDto } from './dtos/CreateCountry.dto';

@Controller('countries')
export class CountriesController {
    constructor(private countriesService: CountriesService) {}

    @Post()
    createCountry(@Body() createCountryDto: CreateCountryDto) {
        return this.countriesService.createCountry(createCountryDto);
    }
}
