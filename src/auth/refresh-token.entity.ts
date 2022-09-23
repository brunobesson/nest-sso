import { User } from 'src/users/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'refresh-token' })
export class RefreshToken {
  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User)
  user: User;

  @Column({ nullable: true })
  userId: number; // https://stackoverflow.com/questions/55170906/typeorm-how-to-set-foreignkey-explicitly-without-having-property-for-loading-re

  @PrimaryColumn({ type: 'varchar' })
  jwtid: string;

  @Column({ type: 'varchar' })
  token: string;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;
}
