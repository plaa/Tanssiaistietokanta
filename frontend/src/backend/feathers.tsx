import {FetchResult} from '@apollo/client'
import feathers from '@feathersjs/client'
import {print} from 'graphql'
import io from 'socket.io-client'

import createDebug from 'utils/debug'

const debug = createDebug('graphql')

const isProd = process.env.NODE_ENV === 'production'

export const socket = isProd
  ? io('/', {path: '/api/socket.io'})
  : io('http://localhost:8082/')
// eslint-disable-next-line @typescript-eslint/ban-types
const app = (feathers as unknown as Function)()

app.configure(feathers.socketio(socket))
app.configure(feathers.authentication())

export default app

const graphQLService = app.service('graphql')

export async function runGraphQlQuery({query, variables}) : Promise<FetchResult<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>>> {
  debug('GraphQL query: %s\nVariables: %O', print(query), variables)
  const result = await graphQLService.find({query: {query, variables}})
  if (debug.enabled) {
    Object.keys(result).forEach(
      key => Object.keys(result[key]).forEach(
        dataKey => debug('%s.%s: %O', key, dataKey, result[key][dataKey])
      )
    )
  }
  return result
}
