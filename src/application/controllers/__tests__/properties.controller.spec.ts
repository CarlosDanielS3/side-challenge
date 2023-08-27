import request from 'supertest';
import { CreatePropertiesDTOType } from '../../../domain/dtos/create.dto';
import AppDataSource, { seedDb } from '../../../infra/database/datasource';
import app from '../../app';

// i did the tests here as integration tests because they are simple, but tests related to repository and
// services should be unit tests, because they are more complex and have more logic in real applications
// and it is better to test them in isolation

describe('properties Integration Tests (propertiesController)', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    await seedDb();
  });
  let createdPropertiesId: number;
  let createdPropertiesWithTypeId: number;
  const nonexistingId = 999999999999;

  describe('POST /properties', () => {
    it('should be able to create a new properties', async () => {
      const newProperties: CreatePropertiesDTOType = {
        address: 'street 1',
        bathrooms: 1,
        bedrooms: 1,
        price: 100000,
        type: null,
      };
      const response = await request(app)
        .post('/properties')
        .send(newProperties);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('address', newProperties.address);
      expect(response.body).toHaveProperty(
        'bathrooms',
        newProperties.bathrooms,
      );
      expect(response.body).toHaveProperty('bedrooms', newProperties.bedrooms);
      expect(response.body).toHaveProperty('price', newProperties.price);

      createdPropertiesId = response.body.id;
    });

    it('should be able to create a new properties with type', async () => {
      const newProperties: CreatePropertiesDTOType = {
        address: 'street 1',
        bathrooms: 1,
        bedrooms: 1,
        price: 100000,
        type: 'Condominium',
      };
      const response = await request(app)
        .post('/properties')
        .send(newProperties);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('address', newProperties.address);
      expect(response.body).toHaveProperty(
        'bathrooms',
        newProperties.bathrooms,
      );
      expect(response.body).toHaveProperty('bedrooms', newProperties.bedrooms);
      expect(response.body).toHaveProperty('price', newProperties.price);
      expect(response.body).toHaveProperty('type', newProperties.type);

      createdPropertiesWithTypeId = response.body.id;
    });

    it('should not be able to create a new properties', async () => {
      const wrongInputProperties: Partial<CreatePropertiesDTOType> = {
        address: 'street 1',
        bathrooms: 1,
        bedrooms: 1,
      };
      const response = await request(app)
        .post('/properties')
        .send(wrongInputProperties);

      expect(response.status).toBe(422);
    });
  });
  describe('GET /properties', () => {
    it('should return a list of properties', async () => {
      const response = await request(app).get('/properties?page=1&limit=10');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
    });
  });

  describe('GET /properties/:id', () => {
    it('should be able to return a properties by id', async () => {
      const response = await request(app).get(
        `/properties/${createdPropertiesId}`,
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('address');
      expect(response.body).toHaveProperty('bathrooms');
      expect(response.body).toHaveProperty('bedrooms');
      expect(response.body).toHaveProperty('price');
      expect(response.body).toHaveProperty('type');
    });

    it('should not be able to return a properties by id', async () => {
      const response = await request(app).get(`/properties/${nonexistingId}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /properties/:id', () => {
    it('should be able to update a properties', async () => {
      const newProperties: CreatePropertiesDTOType = {
        address: 'street 2',
        bathrooms: 2,
        bedrooms: 2,
        price: 200000,
      };
      const response = await request(app)
        .put(`/properties/${createdPropertiesId}`)
        .send(newProperties);

      expect(response.status).toBe(204);
    });
    it('should update type if it is provided', async () => {
      const newProperties: CreatePropertiesDTOType = {
        address: 'street 2',
        bathrooms: 2,
        bedrooms: 2,
        price: 200000,
        type: 'apartment',
      };
      const response = await request(app)
        .put(`/properties/${createdPropertiesWithTypeId}`)
        .send(newProperties);

      expect(response.status).toBe(204);

      const responseGet = await request(app).get(
        `/properties/${createdPropertiesWithTypeId}`,
      );

      expect(responseGet.body).toHaveProperty('type', newProperties.type);
    });
    it('should not update type if it is not provided', async () => {
      const newProperties: CreatePropertiesDTOType = {
        address: 'street 2',
        bathrooms: 2,
        bedrooms: 2,
        price: 200000,
      };
      const response = await request(app)
        .put(`/properties/${createdPropertiesId}`)
        .send(newProperties);

      expect(response.status).toBe(204);

      const responseGet = await request(app).get(
        `/properties/${createdPropertiesId}`,
      );

      expect(responseGet.body).toHaveProperty('type', null);
    });

    it('should not be able to update a properties', async () => {
      const newProperties: CreatePropertiesDTOType = {
        address: 'street 2',
        bathrooms: 2,
        bedrooms: 2,
        price: 200000,
        type: null,
      };
      const response = await request(app)
        .put(`/properties/${nonexistingId}`)
        .send(newProperties);

      expect(response.status).toBe(404);
    });

    it('should not be able to update a properties because passed a string in id path parameter', async () => {
      const newProperties: CreatePropertiesDTOType = {
        address: 'street 2',
        bathrooms: 2,
        bedrooms: 2,
        price: 200000,
        type: 'condominium',
      };
      const response = await request(app)
        .put('/properties/abc')
        .send(newProperties);

      expect(response.status).toBe(422);
    });
  });

  describe('DELETE /properties/:id', () => {
    it('should be able to delete a properties', async () => {
      const firstCreatedProperty = await request(app).delete(
        `/properties/${createdPropertiesId}`,
      );

      const secondCreatedProperty = await request(app).delete(
        `/properties/${createdPropertiesWithTypeId}`,
      );

      expect(firstCreatedProperty.status).toBe(204);

      expect(secondCreatedProperty.status).toBe(204);
    });

    it('should return 204 even if the id does not exists in the db', async () => {
      const response = await request(app).delete(
        `/properties/${nonexistingId}`,
      );

      expect(response.status).toBe(204);
    });

    it('should not be able to delete a properties because passed a string in id path parameter', async () => {
      const response = await request(app).delete('/properties/abc');

      expect(response.status).toBe(422);
    });
  });
});
