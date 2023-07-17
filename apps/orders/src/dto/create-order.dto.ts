import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsPositive()
  price: number;
  @IsPhoneNumber()
  phone_number: string;
  @IsOptional()
  userId: number;
}
