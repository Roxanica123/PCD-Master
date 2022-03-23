import { Storage } from '@google-cloud/storage';

export type MulterFile = Express.Multer.File;

export class FilesRepository {
    private readonly storage;
    private readonly bucket;
    private readonly bucketName = "pets-photos";
    constructor() {
        this.storage = new Storage();
        this.bucket = this.storage.bucket(this.bucketName);
    }
    async saveFile(multerFile: MulterFile, saveLocation: string) {
        const file = this.bucket.file(saveLocation + multerFile.originalname);
        await file.save(multerFile.buffer);
    }
}