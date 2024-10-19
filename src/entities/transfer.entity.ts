// import { TransferTypeEnum } from 'src/transfer/enum/transfer.enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class Transfer extends BaseEntity {
  @Column('decimal', {
    precision: 12,
    scale: 2,
    transformer: {
      to: (value: number) => value, // When saving to the database, keep it as a number
      from: (value: string) => parseFloat(value), // When reading from the database, convert to a number
    },
  })
  amount: number;

  // @Column({ type: 'enum', enum: TransferTypeEnum })
  // type: TransferTypeEnum;

  @ManyToOne(() => User, (user) => user.sentTransfers)
  @JoinColumn()
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedTransfers)
  @JoinColumn()
  receiver: User;
}
