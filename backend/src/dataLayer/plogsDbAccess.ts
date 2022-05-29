import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { PlogItem } from '../models/PlogItem'
import {createLogger} from "../utils/logger";


const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
})

const attachmentBucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION


const logger = createLogger('PlogsDBAccess')

export class PlogsDBAccess {

    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly plogsTable = process.env.PLOGS_TABLE) {
    }

    async createPlog(plogItem: PlogItem): Promise<PlogItem> {
        logger.info(`Writing  ${plogItem.title}  Plog item to db...`)

        await this.docClient.put({
            TableName: this.plogsTable,
            Item: plogItem
        }).promise().catch((e: any) => {
            logger.error(`Failed to create a plog item with title: ${plogItem.title} with error: `, e)
        })

        logger.info('The write of Plog item to db is successful.')

        return plogItem
    }


    getAttachmentUrlToView(plogId: string) {
        return `https://${attachmentBucketName}.s3.amazonaws.com/${plogId}`
    }

    getUploadUrl(plogId: string) {
        return s3.getSignedUrl('putObject', {
            Bucket: attachmentBucketName,
            Key: plogId,
            Expires: parseInt(urlExpiration)
        })
    }


    async getPlogsForUser(userId: string): Promise<PlogItem[]> {
        console.log('Getting all plog items')
        logger.log('info', 'Getting all plog items')

        const result = await this.docClient.query({
            TableName: this.plogsTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            },
            ScanIndexForward: false
        }).promise()

        const items = result.Items
        return items as PlogItem[]
    }

    async deleteAttachment(plogId: string) {
        await s3.deleteObject({
            Bucket: attachmentBucketName,
            Key: plogId
        }).promise().catch(e => {
            logger.error(`Failed deleting attachment for a Plog item bearing id : ${plogId}: `, e)
            return null
        })
    }

    async getPlogById(userId: string, plogId: string) {
        return await this.docClient.get({
            TableName: this.plogsTable,
            Key: {
                userId,
                plogId
            }
        }).promise()
    }


    async updatePlog(currentPlog: PlogItem) {
        await this.docClient.update({
            TableName: this.plogsTable,
            Key: {
                userId: currentPlog.userId,
                plogId: currentPlog.plogId
            },
            UpdateExpression: 'set #title = :title, #comments = :comments, #location = :location',
            ExpressionAttributeNames: {
                "#title": "title",
                "#comments": "comments",
                "#location": "location"
            },
            ExpressionAttributeValues: {
                ":title": currentPlog.title,
                ":comments": currentPlog.comments,
                ":location": currentPlog.location
            }
        }).promise().catch((e) => {
            logger.error(`Failed to update the Plog item for the user id: ${currentPlog.userId} with error: `, e)
            return null
        })
    }

    async deletePlog(plogId: string, userId: string) {
        try{
            const deletedNode = await this.docClient.delete({
                TableName: this.plogsTable,
                Key: {
                    userId,
                    plogId
                }
            }).promise()
            return deletedNode
        }catch(e: any){
            logger.error(`Error deleting plog bearing id: ${plogId}`)
            return null
        }

    }
}
