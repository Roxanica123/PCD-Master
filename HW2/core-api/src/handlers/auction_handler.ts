import { AuctionRepo } from "../repositories/auction_repo";
import { PetRepository } from "../repositories/pet_repo";
import { Created, Forbidden, HttpActionResult, ServerError } from "../types";
import { Auction } from "../types/description_data";
import { EventHandler } from "./event_handler";

export class AuctionHandler {
    private readonly petId: string;
    private readonly email: string;
    private readonly descriptionRepository: PetRepository;
    private readonly auctionStartId: string = "auction-start";

    private readonly auctionRepository: AuctionRepo;

    constructor(requestBody: any) {
        this.petId = requestBody.petId;
        this.email = requestBody.email;
        this.descriptionRepository = new PetRepository();
        this.auctionRepository = new AuctionRepo();
    }

    async startAuction(): Promise<HttpActionResult> {
        if ((await this.descriptionRepository.getPetByIdentifier(this.petId)).email == this.email) {
            this.descriptionRepository.updateAuctionStatus(this.petId, "started");
            const result: string | undefined = await EventHandler.instance.publishMessage(this.auctionStartId, this.petId);
            if (result == undefined) {
                return new ServerError("Could not publish message");
            }
            return new Created(result, "");
        }
        return new Forbidden();
    }

    async endAuction(): Promise<HttpActionResult> {
        if ((await this.descriptionRepository.getPetByIdentifier(this.petId)).email == this.email) {
            this.descriptionRepository.updateAuctionStatus(this.petId, "ended");
            const result: string | undefined = await EventHandler.instance.publishMessage("auction-notifications", JSON.stringify({
                "productId": this.petId,
                "type": "end-bid"
            }));

            if (result == undefined) {
                return new ServerError("Could not publish message");
            }
            return new Created(result, "");
        }
        return new Forbidden();
    }



    async save(auction: Auction) {
        return this.auctionRepository.save(auction);
    }

    async getById(id: string) {
        const result: Auction = await this.auctionRepository.getById(id)
        return result;
    }


}