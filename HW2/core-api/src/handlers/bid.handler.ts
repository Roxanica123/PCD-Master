import { BidRepo } from "../repositories/bid.repo";
import { Created, HttpActionResult, ServerError } from "../types";
import { EventHandler } from "./event_handler";
import { Bid } from "../types/description_data"

export class BidHandler{

    private readonly repo: BidRepo;
    private readonly topic: string = "auction-notifications";

    constructor(){
        this.repo = new BidRepo()
    }

    async save(bid:Bid) {
       await this.repo.save(bid);
    
       const result: string | undefined = await EventHandler.instance.publishMessage(this.topic, JSON.stringify({
            "productId": bid.productId,
            "productPrice": bid.ammount,
            "type":"new-bid"
        }));

        if (result == undefined){
            return new ServerError("Could not publish message");
        }
        return new Created(result, "");
    }

}