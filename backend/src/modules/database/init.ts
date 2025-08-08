import { sequelize } from './config';
// not remove imports below! it is necessary for sequelize to load models
import './models/User';

export async function initializeDB() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await sequelize.sync({ alter: true });

    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
