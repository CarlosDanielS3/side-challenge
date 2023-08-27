import {
  DataSource,
  EntitySchema,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { EntityBase } from '../entities';
import { IRepositoryBase } from './interfaces/base-repository.interface';

// default repository class to another repositories implements, make easy to create new repositories that
// does simples operations, in case of more complex operations, we can override the methods or even improve
// this class
export class RepositoryBase<T extends EntityBase>
  implements IRepositoryBase<T>
{
  private readonly _repository: Repository<T>;

  constructor(dataSource: DataSource, entity: EntitySchema<T>) {
    this._repository = dataSource.getRepository<T>(entity);
  }
  async update(id: number, entity: T): Promise<void> {
    const r = { id, ...entity };

    await this._repository.save(r);
  }
  async delete(id: number): Promise<void> {
    await this._repository.delete(id);
  }
  async findOneById(id: number): Promise<T | null> {
    return await this._repository.findOneBy({ id } as FindOptionsWhere<T>);
  }

  async create(entity: T): Promise<T> {
    const result = this._repository.create(entity);

    return await this._repository.save(result);
  }
  async findAll(page: number, limit: number): Promise<[T[], number]> {
    const [list, count] = await this._repository
      .createQueryBuilder()
      .limit(limit)
      .offset(page)
      .getManyAndCount();

    return [list, count];
  }
}
