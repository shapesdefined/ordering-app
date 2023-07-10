import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';
import { AUTH_SERVICE } from './services';

@Module({
  imports: [RabbitmqModule.register({ name: AUTH_SERVICE })],
  exports: [RabbitmqModule],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}