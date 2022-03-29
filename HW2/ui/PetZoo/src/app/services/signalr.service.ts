import { Inject, Injectable } from "@angular/core";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { SnackService } from "./snack.service";

@Injectable({
    providedIn: "root"
})
export class SignalRService {
    private connection: HubConnection | undefined;

    constructor(private readonly snack: SnackService) { }

    public connect(userId: string) {
        this.connection = new HubConnectionBuilder()
            .withUrl(`https://zoo-notifications.azurewebsites.net/notifications?userId=${userId}`)
            .build();

        this.connection.start();

        this.connection.on("price-updated", data => {
            // data: { price, id }
            const notif = JSON.parse(data);
            console.log(notif);
            this.snack.info(`We have updated out suggested price for pet ${notif.data.id} with price ${notif.data.price}`);
        });

        this.connection.on("bidding-info", data => {
            const notif = JSON.parse(data);
            console.log(notif);
            switch (notif.type) {
                case "new-bid": this.snack.info(`We have a new bid of ${notif.productPrice} for a pet you are interested in! ${notif.productId}`);
                    break;
                case "end-bid": this.snack.info(`We have a winner for ${notif.productId}. It has been auctioned for ${notif.winningBid.amount} to ${notif.winningBid.email}`);
                    break;
            }
        });

        this.connection.on("auction-started", data => {
            console.log(data);
            this.snack.info(`Auction started for pet ${data.productId}`);
        });
    }
}