import {Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {OrdersService} from './orders.service';
import {CreateOrderDto} from './dto/create-order.dto';
import {Order} from './entities/order.entity';
import {JwtAuthGuard} from '@app/common';
import {CurrentUser} from '../../auth/src/current-user.decorator';
import {User} from '../../auth/src/users/entities/user.entity';
import {ElasticsearchService} from '@nestjs/elasticsearch';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}
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

  @Get('search')
  async search(): Promise<any> {
    // Retreive all orders
    const { body } = await this.elasticsearchService.search({
      index: 'orders_index',
      body: {
        query: {
          match_all: {}, // Retrieve all users
        },
      },
    });
    const orders = body.hits.hits.map((hit) => hit._source);
    // Retreive all users
    const { body: userBody } = await this.elasticsearchService.search({
      index: 'users_index',
      body: {
        query: {
          match_all: {}, // Retrieve all users
        },
      },
    });
    const users = userBody.hits.hits.map((hit) => hit._source);
    return orders.map((order) => {
      const orderUser = users.filter((user) => user.id === order.userId);
      return {
        ...order,
        user: orderUser,
      };
    });
  }
}
