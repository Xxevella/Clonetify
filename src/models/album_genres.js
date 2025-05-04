import sequelize from '../api/sequelize.js';
import {DataTypes} from "sequelize";

const Album_genres= sequelize.define('Album_genres', {
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
    timestamps: false,
});
export default Album_genres;