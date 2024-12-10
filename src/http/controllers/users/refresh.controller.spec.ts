import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  })

  afterAll(async () => {
    await app.close();
  })


  it('should be able to authenticate a user', async () => {
    await request(app.server).post('/users').send({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password123"
    });

    const authResponse = await request(app.server).post('/sessions').send({
      email: "john.doe@example.com",
      password: "password123"
    });

    const cookies = authResponse.get('Set-Cookie') ?? "";

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies[0])
      .send()

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    })

    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken')
    ])
  })
})