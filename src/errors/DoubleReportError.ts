import BaseError from "./BaseError";

export class DoubleReportError extends BaseError {

    constructor(message: string = "Leitura do mês já realizada", errorCode: string = "DOUBLE_REPORT") {
        super(message, 409, errorCode)
    }
}