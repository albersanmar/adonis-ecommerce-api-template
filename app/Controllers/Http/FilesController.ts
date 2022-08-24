import Drive from '@ioc:Adonis/Core/Drive'

import { v1 as uuidv1 } from "uuid";

export default class FileController {
    public async upload({ request, response }) {
        const file = request.file('file')
        const folder = request.all().folder || ''
        if (!file) {
            return response.badRequest({
                code: 'FILE_REQUIRED',
                message: 'No se ha enviado ningún archivo'
            })
        } else {
            try {
                const name = `${uuidv1()}.${file.extname}`
                await file.moveToDisk(folder, {
                    name: name
                })
                response.send({
                    key: `${folder}/${name}`
                })
            } catch (error) {
                console.log(error)
                return response.badRequest({
                    code: 'FILE_NOT_UPLOADED',
                    message: 'No fue posible subir el archivo'
                })
            }
        }
    }
    public async get({ request, response }) {
        try {
            const key = request.all().key
            const url = await Drive.getUrl(key)
            response.send({
                url: url
            })
        } catch (error) {
            response.status('400')
            return response.badRequest({
                code: 'FILE_NOT_FOUND',
                message: 'No fue posible obtener el archivo'
            })
        }
    }
    public async delete({ request, response }) {
        try {
            const key = request.all().key
            await Drive.delete(key)
            response.send({
                message: 'Archivo eliminado correctamente'
            })
        } catch (error) {
            response.status('400')
            return response.badRequest({
                code: 'FILE_NOT_FOUND',
                message: 'No fue posible eliminar el archivo'
            })
        }
    }
}