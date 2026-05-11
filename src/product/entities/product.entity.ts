import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from '../../order/entities/order.entity';

@Entity()
export class Product {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  price: number;

  @OneToMany(() => Order, (order) => order.product)
  orders: Order[];
}