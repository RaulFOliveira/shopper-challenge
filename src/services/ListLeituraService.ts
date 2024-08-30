import { MeasureType } from "@prisma/client"
import prisma from "../prisma"
import { InvalidTypeError } from "../errors/InvalidTypeError"
import MeasuresNotFoundError from "../errors/MeasuresNotFoundError"
import ListLeituraDTO from "../dtos/ListLeituraDTO"

interface ListLeituraProps {
    customerCode: string,
    measureType?: MeasureType
}

interface SearchParamsProps {
    customer_code: string,
    measure_type?: MeasureType
}

export default class ListLeituraService {
    async execute({ customerCode, measureType }: ListLeituraProps): Promise<ListLeituraDTO[]> {
        const search: SearchParamsProps = {
            customer_code: customerCode
        }
        
        if (measureType) {
            measureType = measureType.toUpperCase() as MeasureType
            const isInvalidType = !Object.values(MeasureType).includes(measureType as MeasureType)
            if (isInvalidType) {
                throw new InvalidTypeError()
            }
            
            search.measure_type = measureType
        }
        
        const leituras = await prisma.leitura.findMany({
            where: search,
            select: {
                measure_uuid: true,
                measure_datetime: true,
                measure_type: true,
                has_confirmed: true,
                image_url: true
            }
        });

        if (!leituras.length) {
            throw new MeasuresNotFoundError()
        }

        return leituras.map((leitura) => new ListLeituraDTO(leitura))
    }
} 