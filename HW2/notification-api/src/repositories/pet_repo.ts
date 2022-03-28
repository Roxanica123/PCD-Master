import { Datastore, Entity } from "@google-cloud/datastore";
import { PetData } from "../types/description_data";

export class PetRepository {
  private readonly datastore;
  private readonly kind = "Pet";
  constructor() {
    this.datastore = new Datastore();
  }

  getDatastoreKeySymbol() {
    return this.datastore.KEY;
  }

  async savePet(pet: PetData) {
    const petKey = this.datastore.key(this.kind);
    const petToInsert = {
      key: petKey,
      data: pet,
    };
    await this.datastore.save(petToInsert);
    return petToInsert.key.id;
  }

  async getAllPets(): Promise<PetData[]>{
    const query = this.datastore.createQuery("Pet")
    const [pets] = await this.datastore.runQuery(query)
    return pets;
  }

  async getPet(name:string): Promise<PetData>{
    const query = this.datastore.createQuery("Pet").filter("name","=",name)
    const [pet] = await this.datastore.runQuery(query)

    return pet[0];
  }

}