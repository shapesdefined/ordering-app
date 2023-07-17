import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { JwtAuthGuard } from '@app/common';
import { CurrentUser } from '../../auth/src/current-user.decorator';
import { User } from '../../auth/src/users/entities/user.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: any,
    @CurrentUser() user: User,
  ): Promise<Order> {
    return this.ordersService.create(
      createOrderDto,
      req.cookies?.Authentication,
      user,
    );
  }
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }
}
