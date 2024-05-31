/**
 * index.js 파일부터 실행 됨
 * -> 가장 상단에
 * -> test 에서는 환경변수 불러오지 못함
 */
import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';
import * as redis from 'redis';

// 환경 변수
const { PORT, REDIS_URL } = process.env;

if (!PORT) {
  throw new Error('PORT 환경변수 필요');
}
if (!REDIS_URL) {
  throw new Error('REDIS_URL 환경변수 필요');
}

// server
const startServer = async () => {
  console.log(`trying to start server`);

  const client = redis.createClient({ url: REDIS_URL });
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
 *
 * redis 비밀번호, 포트 설정하기
 * $ redis-server --daemonize yes --port 6380 --requirepass test_env
 * $ redis-cli -p 6380 -a test_env
 */
