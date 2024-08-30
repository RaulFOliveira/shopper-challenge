import BaseError from "./BaseError";

export default class ConfirmationDuplicateError extends BaseError {

    constructor(message: string = "Leitura do mês já realizada", errorCode: string = "CONFIRMATION_DUPLICATE") {
        super(message, 409, errorCode)
    }
}