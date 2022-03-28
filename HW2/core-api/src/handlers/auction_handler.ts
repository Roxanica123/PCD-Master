import { AuctionRepo } from "../repositories/auction_repo";
import { PetRepository } from "../repositories/pet_repo";
import { Created, HttpActionResult, ServerError } from "../types";
import { Auction } from "../types/description_data";
import { EventHandler } from "./event_handler";

export class AuctionHandler {
    private readonly petId: string;
    private readonly descriptionRepository: PetRepository;
    private readonly auctionStartId: string = "auction-start";

    private readonly auctionRepository: AuctionRepo;

    constructor(requestBody: any) {
        this.petId = requestBody.petId;
        this.descriptionRepository = new PetRepository();
        this.auctionRepository = new AuctionRepo();
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


    async save(auction: Auction){
       return this.auctionRepository.save(auction);
    }

    async getById(id:string){
        const result: Auction  = await this.auctionRepository.getById(id)
        return result;
    }


}