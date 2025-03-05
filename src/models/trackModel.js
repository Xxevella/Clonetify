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
    album: {
        type: DataTypes.STRING,
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    releaseDate: {
        type: DataTypes.DATE,
        field: 'release_date',
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
    },
    genre_id: {
        type: DataTypes.INTEGER,
        field: 'genre_id',
    },
    picture:{
        type: DataTypes.STRING,
        field: 'picture',
    }
},{
    tableName: 'tracks',
    timestamps: true,
    }
);

export default Track