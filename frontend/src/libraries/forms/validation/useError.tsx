import {useEffect, useState} from 'react'

import {useUpdateErrorContext} from './context'
import {useSchema, ValidationProps} from './useSchema'

export function useError(value, schemaDef : ValidationProps) {
  const schema = useSchema(schemaDef)
  const [error, setError] = useState(null)
  useEffect(
    () => {
      if (!schema) return
      schema.validate(value)
        .then(() => setError(null)).catch(setError)
    },
    [value, schema, setError]
  )
  useUpdateErrorContext(error)
  return error
}
