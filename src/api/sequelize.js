import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.REACT_APP_DATABASE_NAME, process.env.REACT_APP_DATABASE_USERNAME, process.env.REACT_APP_DATABASE_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres',
});

export default sequelize;