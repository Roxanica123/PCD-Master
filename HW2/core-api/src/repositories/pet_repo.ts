import { Datastore, Entity } from "@google-cloud/datastore";
import { getUuid } from "../handlers/uuid_gen";
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
    pet.identifier = getUuid();
    const petToInsert = {
      key: petKey,
      data: pet,
    };

    await this.datastore.save(petToInsert);
    return pet.identifier;
  }

  async getAllPets(): Promise<PetData[]> {
    const query = this.datastore.createQuery("Pet")
    const [pets] = await this.datastore.runQuery(query)
    return pets;
  }

  async getPet(name: string): Promise<PetData> {
    const query = this.datastore.createQuery("Pet").filter("name", "=", name)
    const [pet] = await this.datastore.runQuery(query)
    return pet[0];
  }

  async updatePrice(identifier:string, price:number): Promise<any>{
    const query = this.datastore.createQuery("Pet").filter("identifier", "=", identifier)
    const [pet] : Entity = await this.datastore.runQuery(query);
    pet[0]["price-estimate"] = price;
    return await this.datastore.update(pet);
  }

  async updateAuctionStatus(identifier:string, status:string): Promise<any>{
    const query = this.datastore.createQuery("Pet").filter("identifier", "=", identifier)
    const [pet] : Entity = await this.datastore.runQuery(query);
    pet[0]["auction"] = status;
    return await this.datastore.update(pet);
  }

  async getPetByIdentifier(identifier: string): Promise<any> {
    const query = this.datastore.createQuery("Pet").filter("identifier", "=", identifier)
    const [pet] : Entity = await this.datastore.runQuery(query);
    return pet[0];
  }

}