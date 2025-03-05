import Track from "../models/trackModel.js";
import fileService from "./fileService.js";
import FileService from "./fileService.js";

class TrackService {
    async create(track, picture) {
        const fileName = fileService.saveFile(picture);
        const createdTrack = await Track.create({ ...track, picture: fileName });
        return createdTrack;
    }

    async getAll() {
        const tracks = await Track.findAll();
        return tracks;
    }

    async getOne(id) {
        if (!id) throw new Error("No id");
        const track = await Track.findByPk(id);
        return track;
    }

    async update(track) {
        const existingTrack = await Track.findByPk(track.id);
        if (!existingTrack) throw new Error("Track not found");
        await existingTrack.update(track);
        return existingTrack;
    }

    async delete(trackId) {
        const track = await Track.findByPk(trackId);
        if (!track) throw new Error("Track not found");
        await track.destroy();
        return trackId;
    }
}

export default new TrackService();