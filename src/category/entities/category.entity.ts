import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
} from 'typeorm';

import { Product } from '../../product/entities/product.entity';

@Entity()
export class Category {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToMany(
    () => Product,
    (product) => product.categories,
  )
  products: Product[];
}