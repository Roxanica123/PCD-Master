import { FilesRepository, MulterFile } from "../repositories";

export class PhotosHandler {
    private readonly photos: MulterFile[];
    private readonly filesRepository: FilesRepository;

    constructor(photos: MulterFile[]) {
        this.photos = photos;
        this.filesRepository = new FilesRepository();
    }

    async savePhotos(petId: string) {
        const path = petId + "/";
        await Promise.all(this.photos.map(file => this.filesRepository.saveFile(file, path)));
    }
}