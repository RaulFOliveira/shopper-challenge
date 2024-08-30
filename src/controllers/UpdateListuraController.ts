import { FastifyReply, FastifyRequest } from "fastify";
import UpdateLeituraService from "../services/UpdateLeituraService";

export default class UpdateLeituraController {

    constructor(private updateLeituraService: UpdateLeituraService) {
        this.updateLeituraService = updateLeituraService
    }
    
    async handle(req: FastifyRequest, reply: FastifyReply) {
        const { measure_uuid, confirmed_value } = req.body as { measure_uuid: string, confirmed_value: number };

        await this.updateLeituraService.execute({ measure_uuid, confirmed_value })

        reply.status(200).send({ success: true })
    }
}