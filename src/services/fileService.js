// services/fileService.js
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

class FileService {
    constructor() {
        this.staticPath = path.resolve('static');
        this.imagePath = path.join(this.staticPath, 'images');
        this.audioPath = path.join(this.staticPath, 'audio');

        if (!fs.existsSync(this.staticPath)) {
            fs.mkdirSync(this.staticPath, { recursive: true });
        }
        if (!fs.existsSync(this.imagePath)) {
            fs.mkdirSync(this.imagePath, { recursive: true });
        }
        if (!fs.existsSync(this.audioPath)) {
            fs.mkdirSync(this.audioPath, { recursive: true });
        }
    }

    saveFile(file, type = 'image') {
        if (!file) return null;

        try {
            const fileExtension = path.extname(file.name);
            const fileName = uuidv4() + fileExtension;
            const filePath = type === 'image'
                ? path.join(this.imagePath, fileName)
                : path.join(this.audioPath, fileName);

            file.mv(filePath);
            return fileName;
        } catch (error) {
            console.error(`Error saving ${type} file:`, error);
            throw error;
        }
    }
    saveFileWithName(file, fileName, type = 'image') {
        if (!file) return null;

        try {
            const filePath = type === 'image'
                ? path.join(this.imagePath, fileName)
                : path.join(this.audioPath, fileName);

            file.mv(filePath);
            return fileName;
        } catch (error) {
            console.error(`Error saving ${type} file:`, error);
            throw error;
        }
    }

    saveImage(file) {
        return this.saveFile(file, 'image');
    }

    saveAudio(file) {
        return this.saveFile(file, 'audio');
    }

    deleteImage(fileName) {
        if (!fileName) return;

        try {
            const filePath = path.join(this.imagePath, fileName);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`Deleted image: ${filePath}`);
            }
        } catch (error) {
            console.error('Error deleting image file:', error);
        }
    }

    deleteAudio(fileName) {
        if (!fileName) return;

        try {
            const filePath = path.join(this.audioPath, fileName);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`Deleted audio: ${filePath}`);
            }
        } catch (error) {
            console.error('Error deleting audio file:', error);
        }
    }
}

export default new FileService('../../../static/images/', '../../../static/audio/');