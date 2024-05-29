import request from 'supertest';
import { App } from 'supertest/types';
import { createApp } from './index';

let app: App;

beforeAll(async () => {
  app = await createApp();
});

describe('POST /messages', () => {
  it('success', async () => {
    const res = await request(app).post('/messages').send({
      message: 'testing with redis',
    });

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Message added to list');
  });
});

describe('GET /messages', () => {
  it('success', async () => {
    const res = await request(app).get('/messages');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
});
