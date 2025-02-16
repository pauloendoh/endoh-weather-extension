import { Box } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { messageTypes } from '../../../utils/messageTypes'

type Props = {}

export const PopupContent = ({ ...props }: Props) => {
  const [response, setResponse] = useState<any>(null)
  useEffect(() => {
    chrome.runtime
      .sendMessage({
        type: messageTypes.getGeolocation,
      })
      .then((response) => {
        console.log('response', response)
        setResponse(response)
      })
  }, [])
  return (
    <Box>
      Heyo
      <Box>
        {JSON.stringify({
          response,
        })}
      </Box>
    </Box>
  )
}
