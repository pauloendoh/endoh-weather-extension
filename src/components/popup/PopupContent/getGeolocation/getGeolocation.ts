export const getGeolocation = () => {
  chrome.offscreen.createDocument({
    url: 'offscreen.html',
    reasons: [
      chrome.offscreen.Reason.GEOLOCATION ||
        chrome.offscreen.Reason.DOM_SCRAPING,
    ],
    justification: 'geolocation access',
  })
}
