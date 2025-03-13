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
    album_id: {
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
        allowNull: false,
        field: 'created_at',
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        field: 'updated_at',
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