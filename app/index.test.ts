import * as redis from 'redis';
import request from 'supertest';
import { App } from 'supertest/types';
import { LIST_KEY, RedisClient, createApp } from './app';

let app: App;
let client: RedisClient;

beforeAll(async () => {
  client = redis.createClient({ url: 'redis://localhost:6379' });
  await client.connect();

  app = createApp(client);
});

beforeEach(async () => {
  await client.flushDb();
});

afterAll(async () => {
  await client.flushDb();
  await client.quit(); // redis client 종료
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
    await client.lPush(LIST_KEY, ['msg1', 'msg2']);

    const res = await request(app).get('/messages');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(['msg2', 'msg1']);
  });
});
