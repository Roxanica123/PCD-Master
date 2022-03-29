import { Inject, Injectable } from "@angular/core";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { PetService } from "./pet.service";
import { SnackService } from "./snack.service";
import { PetModel } from "./types";

@Injectable({
    providedIn: "root"
})
export class SignalRService {
    private connection: HubConnection | undefined;

    constructor(private readonly snack: SnackService, private readonly petService: PetService) { }

    public connect(userId: string) {
        this.connection = new HubConnectionBuilder()
            .withUrl(`https://zoo-notifications.azurewebsites.net/notifications?userId=${userId}`)
            .build();

        this.connection.start();

        this.connection.on("price-updated", data => {
            // data: { price, id }
            const notif = JSON.parse(data);
            console.log("price-updated", notif);
            this.snack.info(`We have updated out suggested price for ${this.getById(notif.data.id).description} with price ${notif.data.price}`);
        });

        this.connection.on("bidding-info", data => {
            console.log("bidding-info", data);
            const notif = JSON.parse(data);
            switch (notif.type) {
                case "new-bid": this.snack.info(`We have a new bid of ${notif.productPrice} for ${this.getById(notif.productId).description}`);
                    break;
                case "end-bid": this.snack.info(`We have a winner for ${this.getById(notif.productId).description}. It has been auctioned for ${notif.winningBid.amount} to ${notif.winningBid.email}`);
                    break;
            }
        });

        this.connection.on("auction-started", data => {
            console.log("auction-started", data);
            this.snack.info(`Auction started for pet ${this.getById(data.productId).description}`);
        });
    }

    public getById(petId: string): PetModel {
        return this.petService.pets.filter(x => x.identifier == petId)[0];
    }
}