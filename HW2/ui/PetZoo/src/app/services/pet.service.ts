import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpResponse } from "@microsoft/signalr";
import { BehaviorSubject, Observable } from "rxjs";
import { PetModel } from "./types";

@Injectable({ providedIn: "root" })
export class PetService {
    public pets: PetModel[] = [];
    public subject = new BehaviorSubject<PetModel[]>([]);
   
    constructor(private readonly client: HttpClient) {
        this.load();
    }

    public load() {
        this.client.get<PetModel[]>("https://winter-justice-345019.ew.r.appspot.com/pets").subscribe(data => {
            this.pets = data
            this.subject.next(this.pets);
            console.table(data)
        });
    }

    public create(data: any): Observable<any> {
        return this.client.post("https://winter-justice-345019.ew.r.appspot.com/upload", data);
    }
}