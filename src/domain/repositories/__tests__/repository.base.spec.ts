import { DataSource, EntitySchema, Repository } from 'typeorm';
import { EntityBase } from '../../entities';
import { RepositoryBase } from '../repository.base';

describe('RepositoryBase', () => {
  let dataSource: DataSource;
  let mockEntity: EntitySchema<EntityBase>;
  let mockRepositoryBase: RepositoryBase<EntityBase>;
  let mockRepository: Repository<EntityBase>;

  const entities = [{ id: 1 }] as EntityBase[];
  const offsetSpy = jest.fn().mockReturnThis();
  const limitSpy = jest.fn().mockReturnThis();
  const getManyAndCountSpy = jest.fn().mockReturnValueOnce(entities);

  beforeEach(() => {
    mockRepository = {
      update: jest.fn().mockImplementation((id: number, entity: EntityBase) => {
        const result = { id, ...entity } as EntityBase;

        return mockRepository.save(result);
      }),
      delete: jest
        .fn()
        .mockImplementation((id: number) => Promise.resolve({ affected: 1 })),
      save: jest.fn().mockImplementation((entity: EntityBase) => entity),
      create: jest.fn().mockImplementation((entity: EntityBase) => entity),
      findOneBy: jest.fn().mockResolvedValue({}),
      createQueryBuilder: jest.fn(() => ({
        offset: offsetSpy,
        limit: limitSpy,
        getManyAndCount: getManyAndCountSpy,
      })),
    } as any;

    dataSource = {
      getRepository: jest.fn().mockReturnValue(mockRepository),
    } as unknown as DataSource;
    mockRepositoryBase = new RepositoryBase(dataSource, mockEntity);
    mockEntity = {} as EntitySchema<EntityBase>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('update', () => {
    it('should update an entity', async () => {
      const id = 1;
      const entity = { name: 'test' } as EntityBase;

      mockRepository.save = jest.fn().mockResolvedValueOnce(entity);

      await mockRepositoryBase.update(id, entity);

      expect(mockRepository.save).toHaveBeenCalledWith({ id, ...entity });
    });
  });

  describe('delete', () => {
    it('should delete an entity', async () => {
      const id = 1;

      await mockRepositoryBase.delete(id);

      expect(mockRepository.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('findOneById', () => {
    it('should find an entity by id', async () => {
      const id = 1;
      const entity = { id, name: 'test' } as EntityBase;

      mockRepository.findOneBy = jest.fn().mockResolvedValueOnce(entity);

      const result = await mockRepositoryBase.findOneById(id);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id });
      expect(result).toEqual(entity);
    });

    it('should return null if entity is not found', async () => {
      const id = 1;
      mockRepository.findOneBy = jest.fn().mockResolvedValueOnce({});

      const result = await mockRepositoryBase.findOneById(id);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id });
      expect(result).toStrictEqual({});
    });
  });

  describe('create', () => {
    it('should create an entity', async () => {
      const entity = { name: 'test' } as EntityBase;
      const result = { id: 1, ...entity } as EntityBase;

      mockRepository.save = jest.fn().mockResolvedValueOnce(result);
      mockRepository.create = jest.fn().mockReturnValueOnce(result);

      const created = await mockRepositoryBase.create(entity);

      expect(mockRepository.create).toHaveBeenCalledWith(entity);
      expect(mockRepository.save).toHaveBeenCalledWith(result);

      expect(created).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should find all entities', async () => {
      const pagination = {
        page: 1,
        limit: 10,
      };

      const result = await mockRepositoryBase.findAll(
        pagination.page,
        pagination.limit,
      );

      expect(offsetSpy).toHaveBeenCalledWith(1);
      expect(limitSpy).toHaveBeenCalledWith(10);
      expect(result).toEqual(entities);
    });
  });
});
