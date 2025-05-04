import sequelize from '../api/sequelize.js';
import {DataTypes} from "sequelize";

const Genres = sequelize.define('Genres', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'genres',
    timestamps: false,
});
export default Genres;