import User from './userModel.js';
import Playlist from './playlistsModel.js';
import sequelize from '../api/sequelize.js';
import Artist from "./artistModel.js";
import Track from "./trackModel.js";
import Track_genres from "./track_genres.js";
import Track_artists from "./track_artists.js";
import Playlist_tracks from "./playlist_tracks.js";
import Genres from "./genresModel.js";
import Favorites from "./favorites.js";
import Album from "./albumModel.js";
import Album_artists from "./album_artists.js";
import Album_genres from "./album_genres.js";

const models = {
    User,
    Track,
    Track_genres,
    Track_artists,
    Playlist,
    Playlist_tracks,
    Genres,
    Favorites,
    Artist,
    Album,
    Album_artists,
    Album_genres
};

// Определение ассоциаций
User.hasMany(Playlist, { foreignKey: 'user_id' });
Playlist.belongsTo(User, { foreignKey: 'user_id' });

Playlist.belongsToMany(Track, { through: Playlist_tracks, foreignKey: 'playlist_id' });
Track.belongsToMany(Playlist, { through: Playlist_tracks, foreignKey: 'track_id' });

// Убедитесь, что здесь нет лишних ассоциаций
Track.belongsToMany(Genres, { through: Track_genres, foreignKey: 'track_id' });
Track.belongsToMany(Artist, { through: Track_artists, foreignKey: 'track_id' });
Track.belongsTo(Album, { foreignKey: 'album_id' });

Genres.belongsToMany(Track, { through: Track_genres, foreignKey: 'genre_id' });
Genres.belongsToMany(Album, { through: Album_genres, foreignKey: 'genre_id' });

Artist.belongsToMany(Track, { through: Track_artists, foreignKey: 'artist_id' });
Artist.belongsTo(User, { foreignKey: 'user_id' });

Album.hasMany(Track, { foreignKey: 'album_id' });
Album.hasMany(Album_artists, { foreignKey: 'album_id' });
Album.hasMany(Album_genres, { foreignKey: 'album_id' });

Favorites.belongsTo(User, { foreignKey: 'user_id' });
Favorites.belongsTo(Track, { foreignKey: 'track_id' });

// Убедитесь, что вы не создаете лишние ассоциации с Playlist_tracks
Playlist_tracks.belongsTo(Playlist, { foreignKey: 'playlist_id' });
Playlist_tracks.belongsTo(Track, { foreignKey: 'track_id' });

export { sequelize, models };