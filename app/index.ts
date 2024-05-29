import { createApp } from './app';
import * as redis from 'redis';

const PORT = 4000;

const startServer = async () => {
  const client = redis.createClient({ url: 'redis://localhost:6379' });
  await client.connect();

  const app = createApp(client);
  app.listen(PORT, () => {
    console.log(`App listening at port ${PORT}!`);
  });
};

startServer();

/**
 * redis 백그라운드 실행
 * $ redis-server --daemonize yes
 *
 * 종료하고싶으면?
 * $ redis-cli
 * $ shutdown
 */
