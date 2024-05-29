import express from 'express';
import * as redis from 'redis';

const PORT = 4000;
const LIST_KEY = 'messages';

const createApp = async () => {
  // redis
  const client = redis.createClient({ url: 'redis://localhost:6379' });
  await client.connect();

  // express
  const app = express();

  app.use(express.json());

  // api
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

  return app;
};

createApp().then((app) => {
  app.listen(PORT, () => {
    console.log(`App listening at port ${PORT}!`);
  });
});

/**
 * redis 백그라운드 실행
 * $ redis-server --daemonize yes
 *
 * 종료하고싶으면?
 * $ redis-cli
 * $ shutdown
 */
