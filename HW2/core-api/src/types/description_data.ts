export class PetData {
    public readonly name: string;
    public readonly description: string;
    constructor(requestBody: any) {
        this.name = requestBody.title ?? null;
        this.description = requestBody.description ?? null;
    }
}