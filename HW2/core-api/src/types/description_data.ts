export class PetData {
    public readonly name: string;
    public readonly description: string;
    public identifier: string;

    constructor(requestBody: any) {
        this.name = requestBody.title ?? null;
        this.description = requestBody.description ?? null;
        this.identifier = requestBody.petId ?? null;
    }
}