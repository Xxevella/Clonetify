import sequelize from '../api/sequelize.js';
import { DataTypes } from "sequelize";

const Track_genres = sequelize.define('Track_genres', {
    track_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tracks',
            key: 'id'
        }
    },
    genre_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'genres',
            key: 'id'
        }
    }
}, {
    tableName: 'track_genres',
    timestamps: false
});

export default Track_genres;