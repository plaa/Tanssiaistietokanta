import debug from 'debug'

export default function createDebugger(namespace : string) {
  return debug(`dance-organizer:${namespace}`)
}
