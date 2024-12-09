import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    vi.useFakeTimers();
    await app.ready();
  })

  afterAll(async () => {
    await app.close();
    vi.useRealTimers();
  })


  it('should be able to validate check-Ins', async () => {
    const { token } = await createAndAuthenticateUser(app);

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


    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    const createCheckInResponse = await request(app.server)
      .post(`/gyms/${createGymResponse.body.id}/checkins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -25.9029608,
        longitude: 32.4353989,
      });


    const response = await request(app.server)
      .patch(`/check-ins/${createCheckInResponse.body.id}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(204);
  })
})