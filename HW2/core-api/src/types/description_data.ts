export class PetData {
    public readonly name: string;
    public readonly description: string;
    public readonly id: string;

    
    constructor(requestBody: any) {
        this.name = requestBody.title ?? null;
        this.description = requestBody.description ?? null;
        this.id = requestBody.ID ?? null;
    }
}

export class Bid {

    public readonly email:string;
    public readonly ammount:number 
    
    constructor(requestBody: any) {        
        this.email = requestBody.email ?? null;
        if( requestBody.ammount && requestBody.ammount >= 0)
            this.ammount = requestBody.ammount;
        else
            this.ammount = 0

    }
}
export class Auction {

    public bids: Bid[];
    public maxBid: Bid | undefined;
    public id:string;
    
    constructor(){
        this.bids = []
        this.maxBid = undefined;
        this.id = "some_id"
    }
}


export interface WatchRegistration {
    productId: string;
    userId: string;
}