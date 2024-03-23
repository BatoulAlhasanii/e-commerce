import * as request from 'supertest';
import { AppFactory } from './factories/app';
import { userDefinition } from '@/database/factories/user.factory';
import { Factory } from '@/database/factories/factory';
import { UserRepository } from '@/user/repositories/user.repository';
import { User } from '@/user/entity/user.entity';

describe('AuthController (e2e)', () => {
  let app: AppFactory;
  let userRepository: UserRepository;

  beforeAll(async () => {
    app = await AppFactory.new();

    userRepository = app.instance.get(UserRepository);
  });

  afterEach(async () => {
    await app.cleanupDB();
  });

  afterAll(async () => {
    await app.close();
  });

  it('tests register user successfully', async () => {
    const payload = userDefinition();

    const response = await request(app.instance.getHttpServer())
      .post('/users/auth/register')
      .send(payload)
      .expect(201);

    const { password, ...userInfo } = response.body.data.user;

    expect(response.body.data.user).toMatchObject(userInfo);
    expect(response.body.data.token.access_token).toBeDefined();
  });

  it('tests login user successfully', async () => {
    const user: User = await Factory.create(userRepository, userDefinition);

    const response = await request(app.instance.getHttpServer())
      .post('/users/auth/login')
      .send({
        email: user.email,
        password: 'password',
      })
      .expect(200);

    const { password, ...userInfo } = response.body.data.user;

    expect(response.body.data.user).toMatchObject(userInfo);
    expect(response.body.data.token.access_token).toBeDefined();
  });
});
