import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { compare, hash } from 'bcrypt';

export const ALL_ROLES = ['admin', 'user'] as const;
export type Role = typeof ALL_ROLES[number];

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  firstName: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  emailVerified: boolean;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({
    type: 'simple-array',
  })
  roles: Role[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  async validatePassword(password: string): Promise<boolean> {
    return compare(password, this.password);
  }
}
