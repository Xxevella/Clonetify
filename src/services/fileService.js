import * as uuid from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

class FileService {
    saveFile(file, dir) {
        try {
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            const fileName = uuid.v4() + '.png';
            const filePath = path.resolve(__dirname, '../public/assets/'+dir, fileName);
            file.mv(filePath);
            return fileName;
        } catch (error) {
            console.error('Error saving file:', error);
        }
    }

    uploadFile(file) {}
    deleteFile(file) {}
}

export default new FileService();