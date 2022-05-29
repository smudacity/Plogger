import {CreatePlogRequest} from "../requests/CreatePlogRequest";
import {PlogItem} from "../models/PlogItem"
import * as uuid from 'uuid'
import {PlogsDBAccess} from "../dataLayer/plogsDbAccess";
import {createLogger} from "../utils/logger";
import {UpdatePlogRequest} from "../requests/UpdatePlogRequest";

const plogsDBAccess = new PlogsDBAccess()
const logger = createLogger('plogOperations.ts')

export async function createPlog(
    plogFromClient: CreatePlogRequest,
    userId: string): Promise<PlogItem> {
    logger.info(`Creating Plog item in db with title - ${plogFromClient.title}`)
    const plogId = uuid.v4()
    const newItem = await createPlogItem(plogId, userId, plogFromClient)

    return plogsDBAccess.createPlog(newItem)
}

function createPlogItem(plogId: string, userId: string, plogFromClient: CreatePlogRequest) {

    return {
        plogId: plogId,
        userId,
        createdAt: new Date().toISOString(),
        attachmentUrl: plogsDBAccess.getAttachmentUrlToView(plogId),
        ...plogFromClient
    }
}

export function createAttachmentPresignedUrl(plogId: string) {
    return plogsDBAccess.getUploadUrl(plogId)
}

export async function deletePlog(plogId: string, userId: string): Promise<boolean> {
    //Delete Plog entry with pogoId and userId by calling Data layer
    logger.info(`Delete initiated plogId: ${plogId} and userId: ${userId}`)
    const deletedPlog = await plogsDBAccess.deletePlog(plogId, userId)
    if (!!deletedPlog) {
        logger.info(`Delete Plog entry bearing id: ${plogId} successful. Now delete attachment too `)
        await plogsDBAccess.deleteAttachment(plogId)
        logger.info(`Delete attachment of plog bearing id: ${plogId} successful`)
        return true
    }

}


export function getPlogsForUser(userId: string): Promise<PlogItem[]> {
    return new PlogsDBAccess().getPlogsForUser(userId)
}

export async function updatePlog(plogId: string, updatedPlog: UpdatePlogRequest, userId: string) {
    const plogById = await plogsDBAccess.getPlogById(userId, plogId)
    if (!!plogById && plogById.Item) {
        const currentPlog = plogById.Item as PlogItem
        if (!!currentPlog && userId === currentPlog.userId) {
            currentPlog.title = updatedPlog.title
            currentPlog.comments = updatedPlog.comments
            currentPlog.location = updatedPlog.location

            const updated = await plogsDBAccess.updatePlog(currentPlog)
            logger.info(`Updated the plog item with new title : ${currentPlog.title}`)
            return updated
        }
    } else {
        return null;
    }

}
