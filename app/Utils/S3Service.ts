import Env from "@ioc:Adonis/Core/Env";

import AWS from 'aws-sdk'

AWS.config.update({
    accessKeyId: Env.get('S3_KEY'),
    secretAccessKey: Env.get('S3_SECRET'),
    region: Env.get('S3_REGION'),
    signatureVersion: 'v4'
});

const S3 = new AWS.S3()

export default class S3Service {
    public static getSignedUrl(key: string) {
        return S3.getSignedUrl('getObject', {
            Bucket: Env.get('S3_BUCKET'),
            Key: key,
            Expires: 300
        })
    }
}