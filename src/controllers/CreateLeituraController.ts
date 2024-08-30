import { FastifyRequest, FastifyReply } from "fastify";
import { } from "base-64"
import CreateLeituraService from "../services/CreateLeituraService";
import { MeasureType } from "@prisma/client";

export default class CreateLeituraController {

    constructor(private createLeituraService: CreateLeituraService) {
        this.createLeituraService = createLeituraService;
    }
    
    async handle(req: FastifyRequest, reply: FastifyReply) {
        const { image, customer_code, measure_datetime, measure_type } = req.body as { 
            image: string,
            customer_code: string,
            measure_datetime: Date,
            measure_type: MeasureType
        };
        
        const result = await this.createLeituraService.execute({ image, customer_code, measure_datetime, measure_type });
        return reply.status(200).send(result)
    }
}