import { DataSource, EntitySchema, Repository } from 'typeorm';
import { Properties, PropertiesSchema } from '../../entities';
import { IPropertiesRepository } from '../interfaces/properties-repository.interface';
import { RepositoryBase } from '../repository.base';

export default class PropertiesRepository
  extends RepositoryBase<Properties>
  implements IPropertiesRepository
{
  private readonly repository: Repository<Properties>;

  constructor(dataSource: DataSource, entity: EntitySchema<Properties>) {
    super(dataSource, entity);
    this.repository = dataSource.getRepository(PropertiesSchema);
  }
}
