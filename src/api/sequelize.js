import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('clonetifydb', 'xxevella', '1111', {
    host: 'localhost',
    dialect: 'postgres',
});

export default sequelize;