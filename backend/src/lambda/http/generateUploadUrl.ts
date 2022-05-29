import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import {createAttachmentPresignedUrl} from "../../businessLayer/plogOperations";
import {createLogger} from "../../utils/logger";

const logger = createLogger('GenerateUploadUrlLambda')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const plogId = event.pathParameters.plogId
      const generatedUploadURL = createAttachmentPresignedUrl(plogId)
      logger.info(`Generated and returning presigned URL for attaching to plogId: ${plogId}`)

      return {
          statusCode: 200,
          body: JSON.stringify(generatedUploadURL)
      }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
