import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getUserId } from '../utils';
import {createLogger} from "../../utils/logger";
import {getPlogsForUser} from "../../businessLayer/plogOperations";
const logger = createLogger('getTodos')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const plogs = await getPlogsForUser(getUserId(event))
      logger.log('info', 'todos received')

      return {
          statusCode: 200,
          headers: {
              'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
              plogs
          })
      }
  })

handler.use(
  cors({
    credentials: true
  })
)
