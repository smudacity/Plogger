import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import {cors, httpErrorHandler} from 'middy/middlewares'
import {CreatePlogRequest} from '../../requests/CreatePlogRequest'
import {getUserId} from '../utils';
import {createPlog} from "../../businessLayer/plogOperations";
import {createLogger} from "../../utils/logger";

const logger = createLogger('CreatePlogLambda')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newPlog: CreatePlogRequest = JSON.parse(event.body)
    logger.info(`Creating a Plog item for userID: ${getUserId(event)}`)
    const newPlogItem = await createPlog(newPlog, getUserId(event))
    logger.info(`Successfully created a Plog item for userID: ${getUserId(event)}`)

      return {
          statusCode: 201,
          body: JSON.stringify( newPlogItem)
      }
  }
)

handler.use(
    cors({
        credentials: true
    })
)
    .use(httpErrorHandler())
