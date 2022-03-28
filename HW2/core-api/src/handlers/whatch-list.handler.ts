import { WhatchListRepo } from "../repositories/whatch-list.repo";
import { Created, HttpActionResult, ServerError } from "../types";
import { EventHandler } from "./event_handler";
import { WatchRegistration } from "../types/description_data"

export class WhatchListhandler{

    private readonly repo: WhatchListRepo;

    constructor(){
        this.repo = new WhatchListRepo()
    }

    async save(myObject:WatchRegistration) {
       await this.repo.save(myObject);
    }



}