import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpResponse } from "@microsoft/signalr";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class PetService {
    constructor(private readonly client: HttpClient) { }

    public create(data: any): Observable<any> {
        return this.client.post("https://winter-justice-345019.ew.r.appspot.com/upload", data);
    }
}