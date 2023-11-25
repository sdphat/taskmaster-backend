import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';

describe('E2E Login', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const modRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = modRef.createNestApplication();
    await app.init();
  });

  it('should get a access token then successfully make a call', async () => {
    const loginReq = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'saudaiphat@gmail.com', password: '12345678' })
      .expect(200);

    const cookies: string[] = loginReq.headers['set-cookie'];

    expect(
      cookies.some((cookie) => cookie.startsWith('refresh_token')),
    ).toBeTruthy();

    return request(app.getHttpServer())
      .get('/auth/profile')
      .set('Cookie', cookies[0])
      .expect(200)
      .expect(({ body }) => {
        expect(body.sub).toEqual(4);
        expect(body.email).toEqual('saudaiphat@gmail.com');
      });
  });

  // it('should call /refresh token successfully after log in', async () => {
  // const loginReq = await request(app.getHttpServer())
  //   .post('/auth/login')
  //   .send({ email: 'saudaiphat@gmail.com', password: '12345678' })
  //   .expect(200);
  // const token = loginReq.body.refresh_token;
  // return request(app.getHttpServer())
  //   .get('/auth/profile')
  //   .set('Authorization', 'Bearer ' + token)
  //   .expect(200)
  //   .expect(({ body }) => {
  //     expect(body.sub).toEqual(4);
  //     expect(body.email).toEqual('saudaiphat@gmail.com');
  //   });
  // });

  afterAll(async () => {
    await app.close();
  });
});
