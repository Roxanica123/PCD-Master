import { Inject, Injectable } from "@angular/core";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

@Injectable({
    providedIn: "root"
})
export class SignalRService {
    private connection: HubConnection | undefined;

    constructor() { }

    public connect(userId: string) {
        this.connection = new HubConnectionBuilder()
            .withUrl(`https://localhost:5001/notifications?userId=${userId}`)
            .build();

        this.connection.start();

        this.connection.on("price-updated", data => console.log("info from me", data));
    }
}