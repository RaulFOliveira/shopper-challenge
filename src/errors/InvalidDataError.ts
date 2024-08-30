import BaseError from "./BaseError";

export default class InvalidDataError extends BaseError {

    constructor(message: string, errorCode: string = "INVALID_DATA") {
        super(message, 400, errorCode)
    }
}