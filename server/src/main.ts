import { NestFactory } from '@nestjs/core';
import axios from 'axios';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin(origin, callback) {
      callback(null, true);
    },
    credentials: true
  });
  app.use(cookieParser())
  await app.listen(3006);
}
bootstrap();

// axios.defaults.proxy = {
//   host: 'localhost',
//   port: 7890,
//   protocol: 'http',
// };