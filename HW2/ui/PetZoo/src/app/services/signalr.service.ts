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
            .withUrl(`https://localhost:5001/notifications?userId=${userId}`)
            .build();

        this.connection.start();

        this.connection.on("price-updated", data => this.snack.info(data));
        this.connection.on("bidding-info", data => this.snack.info(data));
        this.connection.on("auction-started", data => this.snack.info(data));
    }
}