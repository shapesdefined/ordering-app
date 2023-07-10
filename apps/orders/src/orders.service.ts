import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  protected readonly logger = new Logger(OrdersService.name);
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly dataSource: DataSource,
  ) {}
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderRepository.save(createOrderDto);
  }
  async findAll(): Promise<Order[]> {
    return this.orderRepository.find();
  }
}
