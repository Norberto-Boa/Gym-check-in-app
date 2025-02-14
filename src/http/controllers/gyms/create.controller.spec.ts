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


  it('should be able to create gym', async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const createGymResponse = await request(app.server)
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


    expect(createGymResponse.statusCode).toEqual(201);
    expect(createGymResponse.body).toEqual(
      expect.objectContaining({
        email: "gym@example.com",
      })
    )
  })
})