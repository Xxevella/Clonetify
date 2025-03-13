import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, String(process.env.DATABASE_PASSWORD), {
    host: 'localhost',
    dialect: 'postgres',
});

export default sequelize;