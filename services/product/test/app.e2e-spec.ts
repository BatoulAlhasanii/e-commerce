import * as request from 'supertest';
import { AppFactory } from './factories/app';

describe('AppController (e2e)', () => {
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

  it('/ (GET)', async () => {
    return await request(app.instance.getHttpServer()).get('/').expect(200).expect('Hello World!');
  });
});
