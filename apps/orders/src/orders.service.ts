import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { BILLING_SERVICE } from './constants/services.constants';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { User } from '../../auth/src/users/entities/user.entity';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class OrdersService {
  protected readonly logger = new Logger(OrdersService.name);
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @Inject(BILLING_SERVICE)
    private readonly billingService: ClientProxy,
    private readonly dataSource: DataSource,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}
  async create(
    createOrderDto: CreateOrderDto,
    authentication: string,
    user: User,
  ): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      createOrderDto.userId = user.id;
      const order = await this.orderRepository.save(createOrderDto);
      await lastValueFrom(
        this.billingService.emit('order_created', {
          createOrderDto,
          Authentication: authentication,
        }),
      );
      await queryRunner.commitTransaction();
      // Index the order document in Elasticsearch
      await this.elasticsearchService.index({
        index: 'orders_index',
        body: order,
      });
      return order;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    }
  }
  async findAll(): Promise<Order[]> {
    return this.orderRepository.find();
  }
}
