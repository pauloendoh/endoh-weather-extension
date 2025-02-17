import { Table, Title } from '@mantine/core'
import { DateTime } from 'luxon'
import React from 'react'
import { WeatherForecastItemOutput } from '../../../../../listeners/background/loops/bgLoopWeatherForecast/types/WeatherForecastItemOutput'
import { FlexCol } from '../../../../_shared/boxes/FlexCol'

type Props = {
  type: 'today' | 'tomorrow'
  items: (WeatherForecastItemOutput & {
    datetime: DateTime
  })[]
}

export const ForecastTable = ({ ...props }: Props) => {
  if (props.items.length === 0) return null

  return (
    <FlexCol className="ForecastTable">
      <Title order={4}>{props.type === 'today' ? 'Today' : 'Tomorrow'}</Title>
      <Table>
        <tbody>
          {props.items.map((item, index) => (
            <tr
              key={item.datetime.toString()}
              style={{
                backgroundColor:
                  props.type === 'today' && (index === 3 || index === 0)
                    ? 'rgba(0, 0, 0, 1)'
                    : undefined,
              }}
            >
              <td width={40}>
                {parseInt(
                  item.datetime
                    .toLocaleString(DateTime.TIME_24_SIMPLE)
                    .slice(0, 2)
                )}
                h
              </td>

              <td width={64}>{item.temperature}°C</td>
              <td>{item.description}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </FlexCol>
  )
}
