import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Search Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  })

  afterAll(async () => {
    await app.close();
  })


  it('should be able to get searched gym', async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post('/gym')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: "Gym-1",
        email: "gym@example.com",
        description: "Some description...",
        phone: "123456789",
        latitude: -25.9029608,
        longitude: 32.4353989,
      });

    await request(app.server)
      .post('/gym')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: "Malhampsene",
        email: "gym2@example.com",
        description: "Some description...",
        phone: "123456789",
        latitude: -25.9029608,
        longitude: 32.4353989,
      });

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        q: "Malhampsene"
      })
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveLength(1);
    expect(response.body).toEqual([
      expect.objectContaining({
        name: "Malhampsene",
      })
    ]);
  })
})