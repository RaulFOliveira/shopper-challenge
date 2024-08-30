import { FastifyRequest, FastifyReply } from "fastify";
import ListLeituraService from "../services/ListLeituraService";
import { MeasureType } from "@prisma/client";

export default class ListLeituraController {
    constructor(
        private listLeituraService: ListLeituraService
    ) { 
        this.listLeituraService = listLeituraService
    }

    async handle(req: FastifyRequest, reply: FastifyReply) {
        const { customerCode } = req.params as { customerCode: string }
        const { measureType } = req.query as { measureType?: MeasureType }

        const result = await this.listLeituraService.execute({ customerCode, measureType })
        return reply.status(200).send(result)
    }
}