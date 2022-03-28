export interface HttpActionResult {
    statusCode: number;
    body: string;
    redirectLocation?:string;
}

export const EmptyBody = "{}";

export class BadRequest implements HttpActionResult {
    public readonly statusCode: number;
    public readonly body: string;
    constructor(body: string) {
        this.statusCode = 400;
        this.body = JSON.stringify({error: body});
    }
}

export class Created implements HttpActionResult {
    public readonly statusCode: number;
    public readonly body: string;
    public readonly redirectLocation: string;
    
    constructor(body: string, location:string) {
        this.statusCode = 201;
        this.body = JSON.stringify({response: body});
        this.redirectLocation = location;
    }
}

export class ServerError implements HttpActionResult {
    public readonly statusCode: number;
    public readonly body: string;
    constructor(body: string) {
        this.statusCode = 500;
        this.body = JSON.stringify({error: body});
    }
}

export class Ok implements HttpActionResult {
    public readonly statusCode: number;
    public readonly body: string;
    constructor(body: string = EmptyBody) {
        this.body = body;
        this.statusCode = 200;
    }
}

export class Forbidden implements HttpActionResult {
    public readonly statusCode: number;
    public readonly body: string;
    constructor(body: string = EmptyBody) {
        this.body = body;
        this.statusCode = 403;
    }
}