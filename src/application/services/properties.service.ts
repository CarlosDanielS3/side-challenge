import { CreatePropertiesDTOType } from '../../domain/dtos/create.dto';
import { Properties, PropertiesSchema } from '../../domain/entities';
import { AppError } from '../../domain/errors/app.error';
import PropertiesRepository from '../../domain/repositories/implementations/properties.repository';
import AppDataSource from '../../infra/database/datasource';
export class PropertiesService {
  constructor(
    private propertiesRepository: PropertiesRepository = new PropertiesRepository(
      AppDataSource,
      PropertiesSchema,
    ),
  ) {}

  async getAllProperties(
    page: number,
    limit: number,
  ): Promise<{ properties: Properties[]; count: number }> {
    const [properties, count] = await this.propertiesRepository.findAll(
      page,
      limit,
    );

    return { properties, count };
  }

  async createProperty(
    properties: CreatePropertiesDTOType,
  ): Promise<Properties> {
    const newProperty = new Properties();

    newProperty.address = properties.address;
    newProperty.price = properties.price;
    newProperty.bedrooms = properties.bedrooms;
    newProperty.bathrooms = properties.bathrooms;

    if (properties.type) {
      newProperty.type = properties.type;
    }

    return this.propertiesRepository.create(newProperty);
  }

  async deleteProperty(id: number): Promise<void> {
    return this.propertiesRepository.delete(id);
  }

  async updateProperty(
    id: number,
    property: CreatePropertiesDTOType,
  ): Promise<void> {
    const propertyData = await this.propertiesRepository.findOneById(id);

    if (!propertyData) {
      throw new AppError(`Properties with id ${id} not found`, 404);
    }

    propertyData.address = property.address;
    propertyData.price = property.price;
    propertyData.bedrooms = property.bedrooms;
    propertyData.bathrooms = property.bathrooms;

    if (property.type) {
      propertyData.type = property.type;
    }

    return this.propertiesRepository.update(id, propertyData);
  }

  async getPropertyById(id: number): Promise<Properties> {
    const propertyData = await this.propertiesRepository.findOneById(id);

    if (!propertyData) {
      throw new AppError(`Properties with id ${id} not found`, 404);
    }

    return propertyData;
  }
}
