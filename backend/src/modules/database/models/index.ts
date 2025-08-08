import { User } from './User';
import { Timer } from './Timer';

User.hasMany(Timer, { foreignKey: 'userId', as: 'timers' });
Timer.belongsTo(User, { foreignKey: 'userId', as: 'user' });
