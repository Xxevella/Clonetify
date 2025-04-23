import { DataTypes } from 'sequelize';
import sequelize from '../api/sequelize.js';

const Track = sequelize.define('Track', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        releaseDate: {
            type: DataTypes.DATE,
            field: 'release_date',
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
            field: 'created_at',
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
            field: 'updated_at',
        },
        picture: {
            type: DataTypes.STRING,
            field: 'picture',
        },
        audio: {
            type: DataTypes.STRING,
            field: 'audio',
        },
        album_id: {
            type: DataTypes.STRING,
        },
    },{
        tableName: 'tracks',
        timestamps: true,
    }
);

export default Track