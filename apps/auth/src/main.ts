import { NestFactory } from '@nestjs/core';
import { RabbitmqService } from '@app/common';
import { AuthModule } from './auth.module';
import { RmqOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const rabbitmqService = app.get<RabbitmqService>(RabbitmqService);
  app.connectMicroservice<RmqOptions>(rabbitmqService.getOptions('AUTH', true));
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  await app.startAllMicroservices();
  await app.listen(configService.get('NODE_PORT'));
}
bootstrap();
