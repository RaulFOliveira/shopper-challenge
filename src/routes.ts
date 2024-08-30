import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify"
import CreateLeituraController from "./controllers/CreateLeituraController"
import ListLeituraController from "./controllers/ListLeituraController"
import ListLeituraService from "./services/ListLeituraService"
import CreateLeituraService from "./services/CreateLeituraService"
import UpdateLeituraController from "./controllers/UpdateListuraController"
import UpdateLeituraService from "./services/UpdateLeituraService"

export async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post("/upload", async (req: FastifyRequest, reply: FastifyReply) => {
        return new CreateLeituraController(new CreateLeituraService()).handle(req, reply)
    })

    fastify.get("/:customerCode/list", async (req: FastifyRequest, reply: FastifyReply) => {
        return new ListLeituraController(new ListLeituraService()).handle(req, reply)
    })

    fastify.patch("/confirm", async (req: FastifyRequest, reply: FastifyReply) => {
        return new UpdateLeituraController(new UpdateLeituraService()).handle(req, reply)
    })
}