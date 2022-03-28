import { Datastore, Entity } from "@google-cloud/datastore";
import { WatchRegistration } from "../types/description_data"

export class WhatchListRepo {
    private readonly datastore;

    private readonly kind = "WatchList";

    constructor(){
        this.datastore = new Datastore();
    }

    async save(myObject:WatchRegistration) {
        const key = this.datastore.key(this.kind);
        const toInsert = {
          key: key,
          data: myObject,
        };
        await this.datastore.save(toInsert);
        return toInsert.key.id;
      }






}