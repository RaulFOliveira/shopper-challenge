import validate from "uuid-validate";
import ConfirmationDuplicateError from "../errors/ConfirmationDuplicateError"
import InvalidDataError from "../errors/InvalidDataError"
import MeasureNotFoundError from "../errors/MeasureNotFoundError"
import prisma from "../prisma"

interface UpdateLeituraProps {
    measure_uuid: string,
    confirmed_value: number
}

export default class UpdateLeituraService {

    async execute({ measure_uuid, confirmed_value }: UpdateLeituraProps) {
        
        if (!measure_uuid || !confirmed_value) {
            throw new InvalidDataError("ID ou valor confirmado estão vazios.")
        }

        if (!validate(measure_uuid)) {
            throw new InvalidDataError("ID inválido.")  
        }
        
        const measure = await prisma.leitura.findFirst({
            where: {
                measure_uuid
            }
        })

        if (!measure) {
            throw new MeasureNotFoundError()
        }

        if (measure.has_confirmed) {
            throw new ConfirmationDuplicateError()
        }

        await prisma.leitura.update({
            data: {
                measure_value: confirmed_value,
                has_confirmed: true
            },
            where: {
                measure_uuid
            }
        })
    }
}