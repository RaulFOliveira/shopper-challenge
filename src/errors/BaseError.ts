import { FastifyReply } from "fastify"

export default class BaseError extends Error {

    constructor(
        message: string = "Erro interno do servidor, tente novamente.",
        private status: number = 500,
        private errorCode: string = "INTERNAL_SERVER_ERROR"
    ) {
        super()
        this.message = message
        this.status = status
        this.errorCode = errorCode
    }

    sendReply(res: FastifyReply) {
        return res.status(this.status).send({
            error_code: this.errorCode,
            error_description: this.message 
        })
    }

}