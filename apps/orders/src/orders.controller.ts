import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { JwtAuthGuard } from '@app/common';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: any,
  ): Promise<Order> {
    return this.ordersService.create(
      createOrderDto,
      req.cookies?.Authentication,
    );
  }
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }
}
