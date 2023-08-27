import {
  Body,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Query,
  Response,
  Route,
  SuccessResponse,
  Tags,
} from 'tsoa';
import { CreatePropertiesDTOType } from '../../domain/dtos/create.dto';
import { PaginationSchema } from '../../domain/dtos/pagination.dto';
import { Properties } from '../../domain/entities';
import { PropertiesService } from '../services';

interface ValidateErrorJSON {
  message: 'Validation failed';
  details: { [name: string]: unknown };
}

interface NotFoundErrorJSON {
  message: 'Not found';
  details: { [name: string]: unknown };
}
@Tags('properties')
@Route('properties')
export class PropertiesController {
  constructor(
    private propertiesService: PropertiesService = new PropertiesService(),
  ) {}

  @Get()
  async list(
    @Query()
    page: number,

    @Query()
    limit: number,
  ): Promise<{ properties: Properties[]; count: number }> {
    //guarantee that page and limit are in the limit
    PaginationSchema.parse({ page, limit });
    const properties = await this.propertiesService.getAllProperties(
      page,
      limit,
    );

    return properties;
  }
  @Response<NotFoundErrorJSON>(404, 'Not found')
  @Get('/{id}')
  async getOneById(@Path() id: number): Promise<Properties> {
    return this.propertiesService.getPropertyById(Number(id));
  }

  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @SuccessResponse('201', 'Created')
  @Post()
  async create(
    @Body() requestBody: CreatePropertiesDTOType,
  ): Promise<Properties> {
    return this.propertiesService.createProperty(requestBody);
  }

  @SuccessResponse('204', 'No content')
  @Response<ValidateErrorJSON>(422, 'Validation Failed')
  @Response<NotFoundErrorJSON>(404, 'Not found')
  @Put('/{id}')
  async update(
    @Path() id: number,
    @Body() requestBody: CreatePropertiesDTOType,
  ): Promise<void> {
    return this.propertiesService.updateProperty(id, requestBody);
  }

  @SuccessResponse('204', 'No content')
  @Delete('/{id}')
  async delete(@Path() id: number): Promise<void> {
    return this.propertiesService.deleteProperty(id);
  }
}
