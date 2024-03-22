import * as request from 'supertest';
import { AppFactory } from './factories/app';

describe('UserController (e2e)', () => {
  let app: AppFactory;

  beforeAll(async () => {
    app = await AppFactory.new();
  });

  afterEach(async () => {
    await app.cleanupDB();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/users', async () => {
    return await request(app.instance.getHttpServer())
      .get('/users')
      .expect(200);
  });
});
