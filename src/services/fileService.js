import * as uuid from 'uuid';
import path from 'path';

class FileService{
    saveFile(file) {
        try {
            const fileName = uuid.v4() +'.jpg';
            const filePath = path.resolve(__dirname, '../public/assets/tracks', fileName);
            file.mv(filePath)
            return fileName;
        }
        catch(error) {
            console.error('Error saving file:', error);
        }
    }
    uploadFile(file) {}
    deleteFile(file) {}
}

export default new FileService();