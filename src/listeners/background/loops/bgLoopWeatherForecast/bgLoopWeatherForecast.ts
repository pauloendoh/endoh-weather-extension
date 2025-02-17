import { syncKeys } from '../../../../utils/syncKeys'
import {
  getSync,
  removeSync,
  setSync,
} from '../../../../utils/syncStorageUtils'
import { bgHandleGetGeolocation } from '../../handlers/bgHandleGetGeolocation'
import { WeatherForecastItemOutput } from './types/WeatherForecastItemOutput'

export async function bgLoopWeatherForecast() {
  await fetchAndStoreForecastData()

  const previousInterval = await getSync<NodeJS.Timeout>(
    syncKeys.weatherForecastInterval
  )
  if (previousInterval) {
    // if i keep reloading my extension, i believe the interval continues to run in the background?
    // i would need to test this
    clearInterval(previousInterval)
    await removeSync(syncKeys.weatherForecastInterval)
  }

  await setSync(
    syncKeys.weatherForecastInterval,
    setInterval(
      () => {
        fetchAndStoreForecastData()
      },
      5 * 60 * 1000 // 5 minutes
    )
  )
}

async function fetchAndStoreForecastData() {
  const geolocation = await bgHandleGetGeolocation()

  const data: WeatherForecastItemOutput[] = await fetch(
    `https://endohio-server.herokuapp.com/weather-forecast?lat=${geolocation.coords.latitude}&lon=${geolocation.coords.longitude}`
  )
    .then((response) => response.json())
    .then((data) => {
      return data
    })
    .catch((error) => {
      console.log('error', error)
      chrome.action.setBadgeText({ text: 'ERR' })
      chrome.action.setBadgeBackgroundColor({ color: 'red' })
      throw error
    })

  const temperatureDifferenceIcon = (function () {
    if (data && data.length > 4) {
      const first = data[0].temperature
      const forth = data[3].temperature

      if (!first || !forth) return undefined

      const diff = forth - first
      if (diff > 0) {
        return '↑'
      }
      if (diff < 0) {
        return '↓'
      }

      return '★'
    }
  })()
  chrome.action.setBadgeText({
    text: `${data[0].temperature}° ${temperatureDifferenceIcon}`,
  })
  chrome.action.setBadgeBackgroundColor({ color: '#C862AC' })
  chrome.action.setBadgeTextColor({ color: 'white' })

  await setSync(syncKeys.weatherForecastData, data)
}
