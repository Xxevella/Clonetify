import sequelize from '../api/sequelize.js';
import { DataTypes } from "sequelize";

const Track_artists = sequelize.define('Track_artists', {
    track_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tracks',
            key: 'id'
        }
    },
    artist_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'artists',
            key: 'id'
        }
    }
}, {
    tableName: 'track_artists',
    timestamps: false
});

export default Track_artists;