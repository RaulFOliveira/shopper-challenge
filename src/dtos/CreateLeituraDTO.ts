interface CreateLeituraData {
    image_url: string,
    measure_value: number,
    measure_uuid: string
}

export default class CreateLeituraDTO {
    private image_url: string
    private measure_value: number
    private measure_uuid: string

    constructor({ image_url, measure_value, measure_uuid}: CreateLeituraData) {
        this.image_url = image_url
        this.measure_value = measure_value
        this.measure_uuid = measure_uuid
    }
}