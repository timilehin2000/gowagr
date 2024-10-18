import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 14, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  firstName: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  lastName: string;

  @Column({ type: 'timestamptz', nullable: true })
  verifiedAt: Date | null;
}
