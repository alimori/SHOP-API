import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Order } from '../../order/entities/order.entity';
import { Category } from 'src/category/entities/category.entity';

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

  @ManyToMany(
    () => Category,
    (category) => category.products,
    {
      cascade: true,
    },
  )
  @JoinTable()
  categories: Category[];
}