import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class OutboxEvent {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column('text')
  payload: string;

  @Column({
    default: false,
  })
  processed: boolean;

  @CreateDateColumn()
  createdAt: Date;
}