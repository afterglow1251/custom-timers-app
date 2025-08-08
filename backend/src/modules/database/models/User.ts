import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config';
import bcrypt from 'bcrypt';

type UserAttributes = {
  id: number;
  email: string;
  password: string;
};

type UserCreationAttributes = Optional<UserAttributes, 'id'>;

export class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id: number;
  declare email: string;
  declare password: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  async comparePassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
  },
);

User.prototype.toJSON = function () {
  const values = { ...this.get() } as any;
  delete values.password;
  return values;
};
