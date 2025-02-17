import { DateTime } from 'luxon'
import React, { useMemo } from 'react'
import { WeatherForecastItemOutput } from '../../../../listeners/background/loops/bgLoopWeatherForecast/types/WeatherForecastItemOutput'
import { FlexCol } from '../../../_shared/boxes/FlexCol'
import { ForecastTable } from './ForecastTable/ForecastTable'

type Props = {
  data: WeatherForecastItemOutput[]
}

export const WeatherForecastSection = ({ data, ...props }: Props) => {
  const dividedData = useMemo(() => {
    if (!data) return [[], []]

    const result: (WeatherForecastItemOutput & {
      datetime: DateTime
    })[][] = [[], []]

    const today = DateTime.now().startOf('day')
    const tomorrow = today.plus({ days: 1 })

    data.slice(0, 24).forEach((item, index) => {
      const itemDateTime = DateTime.now().plus({ hours: index })

      if (itemDateTime >= today && itemDateTime < tomorrow) {
        result[0].push({
          ...item,
          datetime: itemDateTime,
        })

        return
      }

      result[1].push({
        ...item,
        datetime: itemDateTime,
      })
    })

    return result
  }, [data])

  return (
    <FlexCol className="WeatherForecastSection" gap={24}>
      <ForecastTable type="today" items={dividedData[0]} />
      <ForecastTable type="tomorrow" items={dividedData[1]} />
    </FlexCol>
  )
}
