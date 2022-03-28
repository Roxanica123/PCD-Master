
import { PetRepository } from "../repositories/pet_repo";
import { PetData } from "../types/description_data";


export class DescriptionHandler {
    private readonly description: PetData;
    private readonly descriptionRepository: PetRepository;
    constructor(requestBody: any = {}) {
        this.description = new PetData(requestBody);
        this.descriptionRepository = new PetRepository();
    }

    areFieldsValid(): boolean {
        const invalidFields = Object.values(this.description).find(value => value == null || value == "");
        return invalidFields === undefined
    }

    async savePet(): Promise<string | undefined> {
        try {
            const id: string | undefined = await this.descriptionRepository.savePet(this.description);
            console.log(id);
            return id;
        } catch (error) {
            console.log(error)
            return undefined;
        }
    }
}