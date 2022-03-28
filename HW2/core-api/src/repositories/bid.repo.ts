import { Datastore, Entity } from "@google-cloud/datastore";
import { Bid } from "../types/description_data"

export class BidRepo {
  private readonly datastore;

  private readonly kind = "bids";

  constructor() {
    this.datastore = new Datastore();
  }

  async save(myObject: Bid) {
    const key = this.datastore.key(this.kind);
    const toInsert = {
      key: key,
      data: myObject,
    };
    await this.datastore.save(toInsert);
    return toInsert.key.id;
  }

  async getBidsByPet(petIdentifier: string): Promise<any> {
    const query = this.datastore.createQuery(this.kind).filter("petId", "=", petIdentifier)
    const [bids] : Entity = await this.datastore.runQuery(query);
    return bids;
  }

  async getWinningBid(petIdentifier: string): Promise<any> {
    const bids = await this.getBidsByPet(petIdentifier);
    bids.sort((a:any, b:any) => (a.ammount < b.ammount) ? 1 : -1);
    return bids[0];
  }
}