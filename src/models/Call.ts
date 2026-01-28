import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './User';

export enum WorkflowType {
  SUPPORT = 'Support',
  SALES = 'Sales',
  REMINDER = 'Reminder',
}

export enum CallStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Table({
  tableName: 'calls',
  timestamps: true,
})
export class Call extends Model<Call> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  customerName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phoneNumber!: string;

  @Column({
    type: DataType.ENUM(...Object.values(WorkflowType)),
    allowNull: false,
  })
  workflow!: WorkflowType;

  @Column({
    type: DataType.ENUM(...Object.values(CallStatus)),
    allowNull: false,
    defaultValue: CallStatus.PENDING,
  })
  status!: CallStatus;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  twilioCallSid?: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

