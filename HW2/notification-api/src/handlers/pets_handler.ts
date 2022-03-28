import { PetRepository } from "../repositories/pet_repo";
import { Created, HttpActionResult, ServerError } from "../types";
import { PetData } from "../types/description_data";
import { EventHandler } from "./event_handler";

export class PetHandler {
    private readonly petId: string;
    private readonly descriptionRepository: PetRepository;
    private readonly auctionStartId: string = "auction-start";
    
    constructor() {
        this.petId = ""
        this.descriptionRepository = new PetRepository();
    }

    async getPets(): Promise<PetData[]>{
       return this.descriptionRepository.getAllPets();
    }

    async getPet(name:string): Promise<PetData>{
        return this.descriptionRepository.getPet(name);
    }
}