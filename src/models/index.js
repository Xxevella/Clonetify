import User from './userModel.js';
import Playlist from './playlistsModel.js';
import sequelize from '../api/sequelize.js';
import Artist from "./artistModel.js";

const models = {
    User,
    Playlist,
    Artist,
};

User.hasMany(Playlist, { foreignKey: 'user_id' });
Playlist.belongsTo(User, { foreignKey: 'user_id' });
Artist.belongsTo(User, { foreignKey: 'user_id' });

export { sequelize, models };