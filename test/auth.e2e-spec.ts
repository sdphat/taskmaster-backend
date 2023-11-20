import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

describe('E2E JWT Sample', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const modRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = modRef.createNestApplication();
    await app.init();
  });

  it('should get a JWT then successfully make a call', async () => {
    const loginReq = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'saudaiphat@gmail.com', password: '12345678' })
      .expect(200);

    const token = loginReq.body.access_token;
    return request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .expect(({ body }) => {
        expect(body.sub).toEqual(4);
        expect(body.email).toEqual('saudaiphat@gmail.com');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
