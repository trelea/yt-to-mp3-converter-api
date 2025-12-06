import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  /**
   * @description The unique identifier for the user.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * @description The email address of the user.
   */
  @Column({ unique: true })
  email: string;

  /**
   * @description The password of the user.
   */
  @Column()
  password: string;

  /**
   * @description The date and time the user was created.
   */
  @CreateDateColumn()
  created_at: Date;

  /**
   * @description The date and time the user was last updated.
   */
  @UpdateDateColumn()
  updated_at: Date;
}
