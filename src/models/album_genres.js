import sequelize from '../api/sequelize.js';
import {DataTypes} from "sequelize";

const Album_genres= sequelize.define('Album_genres', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    album_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    genre_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'album_genres',
});
export default Album_genres;