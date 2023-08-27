import { DataSource } from 'typeorm';
import { Properties } from '../../domain/entities';

const AppDataSource = new DataSource({
  logging: false,
  type: 'sqlite',
  database: ':memory:',
  entities: [Properties],

  synchronize: true, // synchronize the database schema with the entity classes
});

export default AppDataSource;

export const seedDb = async () => {
  const { default: data } = await import('./data/seed.json');
  await AppDataSource.manager.insert(Properties, data);
};
