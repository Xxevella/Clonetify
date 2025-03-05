import * as uuid from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

class FileService {
    saveFile(file) {
        try {
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename); // Получаем dirname из filename
            const fileName = uuid.v4() + '.png'; // Генерация имени файла с расширением
            const filePath = path.resolve(__dirname, '../public/assets/tracks', fileName);
            file.mv(filePath);
            return fileName; // Возвращаем имя файла с расширением
        } catch (error) {
            console.error('Error saving file:', error);
        }
    }

    uploadFile(file) {}
    deleteFile(file) {}
}

export default new FileService();