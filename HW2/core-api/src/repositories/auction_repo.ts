import { Datastore, Entity } from "@google-cloud/datastore";
import { Auction } from "../types/description_data";

export class AuctionRepo{

    private readonly datastore;
    private readonly kind = "Auction";


    constructor() {
        this.datastore = new Datastore();
    }

    getDatastoreKeySymbol() {
        return this.datastore.KEY;
    }

    async save(auction: Auction) {
        const key = this.datastore.key(this.kind);
        const toInsert = {
          key: key,
          data: auction,
        };
        await this.datastore.save(toInsert);
        return toInsert.key.id;
      }

    async getById(id:string): Promise<Auction>{
        const query = this.datastore.createQuery(this.kind).filter("id","=",id).limit(1)
        const [result] = await this.datastore.runQuery(query)
        return result[0];
    }


}