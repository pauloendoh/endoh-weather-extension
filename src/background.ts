import { bgHandleGetGeolocation } from './listeners/background/handlers/bgHandleGetGeolocation'
import { messageTypes } from './utils/messageTypes'

// Also known as service worker script

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === messageTypes.getGeolocation) {
    // AFAIK, you can't use await and must return true (https://stackoverflow.com/a/20077854/27662253)
    bgHandleGetGeolocation().then((geolocation) => {
      sendResponse({
        lat: geolocation.coords.latitude,
        lon: geolocation.coords.longitude,
      })
    })
    return true
  }
})
