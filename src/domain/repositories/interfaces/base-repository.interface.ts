import { EntityBase } from '../../entities';

export interface IRepositoryBase<T extends EntityBase> {
  create(entity: T): Promise<T>;
  findAll(page: number, limit: number): Promise<[T[], number]>;
  findOneById(id: number): Promise<T | null>;
  update(id: number, entity: T): Promise<void>;
  delete(id: number): Promise<void>;
}
