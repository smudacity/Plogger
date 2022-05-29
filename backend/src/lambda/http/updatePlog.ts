import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getUserId } from '../utils'
import {UpdatePlogRequest} from "../../requests/UpdatePlogRequest";
import {createLogger} from "../../utils/logger";
import {updatePlog} from "../../businessLayer/plogOperations";

const logger = createLogger('UpdatePlog - handler')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      const plogId = event.pathParameters.plogId
      const updatedPlog: UpdatePlogRequest = JSON.parse(event.body)
      logger.info(`updating plog id: ${plogId} with value ${JSON.stringify(updatedPlog)}`)
      const updated = updatePlog(plogId, updatedPlog, getUserId(event))
      if (!!updated) {
          return {
              statusCode: 200,
              body: ''
          }
      } else {
          return {
              statusCode: 404,
              body: 'Plog with the given id is not found'
          }
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
