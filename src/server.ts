import Fastify, { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { routes } from "./routes";
import BaseError from "./errors/BaseError";
import { DoubleReportError } from "./errors/DoubleReportError";
import InvalidDataError from "./errors/InvalidDataError";
import ConfirmationDuplicateError from "./errors/ConfirmationDuplicateError";
import { InvalidTypeError } from "./errors/InvalidTypeError";
import MeasureNotFoundError from "./errors/MeasureNotFoundError";
import MeasuresNotFoundError from "./errors/MeasuresNotFoundError";
// import cors from "@fastify/cors";

const app = Fastify({ logger: true });

app.setErrorHandler((error: FastifyError, req: FastifyRequest, reply: FastifyReply) => {
    if (error instanceof InvalidDataError) {
        error.sendReply(reply)
    } else if (error instanceof DoubleReportError) {
        error.sendReply(reply)
    } else if (error instanceof ConfirmationDuplicateError) {
        error.sendReply(reply)
    } else if (error instanceof InvalidTypeError) {
        error.sendReply(reply)
    } else if (error instanceof MeasureNotFoundError) {
        error.sendReply(reply)
    } else if (error instanceof MeasuresNotFoundError) {
        error.sendReply(reply)
    } else if (error instanceof BaseError) {
        error.sendReply(reply)
    } else {
        reply.status(500).send({ error: "Erro interno no servidor" })
    }
})


const start = async () => {
    await app.register(routes)
    try {
        await app.listen({ port: 3333 })       
        console.log(`Server running on port 3333`)
    } catch (error) {
        process.exit(1)
    }
}

start()