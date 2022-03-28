import { PetRepository } from "../repositories/pet_repo";
import { Created, HttpActionResult, ServerError } from "../types";
import { EventHandler } from "./event_handler";

export class AuctionHandler {
    private readonly petId: string;
    private readonly descriptionRepository: PetRepository;
    private readonly auctionStartId: string = "auction-start";
    constructor(requestBody: any) {
        this.petId = requestBody.petId;
        this.descriptionRepository = new PetRepository();
    }

    async startAuction(): Promise<HttpActionResult> {
        //server error should not be returned if the message is not publish, 
        //database should be updated with auction status
        const result: string | undefined = await EventHandler.instance.publishMessage(this.auctionStartId, this.petId);
        if (result == undefined){
            return new ServerError("Could not publish message");
        }
        return new Created(result, "");
    }
}