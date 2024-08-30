import BaseError from "./BaseError";

export class InvalidTypeError extends BaseError {
    constructor(message: string = "Tipo de medição não permitida", errorCode: string = "INVALID_TYPE") {
        super(message, 400, errorCode)
    }
}