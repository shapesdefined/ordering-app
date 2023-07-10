import { NestFactory } from '@nestjs/core';
import { BillingModule } from './billing.module';
import { RabbitmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(BillingModule);
  const rabbitmqService = app.get<RabbitmqService>(RabbitmqService);
  app.connectMicroservice(rabbitmqService.getOptions('BILLING'));
  await app.startAllMicroservices();
}
bootstrap();
