import sequelize from '../api/sequelize.js';
import { DataTypes } from "sequelize";

const Playlist_tracks = sequelize.define('Playlist_tracks', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    playlist_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    track_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    added_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: 'playlist_tracks',
    timestamps: true, // Включите временные метки
    createdAt: false,  // Отключите createdAt
    updatedAt: false,  // Отключите updatedAt
});

export default Playlist_tracks;