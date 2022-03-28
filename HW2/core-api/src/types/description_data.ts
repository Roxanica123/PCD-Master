export class PetData {
    public readonly name: string;
    public readonly description: string;
    public readonly email: string;
    public identifier: string;

    constructor(requestBody: any) {
        this.name = requestBody.title ?? null;
        this.description = requestBody.description ?? null;
        this.identifier = requestBody.petId ?? null;
        this.email = requestBody.email ?? null;
    }
}

export class Bid {

    public readonly email: string;
    public readonly ammount: number;
    public readonly productId: number;

    constructor(requestBody: any) {
        this.email = requestBody.email ?? null;
        this.ammount = requestBody.ammount ?? null;
        this.productId = requestBody.userId ?? null;

    }
}
export class Auction {

    public bids: Bid[];
    public maxBid: Bid | undefined;
    public id: string;

    constructor() {
        this.bids = []
        this.maxBid = undefined;
        this.id = "some_id"
    }
}


export interface WatchRegistration {
    productId: string;
    userId: string;
}