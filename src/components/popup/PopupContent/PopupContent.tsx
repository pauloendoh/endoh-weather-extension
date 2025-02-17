import { Box, Title, useMantineTheme } from '@mantine/core'
import React, { useEffect, useRef, useState } from 'react'
import { WeatherForecastItemOutput } from '../../../listeners/background/loops/bgLoopWeatherForecast/types/WeatherForecastItemOutput'
import { syncKeys } from '../../../utils/syncKeys'
import { getSync } from '../../../utils/syncStorageUtils'
import { WeatherForecastSection } from './WeatherForecastSection/WeatherForecastSection'

type Props = {}

export const PopupContent = ({ ...props }: Props) => {
  const fetchIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const retryCountRef = useRef(0)
  const [items, setItems] = useState<WeatherForecastItemOutput[]>([])
  const [loadingState, setLoadingState] = useState<
    'loading' | 'loaded' | 'not-found'
  >('loading')

  useEffect(() => {
    fetchIntervalRef.current = setInterval(async () => {
      retryCountRef.current += 1
      if (retryCountRef.current > 5) {
        setLoadingState('not-found')
        return
      }
      const items = await getSync<WeatherForecastItemOutput[]>(
        syncKeys.weatherForecastData
      )
      setItems(items || [])
      console.log({
        items,
      })
      clearInterval(fetchIntervalRef.current!)
      fetchIntervalRef.current = null
      setLoadingState('loaded')
    }, 1000)
  }, [])

  const theme = useMantineTheme()

  return (
    <Box>
      <Title
        order={3}
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          paddingTop: 8,
          paddingInline: 16,
          backgroundColor: theme.colors.dark[7],
        }}
      >
        Weather forecast
      </Title>
      <Box
        sx={{
          padding: 16,
        }}
      >
        {loadingState === 'loading' && 'Loading...'}
        {loadingState === 'not-found' && "Not found! Might be an error... '-'"}

        {loadingState === 'loaded' && items && (
          <WeatherForecastSection data={items} />
        )}
      </Box>
    </Box>
  )
}
