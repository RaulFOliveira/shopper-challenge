import BaseError from "./BaseError";

export default class MeasuresNotFoundError extends BaseError {
    constructor(message: string = "Nenhuma leitura encontrada", errorCode: string = "MEASURES_NOT_FOUND") {
        super(message, 404, errorCode)
    } 
}