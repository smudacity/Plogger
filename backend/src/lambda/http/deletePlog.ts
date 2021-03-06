import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getUserId } from '../utils'
import {deletePlog} from "../../businessLayer/plogOperations";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const plogId = event.pathParameters.plogId
      console.log(plogId)
      // Call business logic to delete.
      const deleted = await deletePlog(plogId, getUserId(event))
      // If successful return 204
      // Since no body and successful
      if (deleted) {
          return {
              statusCode: 204,
              body: ''
          }
      }
      // If error throw 404 or 500
      return {
          statusCode: 404,
          body: ''
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
