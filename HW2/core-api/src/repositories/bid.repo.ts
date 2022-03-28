import { Datastore, Entity } from "@google-cloud/datastore";
import { Bid } from "../types/description_data"

export class BidRepo {
    private readonly datastore;

    private readonly kind = "bids";

    constructor(){
        this.datastore = new Datastore();
    }

    async save(myObject:Bid) {
        const key = this.datastore.key(this.kind);
        const toInsert = {
          key: key,
          data: myObject,
        };
        await this.datastore.save(toInsert);
        return toInsert.key.id;
      }
}