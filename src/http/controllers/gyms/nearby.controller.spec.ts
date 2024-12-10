import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  })

  afterAll(async () => {
    await app.close();
  })


  it('should be able to get nearby gym', async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post('/gym')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: "Near Gym",
        email: "JS@gym.com",
        phone: "123456789",
        latitude: -26.0430503,
        longitude: 32.4353989,
        description: "near gym",

      });
    await request(app.server)
      .post('/gym')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: "Far Gym",
        email: "JS@gym.com",
        phone: "123456789",
        latitude: -26.07783,
        longitude: 32.2690356,
        description: "far gym",
      });


    const response = await request(app.server)
      .get("/gyms/nearby")
      .query({
        latitude: -26.0430503,
        longitude: 32.4353989,
      })
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual([
      expect.objectContaining({
        name: "Near Gym",
      })
    ])
  })
})