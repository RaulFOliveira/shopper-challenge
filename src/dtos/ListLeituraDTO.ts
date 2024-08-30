interface ListLeituraData {
    measure_uuid: string,
    measure_datetime: Date,
    measure_type: string,
    has_confirmed: boolean,
    image_url: string,
}

export default class ListLeituraDTO {
    private measure_uuid: string
    private measure_datetime: Date
    private measure_type: string
    private has_confirmed: boolean
    private image_url: string

    constructor({ measure_uuid, measure_datetime, measure_type, has_confirmed, image_url}: ListLeituraData) {
        this.measure_uuid = measure_uuid
        this.measure_datetime = measure_datetime
        this.measure_type = measure_type
        this.has_confirmed = has_confirmed
        this.image_url = image_url
    }
}