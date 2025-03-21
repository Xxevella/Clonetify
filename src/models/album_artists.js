import sequelize from '../api/sequelize.js';
import {DataTypes} from "sequelize";

const Album_artists = sequelize.define('Album_artists', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    album_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    artist_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'album_artists',
});
export default Album_artists;