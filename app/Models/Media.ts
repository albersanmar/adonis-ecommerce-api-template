import {
    column,
    BaseModel,
    beforeCreate,
    beforeSave,
    computed,
    belongsTo,
    BelongsTo,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { string } from '@ioc:Adonis/Core/Helpers';

import User from 'App/Models/User';

import S3Service from 'App/Utils/S3Service';
import { v1 as uuidv1 } from "uuid";


export default class Media extends BaseModel {
    @column({
        isPrimary: true,
    })
    public id: string

    @column({ serializeAs: null })
    public basePath: string

    @column({ serializeAs: 'fileName' })
    public fileName: string

    @column({ serializeAs: 'fullPath' })
    public fullPath: string

    @column({ serializeAs: 'mimeType' })
    public mimeType: string

    @column({ serializeAs: null })
    public userId: string

    @computed()
    public get url() {
        return S3Service.getSignedUrl(this.fullPath)
    }

    @column.dateTime({
        autoCreate: true,
        serializeAs: 'createdAt',
        serialize: (value: DateTime) => {
            return value.setZone('utc').toISO()
        },
    })
    public createdAt: DateTime

    @column.dateTime({
        autoCreate: true,
        autoUpdate: true,
        serializeAs: 'updatedAt',
        serialize: (value: DateTime) => {
            return value.setZone('utc').toISO()
        },
    })
    public updatedAt: DateTime

    @beforeCreate()
    public static async assignId(media: Media) {
        if (!media.id) {
            media.id = uuidv1()
        }
    }

    @beforeSave()
    public static async saveFullPath(media: Media) {
        let basePath = string.dashCase(media.basePath.trim())
        if (basePath !== '' && basePath.charAt(0) === '/')
            basePath = basePath.slice(1)
        if (basePath !== '' && basePath.charAt(basePath.length - 1) !== '/')
            basePath += '/'

        const fileName = media.fileName.trim().replace('/', '')

        media.fullPath = basePath + fileName
    }

    @belongsTo(() => User)
    public user: BelongsTo<typeof User>
}