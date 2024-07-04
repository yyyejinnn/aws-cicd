import express from 'express';
import { RedisClientType } from 'redis';

export const LIST_KEY = 'messages';

export type RedisClient = RedisClientType<any, any, any>;

export const createApp = (client: RedisClient) => {
  const app = express();

  app.use(express.json());

  // api

  app.get('/crash', ()=> {
    console.log('crashing server!');
    process.exit();
  });

  app.get('/', (req, res) => {
    res.status(200).send('hello from express');
  });

  app.post('/messages', async (req, res) => {
    const { message } = req.body;
    await client.lPush(LIST_KEY, message);

    res.status(200).send('Message added to list');
  });

  app.get('/messages', async (req, res) => {
    const messages = await client.lRange(LIST_KEY, 0, -1);
    res.status(200).send(messages);
  });

  /** 부하 테스트를 위한 경로 */
  app.get('/fibonacci/:n', async (req, res) => {
    console.log(process.env.pm_id);

    const n = parseInt(req.params.n, 10);
    const result = fibonacci(n);

    return res.send(`Fibonacci(${n}) => ${result}`);
  });

  return app;
};

function fibonacci(n: number): number {
  if (n <= 1) return n;

  return fibonacci(n - 1) + fibonacci(n - 2);
}
