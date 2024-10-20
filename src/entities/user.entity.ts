import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Transfer as Transfer } from './transfer.entity';

export class DecimalColumnTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return parseFloat(data);
  }
}

@Entity()
export class User extends BaseEntity {
  @Column('decimal', {
    precision: 12,
    scale: 2,
    default: 0.0,
    transformer: {
      to: (value: number) => value, // When saving to the database, keep it as a number
      from: (value: string) => parseFloat(value), // When reading from the database, convert to a number
    },
    select: false,
  })
  balance: number;

  @Column({ type: 'varchar', length: 14, unique: true }) // Unique index on username
  username: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  @Column({ type: 'varchar', length: 30 })
  firstName: string;

  @Column({ type: 'varchar', length: 30 })
  lastName: string;

  @OneToMany(() => Transfer, (transfer) => transfer.sender)
  sentTransfers: Transfer[];

  @OneToMany(() => Transfer, (transfer) => transfer.receiver)
  receivedTransfers: Transfer[];
}
