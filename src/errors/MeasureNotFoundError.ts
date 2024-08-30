import BaseError from "./BaseError";

export default class MeasureNotFoundError extends BaseError {
    constructor(message: string = "Leitura não encontrada", errorCode: string = "MEASURE_NOT_FOUND") {
        super(message, 404, errorCode)
    } 
}