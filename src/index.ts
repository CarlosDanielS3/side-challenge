import app from './application/app';
import AppDataSource, { seedDb } from './infra/database/datasource';

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');

    await seedDb();
    console.log('Database populated with test data');

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server', error);
    process.exit(1);
  }
})();
