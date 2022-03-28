import { Created, HttpActionResult, ServerError } from "../types";
import { PhotosHandler, DescriptionHandler } from ".";


export class UploadHandler {
    private readonly photosHandler: PhotosHandler;
    private readonly descriptionHandler: DescriptionHandler;
    constructor(request: any) {
        this.photosHandler = new PhotosHandler(request.files.photos)
        this.descriptionHandler = new DescriptionHandler(request.body)
    }

    async handle(): Promise<HttpActionResult> {

        const petId = await this.descriptionHandler.savePet();
        if (petId === undefined)
            return new ServerError("Could not save the pet :(.");
            
        try {
            await this.photosHandler.savePhotos(petId);
        } catch (error) {
            console.log(error)
            return new ServerError("Could not save the photos :(")
        }
        return new Created("Pet saved!", "");
    }
}