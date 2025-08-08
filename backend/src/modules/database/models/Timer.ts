import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config';

type TimerAttributes = {
  id: number;
  userId: number;
  name: string;
  exerciseTime: number;
  restTime: number;
  rounds: number;
};

type TimerCreationAttributes = Optional<TimerAttributes, 'id'>;

export class Timer extends Model<TimerAttributes, TimerCreationAttributes> {
  declare id: number;
  declare userId: number;
  declare name: string;
  declare exerciseTime: number;
  declare restTime: number;
  declare rounds: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Timer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    exerciseTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    restTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rounds: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'timers',
    timestamps: true,
  },
);
